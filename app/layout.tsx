import type { Metadata } from "next";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";
import { OrganizationSchema } from "@/components/seo/json-ld";
import { AffiliateDisclosureBanner } from "@/components/commerce/affiliate-disclosure";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { CookieBanner } from "@/components/analytics/cookie-banner";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { CommandPalette } from "@/components/ui/command-palette";
import { CompareBar } from "@/components/compare/compare-bar";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Robotomated — The Robotics Intelligence Platform",
    template: "%s | Robotomated",
  },
  description:
    "Find, compare, and understand robots. Expert reviews, transparent scoring, and AI-powered recommendations for every use case.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://robotomated.com"
  ),
  openGraph: {
    type: "website",
    siteName: "Robotomated",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <OrganizationSchema />
        <Providers>
          <PostHogProvider>
            <AffiliateDisclosureBanner />
            <Header />
            <main className="flex-1 animate-fade-in">{children}</main>
            <Footer />
            <CookieBanner />
            <CursorGlow />
            <CommandPalette />
            <CompareBar />
          </PostHogProvider>
        </Providers>
      </body>
    </html>
  );
}
