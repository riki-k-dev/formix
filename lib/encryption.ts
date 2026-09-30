import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

export function encryptConfig(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error(
      "CRITICAL: ENCRYPTION_KEY is missing in environment variables. Aborting encryption to prevent data leak.",
    );
  }

  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, "hex");
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data securely.");
  }
}

export function decryptConfig(text: string): string {
  if (!text) return text;

  if (!ENCRYPTION_KEY) {
    throw new Error(
      "CRITICAL: ENCRYPTION_KEY is missing. Cannot decrypt data.",
    );
  }

  const parts = text.split(":");

  if (parts.length !== 3) {
    throw new Error(
      "Invalid encrypted data format detected. Possible malicious plaintext injection.",
    );
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  if (ivHex.length !== 32 || authTagHex.length !== 32) {
    throw new Error("Corrupted or invalid encrypted payload.");
  }

  try {
    const key = Buffer.from(ENCRYPTION_KEY, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed for an item:", error);
    throw new Error(
      "Decryption failed. Data might be corrupted or tampered with.",
    );
  }
}
