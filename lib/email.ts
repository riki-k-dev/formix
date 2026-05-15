import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Formix Notifications <noreply@formix.rikikashyap.dev>";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://formix.rikikashyap.dev";

// 1. Welcome to Pro (Upgrade Success)
export async function sendWelcomeProEmail(toEmail: string, userName: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: "Welcome to Formix Pro! 🚀",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
          <h2 style="font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">You're now a Pro, ${userName}!</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #444;">Your account has been successfully upgraded. You now have unlimited access to all premium features.</p>
          <div style="background: #f9fafb; border: 1px solid #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-weight: 600; color: #111;">What's new in your toolkit:</p>
            <ul style="margin-top: 10px; padding-left: 20px; color: #555; line-height: 1.6;">
              <li>Unlimited AI Form Generations</li>
              <li>Official WhatsApp Flow Integration</li>
              <li>Advanced Webhooks & Third-party Integrations</li>
              <li>Unlimited Monthly Submissions</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; letter-spacing: 0.5px;">Go to Dashboard</a>
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 32px; padding-top: 16px; border-top: 1px solid #eaeaea; text-align: center;">
            Thank you for supporting Formix. If you have any questions, just reply to this email.
          </p>
        </div>
      `,
    });
    console.log(`✅ Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Welcome Pro Email Error:", error);
  }
}

// 2. Subscription Cancelled (Confirmation)
export async function sendSubscriptionCancelledEmail(
  toEmail: string,
  expiryDate: string,
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: "Subscription Cancelled: Formix Pro",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: 600; margin-top: 0;">Your subscription has been cancelled</h2>
          <p style="font-size: 15px; line-height: 1.5; color: #444;">We're sorry to see you go. Your Pro features will remain active until the end of your billing cycle on <strong>${expiryDate}</strong>.</p>
          <p style="font-size: 15px; line-height: 1.5; color: #444;">After this date, your account will move back to the Starter plan.</p>
          <div style="margin-top: 24px;">
            <a href="${APP_URL}/dashboard/billing" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">Renew Subscription</a>
          </div>
        </div>
      `,
    });
    console.log(`✅ Cancellation email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Cancel Email Error:", error);
  }
}

// 3. Payment Failed (Critical)
export async function sendPaymentFailedEmail(toEmail: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: "Action Required: Payment Failed for Formix Pro",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111; border: 2px solid #fee2e2; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #dc2626; font-size: 20px; margin-top: 0;">Payment Unsuccessful</h2>
          <p style="font-size: 15px; line-height: 1.5; color: #444;">We were unable to process the latest payment for your Pro plan. Please update your payment method to avoid any service interruption.</p>
          <div style="margin-top: 24px;">
            <a href="${APP_URL}/dashboard/billing" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">Update Billing Info</a>
          </div>
        </div>
      `,
    });
    console.log(`✅ Payment failed email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Payment Failed Email Error:", error);
  }
}

// 4. 7-Day Renewal Reminder (Engagement)
export async function sendRenewalReminderEmail(
  toEmail: string,
  renewalDate: string,
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: "Upcoming Renewal: Your Formix Pro Plan",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="background-color: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">UPCOMING RENEWAL</span>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">Hi there, just a friendly heads-up that your Formix Pro plan will automatically renew on <strong>${renewalDate}</strong>.</p>
          <p style="font-size: 15px; line-height: 1.5; color: #555;">The subscription amount will be charged to your card on file. You don't need to do anything to keep your Pro features active.</p>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eaeaea; text-align: center;">
            <a href="${APP_URL}/dashboard/billing" style="font-size: 14px; color: #6b7280; text-decoration: underline;">Manage billing settings</a>
          </div>
        </div>
      `,
    });
    console.log(`✅ Renewal reminder email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Renewal Reminder Email Error:", error);
  }
}

// 5. Function for form submissions
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
      from: FROM_EMAIL,
      to: toEmail,
      subject: `New Submission: ${formName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
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

// 6. Goodbye Email (Account Deletion)
export async function sendGoodbyeEmail(toEmail: string, userName: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: "Confirmation: Your Formix account has been deleted",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #111; margin-top: 0;">Account Deleted Successfully</h2>
          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            Hi ${userName},<br><br>
            We are writing to confirm that your Formix account and all associated data—including your schemas, API keys, and submissions—have been permanently deleted as per your request.
          </p>
          <div style="background-color: #fff4f2; border: 1px solid #fee2e2; padding: 15px; border-radius: 8px; margin: 25px 0;">
             <p style="margin: 0; font-size: 13px; color: #b91c1c;">
               <strong>Security Note:</strong> In compliance with our privacy policy, your data has been completely erased from our servers and cannot be recovered.
             </p>
          </div>
          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            We're sorry to see you go! We are constantly striving to improve our infrastructure for developers. If you have a moment, we would highly appreciate any feedback you might have—simply reply to this email.
          </p>
          <p style="color: #111; font-size: 15px; font-weight: 600; margin-top: 30px;">
            Best wishes,<br>
            The Formix Team
          </p>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-bottom: 0;">
            Formix - AI-Powered Headless Forms Infrastructure
          </p>
        </div>
      `,
    });
    console.log(`✅ Goodbye email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Goodbye Email Error:", error);
  }
}
