import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  whatsappConfigs,
  whatsappSessions,
  forms,
  submissions,
  activities,
} from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { triggerIntegrations } from "@/lib/integrations";

async function sendWhatsAppMessage(
  to: string,
  text: string,
  token: string,
  phoneId: string,
) {
  try {
    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: {
        preview_url: false,
        body: text,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[WhatsApp API Error]:", JSON.stringify(data, null, 2));
      return false;
    }

    return true;
  } catch (error) {
    console.error("[WhatsApp API Fetch Error]:", error);
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token) {
      const config = await db.query.whatsappConfigs.findFirst({
        where: eq(whatsappConfigs.verifyToken, token),
      });

      if (config) return new NextResponse(challenge, { status: 200 });
      return new NextResponse("Forbidden", { status: 403 });
    }
    return new NextResponse("Bad Request", { status: 400 });
  } catch (error) {
    console.error("Webhook GET Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          const value = change.value;

          if (value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const phoneNumberId = value.metadata.phone_number_id;
            const fromNumber = message.from;
            const msgBody = message.text?.body;

            if (!msgBody) continue;

            const config = await db.query.whatsappConfigs.findFirst({
              where: eq(whatsappConfigs.phoneNumberId, phoneNumberId),
            });

            if (!config) continue;

            const activeSession = await db.query.whatsappSessions.findFirst({
              where: and(
                eq(whatsappSessions.userPhoneNumber, fromNumber),
                eq(whatsappSessions.businessPhoneNumberId, phoneNumberId),
                eq(whatsappSessions.status, "active"),
              ),
            });

            if (!activeSession) {
              let selectedFormId = null;
              const refMatch =
                msgBody.match(/\[ref:(frm_[a-zA-Z0-9]+)\]/i) ||
                msgBody.match(/START\s+(frm_[a-zA-Z0-9]+)/i);

              if (refMatch && refMatch[1]) {
                selectedFormId = refMatch[1];
              }

              const activeForms = await db.query.forms.findMany({
                where: and(
                  eq(forms.userId, config.userId),
                  eq(forms.hasWhatsapp, true),
                  eq(forms.status, "active"),
                ),
                orderBy: [desc(forms.createdAt)],
              });

              if (activeForms.length === 0) {
                await sendWhatsAppMessage(
                  fromNumber,
                  "Sorry, this business is currently offline.",
                  config.accessToken,
                  phoneNumberId,
                );
                continue;
              }

              let formToStart = null;

              if (selectedFormId) {
                formToStart = activeForms.find((f) => f.id === selectedFormId);
              } else if (activeForms.length === 1) {
                formToStart = activeForms[0];
              }

              if (!formToStart) {
                let menuText =
                  "👋 Hi! Welcome to our business.\nWe have multiple forms available. Please reply with the exact command below to start:\n\n";
                activeForms.forEach((f) => {
                  menuText += `👉 *${f.name}*\nReply: START ${f.id}\n\n`;
                });

                await sendWhatsAppMessage(
                  fromNumber,
                  menuText,
                  config.accessToken,
                  phoneNumberId,
                );
                continue;
              }

              const schema = JSON.parse(formToStart.schema || "{}");
              if (!schema.fields || schema.fields.length === 0) continue;

              await db.insert(whatsappSessions).values({
                formId: formToStart.id,
                userPhoneNumber: fromNumber,
                businessPhoneNumberId: phoneNumberId,
                currentStep: 0,
                collectedData: JSON.stringify({}),
                status: "active",
              });

              const firstQ = schema.fields[0].label;
              const welcomeText = `👋 Hi! Welcome to *${formToStart.name}*.\n\nLet's get started.\n\n${firstQ}`;
              await sendWhatsAppMessage(
                fromNumber,
                welcomeText,
                config.accessToken,
                phoneNumberId,
              );
            } else {
              const formRecord = await db.query.forms.findFirst({
                where: eq(forms.id, activeSession.formId),
              });

              if (!formRecord) continue;
              const schema = JSON.parse(formRecord.schema || "{}");
              const fields = schema.fields || [];
              const currentStep = activeSession.currentStep;

              if (currentStep < fields.length) {
                const currentField = fields[currentStep];
                const existingData = activeSession.collectedData
                  ? JSON.parse(activeSession.collectedData)
                  : {};
                const updatedData = {
                  ...existingData,
                  [currentField.name]: msgBody,
                };
                const nextStep = currentStep + 1;

                if (nextStep < fields.length) {
                  await db
                    .update(whatsappSessions)
                    .set({
                      currentStep: nextStep,
                      collectedData: JSON.stringify(updatedData),
                    })
                    .where(eq(whatsappSessions.id, activeSession.id));

                  await sendWhatsAppMessage(
                    fromNumber,
                    fields[nextStep].label,
                    config.accessToken,
                    phoneNumberId,
                  );
                } else {
                  await db
                    .update(whatsappSessions)
                    .set({
                      currentStep: nextStep,
                      collectedData: JSON.stringify(updatedData),
                      status: "completed",
                    })
                    .where(eq(whatsappSessions.id, activeSession.id));

                  await sendWhatsAppMessage(
                    fromNumber,
                    "✅ Thank you! Your response has been securely recorded.",
                    config.accessToken,
                    phoneNumberId,
                  );

                  try {
                    const submissionId = crypto.randomUUID();
                    await db.insert(submissions).values({
                      id: submissionId,
                      formId: activeSession.formId,
                      data: JSON.stringify(updatedData),
                    });

                    await db
                      .update(forms)
                      .set({
                        submissionsCount:
                          (formRecord.submissionsCount || 0) + 1,
                      })
                      .where(eq(forms.id, formRecord.id));

                    await db.insert(activities).values({
                      userId: formRecord.userId,
                      title: "New WhatsApp Submission",
                      message: `A new response was received via WhatsApp for ${formRecord.name}.`,
                      type: "success",
                    });

                    await triggerIntegrations(
                      formRecord,
                      submissionId,
                      updatedData,
                      "whatsapp",
                    );

                    console.log(
                      "🎉 FORM COMPLETED! Saved to DB & Triggered Integrations.",
                    );
                  } catch (err) {
                    console.error("Failed to trigger integrations/save:", err);
                  }
                }
              }
            }
          }
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Webhook POST Error:", error);
    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  }
}
