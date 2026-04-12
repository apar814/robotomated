"use client";

import { useState, useMemo } from "react";
import { DIMENSIONS } from "@/lib/scoring/roboscore";

export function ScoreARobot() {
  const [rawWeights, setRawWeights] = useState<number[]>(
    DIMENSIONS.map((d) => Math.round(d.weight * 100))
  );

  const totalRaw = useMemo(() => rawWeights.reduce((a, b) => a + b, 0), [rawWeights]);

  const normalized = useMemo(
    () => rawWeights.map((w) => (totalRaw === 0 ? 0 : (w / totalRaw) * 100)),
    [rawWeights, totalRaw]
  );

  function handleSliderChange(index: number, value: number) {
    setRawWeights((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleReset() {
    setRawWeights(DIMENSIONS.map((d) => Math.round(d.weight * 100)));
  }

  const maxWeight = Math.max(
    ...DIMENSIONS.map((d) => d.weight * 100),
    ...normalized
  );

  return (
    <div className="rounded-xl border border-border bg-[#0A0A0A] p-6">
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Weight Distribution</h3>
        <button
          onClick={handleReset}
          className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:text-white"
        >
          Reset to Standard
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {DIMENSIONS.map((dim, i) => {
          const stdWeight = Math.round(dim.weight * 100);
          const normPct = normalized[i];
          const changed = Math.abs(normPct - stdWeight) > 0.5;

          return (
            <div key={dim.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-white">{dim.label}</span>
                <span className={`font-mono text-sm ${changed ? "text-[#2563EB]" : "text-muted"}`}>
                  {normPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={rawWeights[i]}
                onChange={(e) => handleSliderChange(i, Number(e.target.value))}
                className="score-slider w-full"
                aria-label={`${dim.label} weight`}
              />
            </div>
          );
        })}
      </div>

      {/* Comparison chart */}
      <div className="mt-8 border-t border-border pt-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Standard vs Your Weights</h3>
        <div className="flex items-center gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-white/20" />
            Standard
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#2563EB]" />
            Yours
          </span>
        </div>
        <div className="space-y-3">
          {DIMENSIONS.map((dim, i) => {
            const stdWeight = Math.round(dim.weight * 100);
            const normPct = normalized[i];
            const barMax = Math.max(maxWeight, 1);

            return (
              <div key={dim.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted">{dim.label}</span>
                  <div className="flex gap-3">
                    <span className="font-mono text-muted">{stdWeight}%</span>
                    <span className="font-mono text-[#2563EB]">{normPct.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="relative h-5 w-full overflow-hidden rounded bg-white/5">
                  {/* Standard bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded bg-white/15 transition-all"
                    style={{ width: `${(stdWeight / barMax) * 100}%` }}
                  />
                  {/* User bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded bg-[#2563EB]/60 transition-all"
                    style={{ width: `${(normPct / barMax) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-muted">
        Weights auto-normalize to 100%. Drag any slider to see how your priorities
        differ from the standard RoboScore methodology.
      </p>

      {/* Slider styles */}
      <style jsx>{`
        .score-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          cursor: pointer;
        }
        .score-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563EB;
          border: 2px solid #0A0A0A;
          cursor: pointer;
        }
        .score-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563EB;
          border: 2px solid #0A0A0A;
          cursor: pointer;
        }
        .score-slider::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
