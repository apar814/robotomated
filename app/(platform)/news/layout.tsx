import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robotics News & Industry Updates",
  description: "Latest robotics news, funding rounds, product launches, and industry analysis. Stay ahead of the automation curve with curated intelligence.",
  alternates: { canonical: "/news" },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
