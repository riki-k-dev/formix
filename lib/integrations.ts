import { db } from "@/db";
import { formIntegrations, userIntegrations, forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { decryptConfig } from "./encryption"; // NEW

export async function triggerIntegrations(
  formRecord: typeof forms.$inferSelect,
  submissionId: string,
  submissionData: Record<string, unknown>,
  source: "api" | "whatsapp" | "web",
) {
  try {
    const promises: Promise<unknown>[] = [];

    if (formRecord.hasWebhook && formRecord.webhookUrl) {
      const basicWebhookPromise = fetch(formRecord.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Formix-Webhook-Engine/2.0",
        },
        body: JSON.stringify({
          event: "form.submitted",
          formId: formRecord.id,
          formName: formRecord.name,
          submissionId: submissionId,
          source: source,
          timestamp: new Date().toISOString(),
          data: submissionData,
        }),
      }).catch((err) => console.error(`[Basic Webhook Failed]:`, err));
      promises.push(basicWebhookPromise);
    }

    const activeIntegrations = await db
      .select({
        provider: userIntegrations.provider,
        credentials: userIntegrations.credentials,
        type: formIntegrations.type,
        config: formIntegrations.config,
      })
      .from(formIntegrations)
      .innerJoin(
        userIntegrations,
        eq(formIntegrations.integrationId, userIntegrations.id),
      )
      .where(
        and(
          eq(formIntegrations.formId, formRecord.id),
          eq(formIntegrations.isActive, true),
          eq(userIntegrations.isActive, true),
        ),
      );

    activeIntegrations.forEach((integration) => {
      try {
        const creds = JSON.parse(decryptConfig(integration.credentials));
        const config = JSON.parse(decryptConfig(integration.config));

        // A. SLACK
        if (
          integration.provider === "slack" &&
          integration.type === "slack_channel_message"
        ) {
          const webhookUrl = creds.webhookUrl || config.webhookUrl;
          if (!webhookUrl) return;
          const dataFields = Object.entries(submissionData)
            .map(([key, value]) => `*${key}:*\n${String(value)}`)
            .join("\n\n");
          const slackPayload = {
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: `📬 New Submission: ${formRecord.name}`,
                },
              },
              {
                type: "context",
                elements: [
                  {
                    type: "mrkdwn",
                    text: `*Source:* ${source.toUpperCase()} | *ID:* ${submissionId}`,
                  },
                ],
              },
              { type: "divider" },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: dataFields || "No data provided.",
                },
              },
            ],
          };
          const slackPromise = fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slackPayload),
          }).catch((err) => console.error(`[Slack Dispatch Failed]:`, err));
          promises.push(slackPromise);
        }

        // B. DISCORD
        if (
          integration.provider === "discord" &&
          integration.type === "discord_channel_message"
        ) {
          const webhookUrl = creds.webhookUrl || config.webhookUrl;
          if (!webhookUrl) return;
          const fields = Object.entries(submissionData).map(
            ([name, value]) => ({
              name: name.substring(0, 256),
              value: String(value).substring(0, 1024),
              inline: true,
            }),
          );
          const discordPayload = {
            embeds: [
              {
                title: `New Submission: ${formRecord.name}`,
                color: 1493060,
                fields: fields,
                footer: { text: `Source: ${source} | ID: ${submissionId}` },
                timestamp: new Date().toISOString(),
              },
            ],
          };
          const discordPromise = fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordPayload),
          }).catch((err) => console.error(`[Discord Dispatch Failed]:`, err));
          promises.push(discordPromise);
        }

        // C. GOOGLE SHEETS
        if (
          integration.provider === "google_sheets" &&
          integration.type === "sheet_row_add"
        ) {
          const accessToken = creds.accessToken;
          const spreadsheetId = config.spreadsheetId;
          const sheetName = config.sheetName || "Sheet1";
          if (!accessToken || !spreadsheetId) return;
          const rowValues = Object.values(submissionData).map((val) =>
            String(val),
          );
          rowValues.unshift(new Date().toISOString(), submissionId);
          const sheetsPromise = fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ values: [rowValues] }),
            },
          ).catch((err) =>
            console.error(`[Google Sheets Dispatch Failed]:`, err),
          );
          promises.push(sheetsPromise);
        }

        // D. ZAPIER
        if (
          integration.provider === "zapier" ||
          integration.provider === "webhook"
        ) {
          const webhookUrl = creds.webhookUrl || config.webhookUrl;
          if (!webhookUrl) return;
          const zapierPromise = fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              form_id: formRecord.id,
              form_name: formRecord.name,
              submission_id: submissionId,
              source: source,
              submitted_at: new Date().toISOString(),
              ...submissionData,
            }),
          }).catch((err) => console.error(`[Zapier Dispatch Failed]:`, err));
          promises.push(zapierPromise);
        }

        // E. NOTION
        if (
          integration.provider === "notion" &&
          integration.type === "notion_database_add"
        ) {
          const accessToken = creds.accessToken;
          const databaseId = config.databaseId;
          if (!accessToken || !databaseId) return;
          const childrenBlocks = Object.entries(submissionData).map(
            ([key, value]) => ({
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  {
                    type: "text",
                    text: { content: `${key}: ` },
                    annotations: { bold: true },
                  },
                  { type: "text", text: { content: String(value) } },
                ],
              },
            }),
          );
          const notionPayload = {
            parent: { database_id: databaseId },
            properties: {
              Name: {
                title: [
                  {
                    text: {
                      content: `Submission - ${new Date().toLocaleString()}`,
                    },
                  },
                ],
              },
            },
            children: childrenBlocks,
          };
          const notionPromise = fetch("https://api.notion.com/v1/pages", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              "Notion-Version": "2022-06-28",
            },
            body: JSON.stringify(notionPayload),
          }).catch((err) => console.error(`[Notion Dispatch Failed]:`, err));
          promises.push(notionPromise);
        }

        // F. AIRTABLE
        if (
          integration.provider === "airtable" &&
          integration.type === "airtable_record_add"
        ) {
          const personalAccessToken = creds.accessToken;
          const baseId = config.baseId;
          const tableIdOrName = config.tableId;
          if (!personalAccessToken || !baseId || !tableIdOrName) return;
          const airtablePayload = { records: [{ fields: submissionData }] };
          const airtablePromise = fetch(
            `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${personalAccessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(airtablePayload),
            },
          ).catch((err) => console.error(`[Airtable Dispatch Failed]:`, err));
          promises.push(airtablePromise);
        }
      } catch (err) {
        console.error(
          `[Integration Parsing Error - ${integration.provider}]:`,
          err,
        );
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error("[Dispatcher Core Error]:", error);
  }
}
