"use client";

import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/advisor/chat-interface";

export function AdvisorClient() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("q") || undefined;

  return <ChatInterface initialMessage={initialMessage} />;
}
