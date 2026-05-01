import type { Metadata } from "next";
import Link from "next/link";
import { PostJobForm } from "@/components/robowork/post-job-form";

export const metadata: Metadata = {
  title: "Post a Robot Job — RoboWork | Robotomated",
  description:
    "Post a job and get matched with verified Robot Service Providers. Describe your task, set a budget, and receive competitive bids.",
};

export default function PostJobPage() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <Link
          href="/robowork"
          className="mb-4 inline-block font-mono text-[13px] text-white transition-colors hover:underline"
        >
          &larr; RoboWork
        </Link>

        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-text-primary">
            Post a Robot Job
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Describe what you need. Receive bids from verified providers.
          </p>
        </div>

        <PostJobForm />
      </div>
    </div>
  );
}
