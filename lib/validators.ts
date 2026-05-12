import { z } from "zod";

export const generateFormValidator = z.object({
  prompt: z
    .string()
    .trim()
    .min(5, "Prompt must be at least 5 characters long")
    .max(1000, "Prompt is too long, keep it under 1000 characters"),
});

export const formFieldValidator = z.object({
  name: z.string().min(1, "Field name is required").max(100),
  label: z.string().min(1, "Field label is required").max(100),
  type: z.enum([
    "text",
    "email",
    "number",
    "textarea",
    "select",
    "radio",
    "checkbox",
    "url",
    "file",
  ]),
  required: z.boolean(),
  options: z.array(z.string().max(100)).optional(),
});

// Extract the inferred type to use in our dynamic validator
export type FormField = z.infer<typeof formFieldValidator>;

export const updateFormValidator = z.object({
  formId: z.string().min(1, "Form ID is required"),
  name: z.string().trim().min(1, "Form name is required").max(100),
  description: z.string().trim().max(500).optional().nullable(),
  schema: z.object({
    name: z.string().trim().max(100),
    description: z.string().trim().max(500).optional().nullable(),
    fields: z.array(formFieldValidator),
  }),
});

export const contactFormValidator = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email is too long"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(100, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export const updateProfileValidator = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
});

export const whatsappConfigValidator = z.object({
  phoneNumberId: z
    .string()
    .trim()
    .min(5, "Invalid Phone Number ID")
    .max(50, "Invalid Phone Number ID")
    .regex(/^\d+$/, "Phone Number ID must contain only numbers"),
  phoneNumber: z
    .string()
    .trim()
    .min(5, "Invalid Phone Number")
    .max(20, "Invalid Phone Number")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
  accessToken: z
    .string()
    .trim()
    .min(20, "Invalid Access Token")
    .max(500, "Access Token is too long"),
});

// UTILITIES & DYNAMIC VALIDATION

export function validateWebhookUrl(
  provider: string,
  url: string,
): { isValid: boolean; error?: string } {
  if (!url || !url.startsWith("https://")) {
    return { isValid: false, error: "URL must be a valid secure HTTPS link." };
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // 1. SSRF PROTECTION: Block Private IPv4 Addresses & Link-Local (AWS/GCP Metadata)
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isIp) {
      const parts = hostname.split(".").map(Number);
      if (
        parts[0] === 10 || 
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || 
        (parts[0] === 192 && parts[1] === 168) || 
        parts[0] === 127 || 
        parts[0] === 0 || 
        (parts[0] === 169 && parts[1] === 254) 
      ) {
        return {
          isValid: false,
          error: "Internal or private IP addresses are strictly prohibited.",
        };
      }
    }

    // 2. SSRF PROTECTION: Block common internal hostnames
    const forbiddenHostnames = ["localhost", "metadata.google.internal"];
    if (forbiddenHostnames.includes(hostname)) {
      return {
        isValid: false,
        error: "Local or internal hostnames are not allowed.",
      };
    }

    // 3. Provider-Specific Format Validation
    switch (provider) {
      case "discord":
        if (
          !parsedUrl.hostname.includes("discord.com") ||
          !parsedUrl.pathname.startsWith("/api/webhooks/")
        ) {
          return {
            isValid: false,
            error: "Invalid Discord Webhook URL format.",
          };
        }
        break;
      case "slack":
        if (
          !parsedUrl.hostname.includes("hooks.slack.com") ||
          !parsedUrl.pathname.startsWith("/services/")
        ) {
          return { isValid: false, error: "Invalid Slack Webhook URL format." };
        }
        break;
      case "zapier":
        if (
          !parsedUrl.hostname.includes("hooks.zapier.com") ||
          !parsedUrl.pathname.startsWith("/hooks/catch/")
        ) {
          return {
            isValid: false,
            error: "Invalid Zapier Catch Hook URL format.",
          };
        }
        break;
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: "Malformed URL provided." };
  }
}

// Dynamically validates incoming submission data against the generated JSON schema
export function validateDynamicSubmission(
  schemaFields: FormField[],
  submissionData: unknown,
) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of schemaFields) {
    let baseValidator: z.ZodTypeAny;

    switch (field.type) {
      case "email":
        baseValidator = z
          .string()
          .trim()
          .email("Invalid email format")
          .max(100);
        if (field.required)
          baseValidator = (baseValidator as z.ZodString).min(
            1,
            "This field is required",
          );
        break;
      case "number":
        baseValidator = z
          .union([
            z.number(),
            z.string().regex(/^-?\d*\.?\d+$/, "Must be a valid number"),
          ])
          .transform(Number);
        break;
      case "url":
      case "file":
        baseValidator = z.string().trim().url("Invalid URL format").max(1000);
        if (field.required)
          baseValidator = (baseValidator as z.ZodString).min(
            1,
            "This field is required",
          );
        break;
      case "textarea":
        baseValidator = z.string().trim().max(3000, "Text is too long");
        if (field.required)
          baseValidator = (baseValidator as z.ZodString).min(
            1,
            "This field is required",
          );
        break;
      default:
        baseValidator = z.string().trim().max(1000, "Input is too long");
        if (field.required)
          baseValidator = (baseValidator as z.ZodString).min(
            1,
            "This field is required",
          );
    }

    if (field.required) {
      shape[field.name] = baseValidator;
    } else {
      shape[field.name] = baseValidator.optional().or(z.literal(""));
    }
  }

  // .strip() removes any extra fields sent by a malicious user that aren't in the schema
  const dynamicZodSchema = z.object(shape).strip();
  return dynamicZodSchema.safeParse(submissionData);
}
