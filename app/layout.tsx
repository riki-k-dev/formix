import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://formix.rikikashyap.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Formix | AI-Powered Headless Form Infrastructure",
    template: "%s | Formix", // e.g., "Blog | Formix"
  },
  description:
    "Stop building form backends. Generate structured JSON schemas, ready-to-use APIs, WhatsApp bots, and micro-forms in seconds with Formix.",
  keywords: [
    // Core Base Keywords
    "headless forms",
    "form backend API",
    "AI form generator",
    "AI form builder",
    "WhatsApp form bot",
    "Next.js forms",
    "React form infrastructure",
    "form automation",

    // Real-world & Problem-Solving (Human-like searches)
    "create form API instantly",
    "backend for HTML forms",
    "collect form submissions without backend",
    "how to save form data in Next.js",
    "no code form API endpoint",
    "generate API endpoint for form",
    "custom form backend setup",

    // Use-Case Specific
    "WhatsApp survey maker",
    "collect data via WhatsApp bot",
    "send form data to Google Sheets automatically",
    "connect HTML form to Slack",
    "JSON form schema generator",

    // Competitor Alternatives (High conversion intent)
    "Typeform alternative for developers",
    "Formspree alternative",
    "headless Typeform",
  ],
  authors: [{ name: "Riki Kashyap", url: "https://rikikashyap.dev" }],
  creator: "Riki Kashyap",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Formix | AI Headless Form Infrastructure",
    description:
      "Stop building form backends. Generate APIs, bots, and micro-forms in seconds.",
    siteName: "Formix",
    images: [
      {
        url: "/formix-og.png",
        width: 1200,
        height: 720,
        alt: "Formix - AI-Powered Headless Forms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Formix | AI Headless Form Infrastructure",
    description:
      "Stop building form backends. Generate APIs, bots, and micro-forms in seconds.",
    creator: "@rikiKDev",
    images: ["/formix-og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white`}
      >
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
