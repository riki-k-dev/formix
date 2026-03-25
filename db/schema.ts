import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  emailNotifications: boolean("email_notifications").default(true),
  marketingEmails: boolean("marketing_emails").default(false),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

export const forms = pgTable("forms", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  schema: text("schema").notNull(),
  status: text("status").default("active").notNull(),
  submissionsCount: integer("submissionsCount").default(0).notNull(),
  hasWhatsapp: boolean("hasWhatsapp").default(false).notNull(),
  hasWebhook: boolean("hasWebhook").default(false).notNull(),
  webhookUrl: text("webhookUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  formId: text("formId")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  key: text("key").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
