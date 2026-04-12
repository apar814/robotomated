"use client";

import { useState, useMemo } from "react";
import type { FundingRound } from "@/lib/data/funding-data";

type SortField = "date" | "amount" | "company" | "round";
type SortDir = "asc" | "desc";

interface FundingTableProps {
  rounds: FundingRound[];
  roundTypes: string[];
  categories: string[];
  roundColors: Record<string, string>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FundingTable({ rounds, roundTypes, categories, roundColors }: FundingTableProps) {
  const [roundFilter, setRoundFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let result = [...rounds];

    if (roundFilter !== "All") {
      result = result.filter((r) => r.round === roundFilter);
    }
    if (categoryFilter !== "All") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          cmp = a.amountNumeric - b.amountNumeric;
          break;
        case "company":
          cmp = a.company.localeCompare(b.company);
          break;
        case "round":
          cmp = a.round.localeCompare(b.round);
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [rounds, roundFilter, categoryFilter, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return " \u2195";
    return sortDir === "desc" ? " \u2193" : " \u2191";
  };

  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Filter bar ── */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">Round</span>
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="rounded border border-border bg-obsidian-surface px-3 py-1.5 font-mono text-xs text-secondary focus:border-electric-blue focus:outline-none"
            >
              <option value="All">All Rounds</option>
              {roundTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded border border-border bg-obsidian-surface px-3 py-1.5 font-mono text-xs text-secondary focus:border-electric-blue focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <span className="ml-auto font-mono text-[13px] text-ghost">
            {filtered.length} {filtered.length === 1 ? "round" : "rounds"}
          </span>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-border bg-obsidian-surface">
                <th
                  className="cursor-pointer px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-ghost transition-colors hover:text-electric-blue"
                  onClick={() => toggleSort("company")}
                >
                  Company{sortIcon("company")}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-ghost transition-colors hover:text-electric-blue"
                  onClick={() => toggleSort("amount")}
                >
                  Amount{sortIcon("amount")}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-ghost transition-colors hover:text-electric-blue"
                  onClick={() => toggleSort("round")}
                >
                  Round{sortIcon("round")}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-ghost transition-colors hover:text-electric-blue"
                  onClick={() => toggleSort("date")}
                >
                  Date{sortIcon("date")}
                </th>
                <th className="px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-ghost">
                  Lead Investor
                </th>
                <th className="px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-ghost">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((round) => (
                <tr
                  key={round.id}
                  className="border-b border-border-subtle transition-colors hover:bg-obsidian-hover"
                >
                  <td className="px-4 py-3">
                    <a
                      href={round.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col"
                    >
                      <span className="text-sm font-medium text-foreground transition-colors group-hover:text-electric-blue">
                        {round.company}
                      </span>
                      <span className="mt-0.5 line-clamp-1 text-[11px] text-ghost">
                        {round.companyDescription}
                      </span>
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-bold text-blue-400">{round.amount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block rounded px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: (roundColors[round.round] || "#00C2FF") + "18",
                        color: roundColors[round.round] || "#00C2FF",
                        border: `0.5px solid ${(roundColors[round.round] || "#00C2FF")}30`,
                      }}
                    >
                      {round.round}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-tertiary">
                    {formatDate(round.date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary">{round.leadInvestor}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-tertiary">{round.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-ghost">No funding rounds match your filters.</p>
            <button
              onClick={() => { setRoundFilter("All"); setCategoryFilter("All"); }}
              className="mt-2 font-mono text-xs text-electric-blue transition-colors hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
