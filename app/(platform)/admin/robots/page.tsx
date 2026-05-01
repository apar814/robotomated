"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface AdminRobot {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  status: string;
  manufacturer_name: string;
  category_name: string;
  updated_at: string;
}

interface PageData {
  robots: AdminRobot[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export default function AdminRobotsPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchRobots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/robots?${params}`);
      if (!res.ok) throw new Error(`Failed to load robots (${res.status})`);
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchRobots();
  }, [fetchRobots]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Robots</h1>
        <div className="flex gap-2">
          <Link href="/admin/robots/new" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy hover:opacity-90">
            + Add Robot
          </Link>
          <Link href="/admin/robots/import" className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
            CSV Import
          </Link>
          <Link href="/admin" className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground">
            Dashboard
          </Link>
        </div>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mt-6 flex gap-3">
        <input
          type="text"
          placeholder="Search robots..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-white/50 focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-white/50 focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="discontinued">Discontinued</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
        <button type="submit" className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
          Search
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
          <button onClick={fetchRobots} className="ml-3 underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Loading state */}
      {loading && <div className="mt-10 text-center text-muted">Loading robots...</div>}

      {/* Table */}
      {!loading && data && (
        <>
          <div className="mt-4 text-xs text-muted">{data.total} robots total</div>
          <div className="mt-2 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-navy-light text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Manufacturer</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Score</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.robots.map((r) => (
                  <tr key={r.id} className="hover:bg-navy-light/50">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-muted">{r.manufacturer_name}</td>
                    <td className="px-4 py-3 text-muted">{r.category_name}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.robo_score ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {r.price_current != null ? `$${r.price_current.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[13px] font-semibold uppercase ${
                        r.status === "active" ? "bg-green/15 text-green" :
                        r.status === "discontinued" ? "bg-orange/15 text-orange" :
                        "bg-white/10 text-white"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(r.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/robots/${r.id}/edit`} className="text-xs text-white hover:underline">Edit</Link>
                        <Link href={`/admin/robots/${r.id}/images`} className="text-xs text-muted hover:text-foreground">Images</Link>
                        <Link href={`/robots/${r.slug}`} className="text-xs text-muted hover:text-foreground">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.robots.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-muted">No robots found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted">
                Page {data.page} of {data.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-30 hover:bg-navy-light"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page >= data.totalPages}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-30 hover:bg-navy-light"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
