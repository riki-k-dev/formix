import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormValidator } from "@/lib/validators";
import { contactRateLimit } from "@/lib/ratelimit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. RATE LIMITING CHECK
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "anonymous_ip";
    const { success, limit, reset, remaining } =
      await contactRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
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

    const body = await req.json();

    // 2. SERVER-SIDE VALIDATION
    const parsedBody = contactFormValidator.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: parsedBody.error.issues[0].message },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, subject, message } = parsedBody.data;

    // 3. SEND EMAIL
    await resend.emails.send({
      from: "Formix Website <noreply@formix.rikikashyap.dev>",
      to: "support@formix.rikikashyap.dev",
      replyTo: email,
      subject: `New Contact Request: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2 style="color: #000;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 },
    );
  }
}
