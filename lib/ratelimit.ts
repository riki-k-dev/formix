import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 1. AI Generation Limiter (Tied to user ID, prevents Groq API abuse)
export const aiGenerationRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 generations per minute per user
  analytics: true,
  prefix: "formix_ai_gen",
});

// 2. Public Submission Limiter (IP based, prevents form spam)
export const submissionRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 submissions per minute per IP
  analytics: true,
  prefix: "formix_submit",
});

// 3. Contact Form Limiter (Strict IP based, prevents email bombing/abuse)
export const contactRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 messages per hour per IP
  analytics: true,
  prefix: "formix_contact",
});

// 4. Dashboard API Limiter (User ID based, prevents DB DDoS from authenticated users)
export const dashboardApiRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute per user
  analytics: true,
  prefix: "formix_dashboard",
});

// 5. WhatsApp Webhook Limiter (IP based, Meta can send bursts but stops DDoS)
export const webhookRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(300, "1 m"), // 300 requests per minute per IP
  analytics: true,
  prefix: "formix_wa_webhook",
});
