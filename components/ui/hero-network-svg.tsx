"use client";

export function HeroNetworkSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>{`
        @keyframes pulse1 {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.5; }
        }
        @keyframes pulse2 {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.45; }
        }
        .node-pulse-1 { animation: pulse1 4s ease-in-out infinite; }
        .node-pulse-2 { animation: pulse2 5s ease-in-out infinite 1s; }
      `}</style>

      {/* ── Edges (thin lines connecting nodes) ── */}
      {/* Hub A (160,120) connections */}
      <line x1="160" y1="120" x2="80" y2="60" stroke="#2563EB" strokeWidth="0.5" opacity="0.15" />
      <line x1="160" y1="120" x2="120" y2="200" stroke="#2563EB" strokeWidth="0.5" opacity="0.12" />
      <line x1="160" y1="120" x2="260" y2="80" stroke="#2563EB" strokeWidth="0.5" opacity="0.18" />
      <line x1="160" y1="120" x2="300" y2="180" stroke="#C8FF00" strokeWidth="0.5" opacity="0.1" />
      <line x1="160" y1="120" x2="200" y2="260" stroke="#2563EB" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 4" />

      {/* Hub B (460,160) connections */}
      <line x1="460" y1="160" x2="380" y2="100" stroke="#2563EB" strokeWidth="0.5" opacity="0.15" />
      <line x1="460" y1="160" x2="300" y2="180" stroke="#2563EB" strokeWidth="0.5" opacity="0.12" />
      <line x1="460" y1="160" x2="540" y2="100" stroke="#C8FF00" strokeWidth="0.5" opacity="0.15" />
      <line x1="460" y1="160" x2="520" y2="260" stroke="#2563EB" strokeWidth="0.5" opacity="0.1" />
      <line x1="460" y1="160" x2="620" y2="200" stroke="#2563EB" strokeWidth="0.5" opacity="0.18" />

      {/* Hub C (660,280) connections */}
      <line x1="660" y1="280" x2="620" y2="200" stroke="#2563EB" strokeWidth="0.5" opacity="0.15" />
      <line x1="660" y1="280" x2="720" y2="340" stroke="#C8FF00" strokeWidth="0.5" opacity="0.12" />
      <line x1="660" y1="280" x2="580" y2="340" stroke="#2563EB" strokeWidth="0.5" opacity="0.1" />
      <line x1="660" y1="280" x2="520" y2="260" stroke="#2563EB" strokeWidth="0.5" opacity="0.15" />

      {/* Cross-hub links */}
      <line x1="260" y1="80" x2="380" y2="100" stroke="#2563EB" strokeWidth="0.5" opacity="0.1" strokeDasharray="6 3" />
      <line x1="300" y1="180" x2="380" y2="100" stroke="#2563EB" strokeWidth="0.5" opacity="0.08" />
      <line x1="200" y1="260" x2="520" y2="260" stroke="#C8FF00" strokeWidth="0.5" opacity="0.06" strokeDasharray="8 4" />
      <line x1="120" y1="200" x2="300" y2="180" stroke="#2563EB" strokeWidth="0.5" opacity="0.1" />
      <line x1="540" y1="100" x2="620" y2="200" stroke="#2563EB" strokeWidth="0.5" opacity="0.1" />

      {/* ── Hub nodes (larger) ── */}
      <circle cx="160" cy="120" r="7" fill="#2563EB" opacity="0.25" className="node-pulse-1" />
      <circle cx="460" cy="160" r="8" fill="#2563EB" opacity="0.2" className="node-pulse-2" />
      <circle cx="660" cy="280" r="6" fill="#C8FF00" opacity="0.2" />

      {/* ── Regular nodes ── */}
      <circle cx="80" cy="60" r="3" fill="#2563EB" opacity="0.2" />
      <circle cx="120" cy="200" r="4" fill="#2563EB" opacity="0.18" />
      <circle cx="200" cy="260" r="3" fill="#C8FF00" opacity="0.15" />
      <circle cx="260" cy="80" r="4" fill="#2563EB" opacity="0.22" />
      <circle cx="300" cy="180" r="5" fill="#2563EB" opacity="0.2" />
      <circle cx="380" cy="100" r="3" fill="#C8FF00" opacity="0.18" />
      <circle cx="520" cy="260" r="4" fill="#2563EB" opacity="0.2" />
      <circle cx="540" cy="100" r="3" fill="#2563EB" opacity="0.15" />
      <circle cx="580" cy="340" r="3" fill="#2563EB" opacity="0.18" />
      <circle cx="620" cy="200" r="5" fill="#C8FF00" opacity="0.2" />
      <circle cx="720" cy="340" r="4" fill="#2563EB" opacity="0.22" />
    </svg>
  );
}
