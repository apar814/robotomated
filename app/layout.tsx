import type { Metadata } from "next";
import { Space_Grotesk, Orbitron, Chakra_Petch, JetBrains_Mono } from "next/font/google";
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
import { ExitIntentPopup } from "@/components/engagement/exit-intent-popup";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "sonner";
import { BuyerJourneyBar } from "@/components/ui/buyer-journey-bar";
import { SiteStatsProvider } from "@/lib/context/site-stats";
import { getSiteStats } from "@/lib/data/site-stats";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-brand",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Robotomated — Robotics Intelligence",
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
    title: "Robotomated — Independent Robotics Intelligence",
    description:
      "Track 602 robots with independent scoring, TCO calculators, and real deployment data. No manufacturer bias.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Robotomated — Independent Robotics Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
    title: "Robotomated — Independent Robotics Intelligence",
    description:
      "Track 602 robots with independent scoring and real ROI data.",
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
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${orbitron.variable} ${chakraPetch.variable} ${jetbrainsMono.variable}`}
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
            <main className="flex-1 animate-fade-in pb-16 lg:pb-0">{children}</main>
            <Footer />
            <CookieBanner />
            <CursorGlow />
            <CommandPalette />
            <CompareBar />
            <ExitIntentPopup />
            <MobileNav />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgba(6,8,20,0.97)",
                  border: "1px solid rgba(37,99,235,0.25)",
                  borderLeft: "3px solid #2563EB",
                  color: "#F0F4FF",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
                },
              }}
              duration={3000}
            />
          </PostHogProvider>
          </SiteStatsProvider>
        </Providers>
      </body>
    </html>
  );
}
