"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WizardData, RobotEntry } from "@/components/robowork/wizard-types";
import { createEmptyRobot } from "@/components/robowork/wizard-types";

interface StepProps {
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
}

interface SearchResult {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
}

const FULFILLMENT_OPTIONS = [
  { value: "with_operator", label: "With operator" },
  { value: "drop_off", label: "Drop-off autonomous" },
  { value: "remote_operated", label: "Remote operated" },
] as const;

function RobotCard({
  robot,
  index,
  onUpdate,
  onRemove,
}: {
  robot: RobotEntry;
  index: number;
  onUpdate: (index: number, partial: Partial<RobotEntry>) => void;
  onRemove: (index: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState(robot.name);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isManual, setIsManual] = useState(!!robot.name && !robot.robotId);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onUpdate(index, { name: query });

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (query.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/robots?search=${encodeURIComponent(query)}&limit=5`,
          );
          if (res.ok) {
            const results = await res.json();
            setSearchResults(results);
            setShowResults(true);
          }
        } catch {
          // Silently fail search
        }
      }, 300);
    },
    [index, onUpdate],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function selectResult(result: SearchResult) {
    setSearchQuery(result.name);
    setShowResults(false);
    setIsManual(false);
    onUpdate(index, {
      robotId: result.id,
      name: result.name,
      manufacturer: result.manufacturer,
      category: result.category,
    });
  }

  function toggleFulfillment(type: string) {
    const current = robot.fulfillmentTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onUpdate(index, { fulfillmentTypes: next });
  }

  const inputStyle = {
    background: "var(--theme-input-bg)",
    borderColor: "var(--theme-input-border)",
    color: "var(--theme-text-primary)",
  };

  return (
    <div
      className="rounded-lg border"
      style={{ borderColor: "var(--theme-border)", background: "var(--theme-card)" }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {robot.name || "New Robot"}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-xs"
            style={{ color: "var(--theme-text-muted)" }}
          >
            {expanded ? "\u25B2" : "\u25BC"}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t px-4 py-4" style={{ borderColor: "var(--theme-border)" }}>
          {/* Robot Name Search */}
          <div className="relative">
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Robot Name
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => {
                setTimeout(() => {
                  setShowResults(false);
                  if (!robot.robotId && searchQuery.trim()) setIsManual(true);
                }, 200);
              }}
              placeholder="Search robots or type a name..."
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
              style={inputStyle}
            />
            {showResults && searchResults.length > 0 && (
              <div
                className="absolute z-10 mt-1 w-full rounded-lg border shadow-lg"
                style={{
                  background: "var(--theme-card)",
                  borderColor: "var(--theme-border)",
                }}
              >
                {searchResults.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => selectResult(r)}
                    className="w-full px-3 py-2 text-left text-sm hover:opacity-80"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    <div className="font-medium">{r.name}</div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--theme-text-muted)" }}
                    >
                      {r.manufacturer} &middot; {r.category}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual fields */}
          {isManual && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={robot.manufacturer}
                  onChange={(e) =>
                    onUpdate(index, { manufacturer: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  Category
                </label>
                <input
                  type="text"
                  value={robot.category}
                  onChange={(e) =>
                    onUpdate(index, { category: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Rates */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--theme-text-muted)" }}
              >
                Daily Rate ($)
              </label>
              <input
                type="number"
                value={robot.dailyRate}
                onChange={(e) =>
                  onUpdate(index, { dailyRate: e.target.value })
                }
                placeholder="0"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--theme-text-muted)" }}
              >
                Weekly Rate ($)
              </label>
              <input
                type="number"
                value={robot.weeklyRate}
                onChange={(e) =>
                  onUpdate(index, { weeklyRate: e.target.value })
                }
                placeholder="0"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--theme-text-muted)" }}
              >
                Monthly Rate ($)
              </label>
              <input
                type="number"
                value={robot.monthlyRate}
                onChange={(e) =>
                  onUpdate(index, { monthlyRate: e.target.value })
                }
                placeholder="0"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Minimum Booking */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Minimum Booking (days)
            </label>
            <input
              type="number"
              min={1}
              value={robot.minimumDays}
              onChange={(e) =>
                onUpdate(index, { minimumDays: e.target.value })
              }
              className="w-32 rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
              style={inputStyle}
            />
          </div>

          {/* Fulfillment Types */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Fulfillment Types
            </label>
            <div className="flex flex-wrap gap-3">
              {FULFILLMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  <input
                    type="checkbox"
                    checked={robot.fulfillmentTypes.includes(opt.value)}
                    onChange={() => toggleFulfillment(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Availability
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onUpdate(index, { available: !robot.available })
                }
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--theme-text-primary)" }}
              >
                <span
                  className="inline-flex h-5 w-9 items-center rounded-full px-0.5 transition-colors"
                  style={{
                    background: robot.available
                      ? "#D4D4D4"
                      : "var(--theme-border)",
                  }}
                >
                  <span
                    className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                    style={{
                      transform: robot.available
                        ? "translateX(16px)"
                        : "translateX(0px)",
                    }}
                  />
                </span>
                {robot.available ? "Available now" : "Not available yet"}
              </button>
            </div>
            {!robot.available && (
              <input
                type="date"
                value={robot.availableFrom}
                onChange={(e) =>
                  onUpdate(index, { availableFrom: e.target.value })
                }
                className="mt-2 rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                style={inputStyle}
              />
            )}
          </div>

          {/* Remove */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#ef4444" }}
            >
              \uD83D\uDDD1 Remove Robot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepRobotFleet({ data, updateData }: StepProps) {
  function addRobot() {
    updateData({ robots: [...data.robots, createEmptyRobot()] });
  }

  function updateRobot(index: number, partial: Partial<RobotEntry>) {
    const next = data.robots.map((r, i) =>
      i === index ? { ...r, ...partial } : r,
    );
    updateData({ robots: next });
  }

  function removeRobot(index: number) {
    updateData({ robots: data.robots.filter((_, i) => i !== index) });
  }

  const fleetSummary = useMemo(() => {
    const count = data.robots.length;
    const dailyRevenue = data.robots.reduce(
      (sum, r) => sum + (parseFloat(r.dailyRate) || 0),
      0,
    );
    return { count, dailyRevenue };
  }, [data.robots]);

  return (
    <div className="space-y-4">
      {data.robots.map((robot, i) => (
        <RobotCard
          key={robot.id}
          robot={robot}
          index={i}
          onUpdate={updateRobot}
          onRemove={removeRobot}
        />
      ))}

      <button
        type="button"
        onClick={addRobot}
        className="w-full rounded-lg border-2 border-dashed px-4 py-3 text-sm font-medium transition-colors hover:opacity-80"
        style={{ borderColor: "#D4D4D4", color: "#D4D4D4" }}
      >
        + Add a Robot
      </button>

      {/* Fleet Summary */}
      {data.robots.length > 0 && (
        <div
          className="rounded-lg px-4 py-3 text-sm font-medium"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "var(--theme-text-primary)",
          }}
        >
          Your fleet: {fleetSummary.count} robot
          {fleetSummary.count !== 1 ? "s" : ""} | Est. daily revenue: $
          {fleetSummary.dailyRevenue.toFixed(0)}
        </div>
      )}
    </div>
  );
}
