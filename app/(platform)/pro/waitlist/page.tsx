import type { Metadata } from "next";
import { ProWaitlistClient } from "./waitlist-client";

export const metadata: Metadata = {
  title: "Robotomated Pro — Coming Soon | Join the Waitlist",
  description: "Get unlimited price alerts, weekly market reports, API access, and priority advisor responses. Join the waitlist for 40% off at launch.",
  alternates: { canonical: "/pro/waitlist" },
};

export default function ProWaitlistPage() {
  return <ProWaitlistClient />;
}
