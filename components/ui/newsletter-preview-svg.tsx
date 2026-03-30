export function NewsletterPreviewSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Card background */}
      <rect x="0.5" y="0.5" width="319" height="399" rx="12" fill="#141A2E" stroke="#1E2642" strokeWidth="1" />

      {/* Header area */}
      <text x="24" y="40" fill="#00C2FF" fontFamily="sans-serif" fontWeight="700" fontSize="16">
        The Robotomated Brief
      </text>
      <text x="24" y="58" fill="#555555" fontFamily="monospace" fontSize="11">
        Issue #001 — Weekly Intelligence
      </text>

      {/* Divider */}
      <line x1="24" y1="72" x2="296" y2="72" stroke="#1E2642" strokeWidth="1" />

      {/* Top Rated section label */}
      <text x="24" y="96" fill="#00C2FF" fontFamily="monospace" fontSize="10" fontWeight="600">
        TOP RATED THIS WEEK
      </text>

      {/* Robot row 1 */}
      <text x="24" y="120" fill="#555555" fontFamily="monospace" fontSize="12" fontWeight="700">
        #1
      </text>
      <text x="48" y="120" fill="#C8C8C8" fontFamily="sans-serif" fontSize="12">
        Spot Enterprise
      </text>
      <rect x="200" y="110" width="72" height="8" rx="2" fill="#0A1420" />
      <rect x="200" y="110" width="65" height="8" rx="2" fill="#00E5A0" opacity="0.7" />
      <text x="278" y="119" fill="#555555" fontFamily="monospace" fontSize="9">
        91
      </text>

      {/* Robot row 2 */}
      <text x="24" y="148" fill="#555555" fontFamily="monospace" fontSize="12" fontWeight="700">
        #2
      </text>
      <text x="48" y="148" fill="#C8C8C8" fontFamily="sans-serif" fontSize="12">
        UR20 Cobot
      </text>
      <rect x="200" y="138" width="72" height="8" rx="2" fill="#0A1420" />
      <rect x="200" y="138" width="58" height="8" rx="2" fill="#00E5A0" opacity="0.7" />
      <text x="278" y="147" fill="#555555" fontFamily="monospace" fontSize="9">
        87
      </text>

      {/* Robot row 3 */}
      <text x="24" y="176" fill="#555555" fontFamily="monospace" fontSize="12" fontWeight="700">
        #3
      </text>
      <text x="48" y="176" fill="#C8C8C8" fontFamily="sans-serif" fontSize="12">
        Digit Humanoid
      </text>
      <rect x="200" y="166" width="72" height="8" rx="2" fill="#0A1420" />
      <rect x="200" y="166" width="52" height="8" rx="2" fill="#00E5A0" opacity="0.7" />
      <text x="278" y="175" fill="#555555" fontFamily="monospace" fontSize="9">
        83
      </text>

      {/* Divider */}
      <line x1="24" y1="196" x2="296" y2="196" stroke="#1E2642" strokeWidth="1" />

      {/* Market Pulse section */}
      <text x="24" y="220" fill="#7B2FFF" fontFamily="monospace" fontSize="10" fontWeight="600">
        MARKET PULSE
      </text>
      <text x="24" y="242" fill="#888888" fontFamily="sans-serif" fontSize="11">
        Warehouse AMR adoption +34% YoY
      </text>
      <text x="24" y="260" fill="#888888" fontFamily="sans-serif" fontSize="11">
        Cobot market hits $2.1B milestone
      </text>
      <text x="24" y="278" fill="#888888" fontFamily="sans-serif" fontSize="11">
        Humanoid segment grows 847%
      </text>

      {/* Divider */}
      <line x1="24" y1="296" x2="296" y2="296" stroke="#1E2642" strokeWidth="1" />

      {/* Funding Watch section */}
      <text x="24" y="320" fill="#00E5A0" fontFamily="monospace" fontSize="10" fontWeight="600">
        FUNDING WATCH
      </text>
      <text x="24" y="342" fill="#888888" fontFamily="sans-serif" fontSize="11">
        Figure AI — $675M Series B
      </text>
      <text x="24" y="360" fill="#888888" fontFamily="sans-serif" fontSize="11">
        Covariant — $222M Series C
      </text>

      {/* CTA Button */}
      <rect x="24" y="376" width="272" height="14" rx="4" fill="#00C2FF" opacity="0.15" />
      <text x="115" y="387" fill="#00C2FF" fontFamily="sans-serif" fontSize="9" fontWeight="600">
        Read Full Issue
      </text>
    </svg>
  );
}
