"use client";

export function RobotArmAnimation() {
  return (
    <div className="relative h-[500px] w-full max-w-[600px]">
      <svg viewBox="0 0 600 500" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,194,255,0.05)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="armGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00C2FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="600" height="500" fill="url(#heroGrid)" />

        {/* Base platform */}
        <ellipse cx="200" cy="420" rx="80" ry="20" fill="#0A0F1E" stroke="#00C2FF" strokeWidth="1" opacity="0.5" />
        <rect x="170" y="380" width="60" height="40" rx="4" fill="#111827" stroke="#00C2FF" strokeWidth="1" opacity="0.6" />

        {/* Arm segment 1 */}
        <g className="animate-arm-base" style={{ transformOrigin: "200px 380px" }}>
          <rect x="190" y="260" width="20" height="120" rx="10" fill="url(#armGradient)" opacity="0.8" />

          {/* Joint 1 */}
          <circle cx="200" cy="260" r="14" fill="#111827" stroke="#00C2FF" strokeWidth="2" filter="url(#glow)" />
          <circle cx="200" cy="260" r="6" fill="#00C2FF" opacity="0.8" />

          {/* Arm segment 2 */}
          <g className="animate-arm-mid" style={{ transformOrigin: "200px 260px" }}>
            <rect x="190" y="160" width="20" height="100" rx="10" fill="url(#armGradient)" opacity="0.7" />

            {/* Joint 2 */}
            <circle cx="200" cy="160" r="12" fill="#111827" stroke="#00C2FF" strokeWidth="2" filter="url(#glow)" />
            <circle cx="200" cy="160" r="5" fill="#00C2FF" opacity="0.8" />

            {/* Gripper */}
            <g className="animate-gripper" style={{ transformOrigin: "200px 160px" }}>
              <path d="M185,160 L175,120 L180,115 L195,155" fill="#111827" stroke="#00C2FF" strokeWidth="1.5" />
              <path d="M215,160 L225,120 L220,115 L205,155" fill="#111827" stroke="#00C2FF" strokeWidth="1.5" />
              <circle cx="200" cy="118" r="4" fill="#00C2FF" filter="url(#softGlow)" className="animate-pulse" />
            </g>
          </g>
        </g>

        {/* Floating data points */}
        <g className="animate-float-slow">
          <circle cx="320" cy="180" r="3" fill="#00C2FF" opacity="0.6" />
          <text x="330" y="184" fill="#00C2FF" opacity="0.4" fontSize="10" fontFamily="monospace">ROI: 12mo</text>
        </g>
        <g className="animate-float-medium">
          <circle cx="340" cy="280" r="3" fill="#00C2FF" opacity="0.6" />
          <text x="350" y="284" fill="#00C2FF" opacity="0.4" fontSize="10" fontFamily="monospace">18kg payload</text>
        </g>
        <g className="animate-float-fast">
          <circle cx="100" cy="220" r="3" fill="#00C2FF" opacity="0.6" />
          <text x="40" y="224" fill="#00C2FF" opacity="0.4" fontSize="10" fontFamily="monospace">&plusmn;0.025mm</text>
        </g>
        <g className="animate-float-slow" style={{ animationDelay: "2s" }}>
          <circle cx="380" cy="350" r="3" fill="#00C2FF" opacity="0.6" />
          <text x="390" y="354" fill="#00C2FF" opacity="0.4" fontSize="10" fontFamily="monospace">Score: 87</text>
        </g>

        {/* Scan line */}
        <rect x="0" y="0" width="600" height="2" fill="url(#glowGradient)" className="animate-scan" />
      </svg>
    </div>
  );
}
