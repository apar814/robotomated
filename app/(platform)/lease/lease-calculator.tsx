"use client";

import { useState } from "react";

export function LeaseCalculator() {
  const [price, setPrice] = useState(150000);
  const [term, setTerm] = useState(36);

  const monthly = Math.round((price * 1.15) / term);

  return (
    <div className="glass rounded-xl p-6">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Robot Price: ${price.toLocaleString()}
          </label>
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-[#00C2FF]"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>$10,000</span>
            <span>$500,000</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Lease Term: {term} months
          </label>
          <input
            type="range"
            min={12}
            max={60}
            step={6}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full accent-[#00C2FF]"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>12 months</span>
            <span>60 months</span>
          </div>
        </div>

        <div className="rounded-lg bg-white/[0.03] p-4 text-center">
          <p className="text-sm text-muted">Estimated Monthly Payment</p>
          <p className="mt-1 font-display text-3xl font-bold text-[#00E5A0]">
            ${monthly.toLocaleString()}/mo
          </p>
          <p className="mt-2 text-xs text-muted">
            Includes estimated 15% finance cost. Actual rates vary by credit
            profile, term, and equipment type.
          </p>
        </div>
      </div>
    </div>
  );
}
