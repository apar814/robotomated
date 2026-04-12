"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface Review {
  id: string;
  robot_id: string;
  reviewer_id: string | null;
  review_type: string;
  title: string;
  body: string;
  robo_score: number | null;
  status: string;
  created_at: string;
  published_at: string | null;
  robots: { name: string; slug: string } | null;
}

interface Stats {
  totalPending: number;
  publishedToday: number;
  rejectionRate: number;
  total: number;
}

type FilterTab = "all" | "pending" | "published" | "rejected";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPending: 0, publishedToday: 0, rejectionRate: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("pending");

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/reviews/moderate?filter=${tab}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setStats(data.stats || { totalPending: 0, publishedToday: 0, rejectionRate: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    fetchReviews();
  }, [fetchReviews]);

  async function handleModerate(reviewId: string, action: "approve" | "reject") {
    await fetch("/api/admin/reviews/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_id: reviewId, action }),
    });
    fetchReviews();
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "published", label: "Published" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Review Moderation</h1>
        <div className="flex gap-2">
          <Link href="/admin/reviews/new" className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-navy hover:opacity-90">
            + Expert Review
          </Link>
          <Link href="/admin" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/40 hover:text-white/60">
            Dashboard
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <StatCard label="Pending" value={stats.totalPending} color="text-[#F59E0B]" />
        <StatCard label="Published Today" value={stats.publishedToday} color="text-[#00E5A0]" />
        <StatCard label="Rejection Rate" value={`${stats.rejectionRate.toFixed(1)}%`} color="text-[#F97316]" />
        <StatCard label="Total Reviews" value={stats.total} />
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-1 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium capitalize",
              tab === t.key ? "text-[#2563EB]" : "text-white/40 hover:text-white/60"
            )}
          >
            {t.label}
            {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />}
          </button>
        ))}
      </div>

      {/* Reviews table */}
      {loading ? (
        <div className="py-20 text-center text-white/40">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center text-white/40">No reviews found</div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                <th className="px-3 py-3">Robot</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3 max-w-xs">Body</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-3 py-3 text-sm font-medium">
                    {(review.robots as { name: string; slug: string } | null)?.name || "Unknown"}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-semibold",
                        review.review_type === "expert"
                          ? "bg-[#2563EB]/10 text-[#2563EB]"
                          : "bg-white/10 text-white/60"
                      )}
                    >
                      {review.review_type}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">
                    {review.robo_score ? review.robo_score.toFixed(1) : "--"}
                  </td>
                  <td className="px-3 py-3 text-sm">{review.title}</td>
                  <td className="max-w-xs truncate px-3 py-3 text-xs text-white/50">
                    {review.body?.slice(0, 100)}{review.body && review.body.length > 100 ? "..." : ""}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="px-3 py-3 text-xs text-white/40">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    <ReviewActions
                      reviewId={review.id}
                      status={review.status}
                      onModerate={handleModerate}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReviewActions({
  reviewId,
  status,
  onModerate,
}: {
  reviewId: string;
  status: string;
  onModerate: (id: string, action: "approve" | "reject") => void;
}) {
  const [acting, setActing] = useState(false);

  async function handle(action: "approve" | "reject") {
    setActing(true);
    await onModerate(reviewId, action);
    setActing(false);
  }

  if (status === "published") {
    return (
      <button
        onClick={() => handle("reject")}
        disabled={acting}
        className="rounded px-2 py-1 text-xs text-[#F97316] hover:bg-[#F97316]/10 disabled:opacity-50"
      >
        {acting ? "..." : "Unpublish"}
      </button>
    );
  }

  if (status === "rejected") {
    return (
      <button
        onClick={() => handle("approve")}
        disabled={acting}
        className="rounded px-2 py-1 text-xs text-[#00E5A0] hover:bg-[#00E5A0]/10 disabled:opacity-50"
      >
        {acting ? "..." : "Approve"}
      </button>
    );
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={() => handle("approve")}
        disabled={acting}
        className="rounded px-2 py-1 text-xs text-[#00E5A0] hover:bg-[#00E5A0]/10 disabled:opacity-50"
      >
        {acting ? "..." : "Approve"}
      </button>
      <button
        onClick={() => handle("reject")}
        disabled={acting}
        className="rounded px-2 py-1 text-xs text-[#F97316] hover:bg-[#F97316]/10 disabled:opacity-50"
      >
        {acting ? "..." : "Reject"}
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-[#F59E0B]/10 text-[#F59E0B]",
    published: "bg-[#00E5A0]/10 text-[#00E5A0]",
    rejected: "bg-[#F97316]/10 text-[#F97316]",
    draft: "bg-white/10 text-white/50",
  };

  return (
    <span className={cn("rounded px-2 py-0.5 text-[10px] font-semibold", styles[status] || styles.draft)}>
      {status}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", color)}>{value}</p>
    </div>
  );
}
