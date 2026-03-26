import type { Metadata } from "next";
import { UnsubscribeClient } from "./unsubscribe-client";

export const metadata: Metadata = {
  title: "Unsubscribe — Robotomated",
  description: "Unsubscribe from the Robotomated weekly digest.",
  robots: { index: false },
};

export default function UnsubscribePage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <UnsubscribeClient />
    </div>
  );
}
