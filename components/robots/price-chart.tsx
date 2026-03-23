"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface PricePoint {
  recorded_at: string;
  price: number;
  retailer: string;
}

export function PriceChart({ data }: { data: PricePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-navy-lighter text-sm text-muted">
        No price history yet. Check back soon.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price: d.price,
    retailer: d.retailer,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3E" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8892A4" }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#8892A4" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${v.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#141B2D",
              border: "1px solid #1E2A3E",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#F0F2F5",
            }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00C2FF"
            strokeWidth={2}
            dot={{ fill: "#00C2FF", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
