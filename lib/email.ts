import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSubmissionNotificationEmail(
  toEmail: string,
  ownerName: string,
  formName: string,
  submissionData: Record<string, unknown>,
  source: string,
) {
  try {
    const dataHtml = Object.entries(submissionData)
      .map(
        ([key, value]) =>
          `<p style="margin: 0 0 10px 0; font-size: 14px;">
             <strong style="color: #333; text-transform: capitalize;">${key.replace(/_/g, " ")}:</strong> 
             <span style="color: #555;">${String(value)}</span>
           </p>`,
      )
      .join("");

    await resend.emails.send({
      from: "Formix Notifications <noreply@formix.rikikashyap.dev>",
      to: toEmail,
      subject: `New Submission: ${formName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
             <span style="background-color: #0a0a0a; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1px;">FORMIX ALERT</span>
          </div>
          <h2 style="color: #111; text-align: center; margin-top: 0;">New Form Submission 🎉</h2>
          <p style="color: #444; font-size: 15px; line-height: 1.5; text-align: center;">
            Hi <strong>${ownerName}</strong>, you just received a new response for <strong>${formName}</strong> via ${source}.
          </p>
          <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            ${dataHtml}
          </div>
          <p style="color: #888; font-size: 12px; text-align: center; margin-bottom: 0;">
            You are receiving this because you have 'New Form Submissions' alerts enabled in your Formix settings.
          </p>
        </div>
      `,
    });
    console.log(`✅ Notification email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Failed to send submission notification email:", error);
  }
}
