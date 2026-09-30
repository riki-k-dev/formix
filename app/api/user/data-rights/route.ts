import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendDataRightsRequestEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestType, details } = await req.json();

    if (!requestType || !details) {
      return NextResponse.json(
        { error: "Request type and details are required." },
        { status: 400 },
      );
    }

    // Trigger the email to the Grievance Officer
    await sendDataRightsRequestEmail(
      session.user.email,
      session.user.name,
      requestType,
      details,
    );

    return NextResponse.json({
      success: true,
      message: "Request sent successfully",
    });
  } catch (error) {
    console.error("Data Rights API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
