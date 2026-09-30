import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CSPostHogProvider } from "./providers";
import ConsentBanner from "@/components/ui/ConsentBanner";

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
    "create form API instantly",
    "no code form API endpoint",
    "Typeform alternative for developers",
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
  },
  // Search Engine Verification Tags
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yahoo: process.env.BING_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white`}
      >
        <CSPostHogProvider>
          {children}
          <Toaster theme="dark" position="bottom-right" />

          <Analytics />
          <SpeedInsights />
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </CSPostHogProvider>
        <ConsentBanner />
      </body>
    </html>
  );
}
