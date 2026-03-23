"use client";

import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Props {
  topRobotClicks: { name: string; count: number }[];
  subscribersByDay: { day: string; count: number }[];
  advisorByDay: { day: string; count: number }[];
}

const chartTooltipStyle = {
  backgroundColor: "#141B2D",
  border: "1px solid #1E2A3E",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#F0F2F5",
};

export function AdminCharts({ topRobotClicks, subscribersByDay, advisorByDay }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Affiliate clicks by robot */}
      <div className="rounded-xl border border-border bg-navy-light p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Affiliate Clicks by Robot
        </h3>
        {topRobotClicks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No click data yet</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topRobotClicks} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3E" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#8892A4" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#8892A4" }} width={80} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#00C2FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Subscribers by day */}
      <div className="rounded-xl border border-border bg-navy-light p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          New Subscribers (30d)
        </h3>
        {subscribersByDay.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No subscriber data yet</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subscribersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3E" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8892A4" }} />
                <YAxis tick={{ fontSize: 11, fill: "#8892A4" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#00E5A0" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Advisor conversations by day */}
      <div className="rounded-xl border border-border bg-navy-light p-5 lg:col-span-2">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Advisor Conversations (30d)
        </h3>
        {advisorByDay.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No advisor data yet</p>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={advisorByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3E" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8892A4" }} />
                <YAxis tick={{ fontSize: 11, fill: "#8892A4" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#7B2FFF" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
