import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { generateFormValidator } from "@/lib/validators";
import { aiGenerationRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing in .env");
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. STRICT RATE LIMITING (Upstash) - Per User ID
    const { success, limit, reset, remaining } =
      await aiGenerationRateLimit.limit(session.user.id);

    if (!success) {
      return NextResponse.json(
        {
          error:
            "Too many AI generation requests. Please try again in a minute.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    // 2. CHECK AI GENERATION QUOTAS (Database)
    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: { plan: true, aiGenerationsCount: true },
    });

    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (dbUser.plan === "starter" && dbUser.aiGenerationsCount >= 3) {
      return NextResponse.json(
        {
          error:
            "AI generation limit reached for Starter plan. Please upgrade to Pro.",
        },
        { status: 403 },
      );
    }

    const body = await req.json();

    // 3. STRICT INPUT SANITIZATION (Zod) - Drops malicious injection
    const parsedBody = generateFormValidator.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0].message },
        { status: 400 },
      );
    }

    const { prompt } = parsedBody.data;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemInstruction = `
      You are an expert form schema architect for a headless form builder called Formix.
      Generate a structured JSON schema based on the user's prompt.
      You MUST return ONLY a valid JSON object. 
      Required JSON Format:
      {
        "name": "A catchy, short name for the form",
        "description": "A 1-2 sentence description",
        "fields": [
          {
            "name": "field_name_in_snake_case",
            "label": "Human Readable Label",
            "type": "text | email | number | textarea | select | radio | checkbox | file",
            "required": true,
            "options": ["Option 1", "Option 2"]
          }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0]?.message?.content;
    if (!responseText) throw new Error("Groq returned an empty response.");

    const parsedSchema = JSON.parse(responseText);
    const formId = `frm_${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}`;

    // 4. DATABASE INSERT
    const [newForm] = await db
      .insert(forms)
      .values({
        id: formId,
        userId: session.user.id,
        name: parsedSchema.name || "Untitled AI Form",
        description: parsedSchema.description || "",
        schema: parsedSchema,
        status: "active",
        hasWhatsapp: false,
        hasWebhook: false,
      })
      .returning();

    // 5. INCREMENT USAGE
    await db
      .update(user)
      .set({ aiGenerationsCount: sql`${user.aiGenerationsCount} + 1` })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true, form: newForm });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to generate form." },
      { status: 500 },
    );
  }
}
