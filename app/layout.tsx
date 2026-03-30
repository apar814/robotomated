import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { StatusBar } from "@/components/layout/status-bar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";
import { OrganizationSchema } from "@/components/seo/json-ld";
import { AffiliateDisclosureBanner } from "@/components/commerce/affiliate-disclosure";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { CookieBanner } from "@/components/analytics/cookie-banner";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { CommandPalette } from "@/components/ui/command-palette";
import { CompareBar } from "@/components/compare/compare-bar";
import { BuyerJourneyBar } from "@/components/ui/buyer-journey-bar";
import { SiteStatsProvider } from "@/lib/context/site-stats";
import { getSiteStats } from "@/lib/data/site-stats";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceGroteskSans = Space_Grotesk({
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stats = await getSiteStats();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceGroteskSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <OrganizationSchema />
        <Providers>
          <SiteStatsProvider stats={stats}>
          <PostHogProvider>
            <AffiliateDisclosureBanner />
            <Header />
            <StatusBar />
            <BuyerJourneyBar />
            <main className="flex-1 animate-fade-in">{children}</main>
            <Footer />
            <CookieBanner />
            <CursorGlow />
            <CommandPalette />
            <CompareBar />
          </PostHogProvider>
          </SiteStatsProvider>
        </Providers>
      </body>
    </html>
  );
}
