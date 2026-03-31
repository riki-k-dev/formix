import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, whatsappConfigs, whatsappSessions } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WhatsAppFlowsClient from "./whatsapp-client";

type SchemaField = { label: string; name: string; type: string };

export default async function WhatsAppFlowsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const userForms = await db.query.forms.findMany({
    where: eq(forms.userId, session.user.id),
    orderBy: [desc(forms.createdAt)],
  });

  const config = await db.query.whatsappConfigs.findFirst({
    where: eq(whatsappConfigs.userId, session.user.id),
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com";
  const initialMetaConfig = config
    ? {
        webhookUrl: `${appUrl}/api/whatsapp/webhook`,
        verifyToken: config.verifyToken,
      }
    : null;

  const waEnabledForms = userForms.filter((f) => f.hasWhatsapp);
  const availableForms = userForms.filter((f) => !f.hasWhatsapp);

  const formIds = waEnabledForms.map((f) => f.id);
  let allSessions: (typeof whatsappSessions.$inferSelect)[] = [];

  if (formIds.length > 0) {
    allSessions = await db.query.whatsappSessions.findMany({
      where: inArray(whatsappSessions.formId, formIds),
    });
  }

  const flows = waEnabledForms.map((form) => {
    const formSessions = allSessions.filter((s) => s.formId === form.id);
    const messagesSent = formSessions.length * 3;

    const schema = (form.schema as { fields: SchemaField[] }) || { fields: [] };

    const previewChat = [];
    if (schema.fields && schema.fields.length > 0) {
      const firstField = schema.fields[0];
      const secondField = schema.fields.length > 1 ? schema.fields[1] : null;

      previewChat.push({
        sender: "bot",
        text: `👋 Hi! Welcome to ${form.name}.\n\nLet's get started. ${firstField?.label || "What is your answer?"}`,
      });
      previewChat.push({ sender: "user", text: "User's response here..." });

      if (secondField) {
        previewChat.push({ sender: "bot", text: secondField.label });
      } else {
        previewChat.push({
          sender: "bot",
          text: "Thank you for your response! ✨",
        });
      }
    } else {
      previewChat.push({
        sender: "bot",
        text: "Form schema is empty. Please add fields to see a preview.",
      });
    }

    return {
      id: form.id,
      formName: form.name,
      phone: config?.phoneNumber ? `+${config.phoneNumber}` : "Unassigned",
      status: form.whatsappStatus,
      messagesSent,
      previewChat,
    };
  });

  return (
    <WhatsAppFlowsClient
      initialFlows={flows}
      availableForms={availableForms.map((f) => ({ id: f.id, name: f.name }))}
      initialMetaConfig={initialMetaConfig}
    />
  );
}
