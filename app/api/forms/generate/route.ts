import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { headers } from "next/headers";
import { generateFormValidator } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    console.log("1. Starting Groq AI generation process...");

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing in .env");
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      console.log("Auth Failed: No active session found");
      return NextResponse.json(
        { error: "Unauthorized - Please login again" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const parsedBody = generateFormValidator.safeParse(body);

    if (!parsedBody.success) {
      const errorMessage = parsedBody.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { prompt } = parsedBody.data;

    console.log("2. Prompt received:", prompt);
    console.log("3. Prompting Groq (Llama-3)...");

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemInstruction = `
      You are an expert form schema architect for a headless form builder called Formix.
      Generate a structured JSON schema based on the user's prompt.
      You MUST return ONLY a valid JSON object. 
      
      Required JSON Format:
      {
        "name": "A catchy, short name for the form",
        "description": "A 1-2 sentence description of what the form is for",
        "fields": [
          {
            "name": "field_name_in_snake_case",
            "label": "Human Readable Label",
            "type": "text | email | number | textarea | select | radio | checkbox",
            "required": true,
            "options": ["Option 1", "Option 2"] // Only include if type is select, radio, or checkbox
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

    if (!responseText) {
      throw new Error("Groq returned an empty response.");
    }

    console.log("4. AI Response received. Parsing JSON...");

    const parsedSchema = JSON.parse(responseText);

    const formId = `frm_${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}`;

    console.log("5. Saving to Neon Database...");
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

    console.log("6. Success! Form saved:", newForm.id);

    return NextResponse.json({ success: true, form: newForm });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("AI Generation Error Details:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Failed to generate form. Please try again." },
      { status: 500 },
    );
  }
}
