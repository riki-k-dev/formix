export function validateWebhookUrl(
  provider: string,
  url: string,
): { isValid: boolean; error?: string } {
  if (!url || !url.startsWith("https://")) {
    return { isValid: false, error: "URL must be a valid secure HTTPS link." };
  }

  try {
    const parsedUrl = new URL(url);

    const forbiddenHostnames = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "169.254.169.254",
    ];
    if (forbiddenHostnames.includes(parsedUrl.hostname)) {
      return {
        isValid: false,
        error: "Local or internal IPs are not allowed.",
      };
    }

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

      case "webhook":
        break;
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: "Malformed URL provided." };
  }
}
