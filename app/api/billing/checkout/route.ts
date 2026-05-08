import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dodoApiKey = process.env.DODO_API_KEY;
    const productId = process.env.DODO_PRO_PRICE_ID;

    if (!dodoApiKey || !productId) {
      console.error("Missing Dodo configurations in .env");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch("https://test.dodopayments.com/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dodoApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],
        customer: {
          email: session.user.email,
          name: session.user.name || "Formix User",
        },
        metadata: {
          userId: session.user.id,
        },
        return_url: `${appUrl}/dashboard/billing?success=true`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Dodo API Error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to generate checkout link." },
        { status: 500 },
      );
    }

    const checkoutUrl = data.checkout_url;

    if (!checkoutUrl) {
      console.error("No payment link in Dodo response:", data);
      return NextResponse.json(
        { error: "Invalid response from payment provider" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
