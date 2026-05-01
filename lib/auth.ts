import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendResetPassword: async ({ user, url }: any) => {
      try {
        await resend.emails.send({
          from: "Formix Website <noreply@formix.rikikashyap.dev>",
          to: user.email,
          subject: "Reset your Formix password",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
              <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: left;">
                <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">
                  Reset your password
                </h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                  Hi ${user.name},<br><br>
                  Someone recently requested a password change for your Formix account. If this was you, you can set a new password here:
                </p>
                <div style="text-align: center; margin-bottom: 32px;">
                  <a href="${url}" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
                    Reset Password
                  </a>
                </div>
                <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-bottom: 0;">
                  If you didn't request this, you can safely ignore this email. Your password won't be changed.
                </p>
              </div>
            </div>
          `,
        });
        console.log(`✅ Password reset email sent to ${user.email}`);
      } catch (error) {
        console.error("❌ Failed to send password reset email:", error);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendVerificationEmail: async ({ user, url }: any) => {
      try {
        await resend.emails.send({
          from: "Formix Website <noreply@formix.rikikashyap.dev>",
          to: user.email,
          subject: "Verify your Formix account",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
              <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: left;">
                
                <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">
                  Welcome to Formix!
                </h1>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                  Hi ${user.name},<br><br>
                  Thanks for signing up. To get started building AI-powered headless forms and APIs, please verify your email address by clicking the button below.
                </p>
                
                <div style="text-align: center; margin-bottom: 32px;">
                  <a href="${url}" style="display: inline-block; background-color: #0a0a0a; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
                    Verify Email Address
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-bottom: 0;">
                  If the button doesn't work, you can copy and paste this link into your browser:<br>
                  <a href="${url}" style="color: #3b82f6; word-break: break-all;">${url}</a>
                </p>
                
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
                
                <p style="color: #9ca3af; font-size: 12px; line-height: 16px; margin: 0;">
                  If you didn't request this email, there's nothing to worry about. You can safely ignore it.
                </p>
              </div>
              
              <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
                &copy; ${new Date().getFullYear()} Formix. All rights reserved.
              </p>
            </div>
          `,
        });
        console.log(`✅ Verification email sent successfully to ${user.email}`);
      } catch (error) {
        console.error("❌ Failed to send verification email:", error);
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
