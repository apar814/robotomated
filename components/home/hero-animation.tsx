"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/**
 * "The Placement" — A robotic arm descends carrying the bridge "O"
 * and places it into the gap in ROBOT_MATED, completing the wordmark.
 *
 * Uses a single <text> for correct spacing. The bridge O is a <tspan>
 * that starts dim and brightens when the arm places it. The arm position
 * is measured from the actual rendered O position via getBBox().
 */
export function HeroAnimation() {
  const [reduced, setReduced] = useState(false);
  const [armX, setArmX] = useState(290); // fallback before measurement
  const oRef = useRef<SVGTSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const measureO = useCallback(() => {
    if (oRef.current) {
      try {
        const bbox = oRef.current.getBBox();
        setArmX(bbox.x + bbox.width / 2);
      } catch {
        // getBBox can fail if not rendered yet
      }
    }
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Measure after fonts load
    if (document.fonts) {
      document.fonts.ready.then(measureO);
    } else {
      setTimeout(measureO, 200);
    }
  }, [measureO]);

  if (reduced) {
    return (
      <div className="flex h-[400px] w-full max-w-[600px] items-center justify-center">
        <StaticWordmark />
      </div>
    );
  }

  const fontSize = 44;
  const oY = 150;
  const oCenterY = 135;

  return (
    <div className="relative flex h-[400px] w-full max-w-[600px] items-center justify-center overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />

      <svg ref={svgRef} viewBox="0 0 660 240" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="armGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5F0E6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4C9B5" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* ── SINGLE WORDMARK — browser handles all letter spacing ── */}
        <text
          x="60" y={oY}
          fill="#F5F0E6"
          fontSize={fontSize}
          fontFamily="var(--font-display), system-ui"
          fontWeight="800"
          letterSpacing="2"
        >
          ROBOT<tspan ref={oRef} className="hero-bridge-o">O</tspan><tspan className="hero-text-right">MATED</tspan>
        </text>

        {/* Gap glow pulse */}
        <circle cx={armX} cy={oCenterY} r="3" fill="#C8A84E" className="hero-gap-pulse" />

        {/* Circuit crosshair */}
        <line x1={armX - 10} y1={oCenterY} x2={armX + 10} y2={oCenterY} stroke="#C8A84E" strokeWidth="0.8" className="hero-circuit-lines" />
        <line x1={armX} y1={oCenterY - 12} x2={armX} y2={oCenterY + 12} stroke="#C8A84E" strokeWidth="0.8" className="hero-circuit-lines" />
        <circle cx={armX} cy={oCenterY} r="1.5" fill="#C8A84E" className="hero-circuit-lines" />

        {/* Gold connection lines */}
        <line x1={armX - 40} y1={oCenterY} x2={armX - 12} y2={oCenterY} stroke="#C8A84E" strokeWidth="1" className="hero-connect-left" strokeDasharray="30" strokeDashoffset="30" />
        <line x1={armX + 12} y1={oCenterY} x2={armX + 40} y2={oCenterY} stroke="#C8A84E" strokeWidth="1" className="hero-connect-right" strokeDasharray="30" strokeDashoffset="30" />

        {/* Gold pulse ring */}
        <circle cx={armX} cy={oCenterY} fill="none" stroke="#C8A84E" strokeWidth="1" className="hero-place-pulse" r="3" opacity="0" />

        {/* ── ROBOTIC ARM ── */}
        <g className="hero-arm-move" style={{ transformOrigin: `${armX}px 0px` }}>
          <rect x={armX - 8} y="-10" width="16" height="20" rx="3" fill="#1A2235" stroke="#C8A84E" strokeWidth="0.5" opacity="0.6" />
          <rect x={armX - 4} y="8" width="8" height="50" rx="4" fill="url(#armGrad)" />
          <line x1={armX} y1="12" x2={armX} y2="54" stroke="#C8A84E" strokeWidth="0.6" opacity="0.3" />
          <circle cx={armX} cy="58" r="6" fill="#1A2235" stroke="#F5F0E6" strokeWidth="1" opacity="0.8" />
          <circle cx={armX} cy="58" r="2" fill="#C8A84E" opacity="0.6" />
          <rect x={armX - 4} y="62" width="8" height="40" rx="4" fill="url(#armGrad)" />
          <line x1={armX} y1="66" x2={armX} y2="98" stroke="#C8A84E" strokeWidth="0.6" opacity="0.3" />
          <circle cx={armX} cy="102" r="5" fill="#1A2235" stroke="#F5F0E6" strokeWidth="1" opacity="0.8" />
          <circle cx={armX} cy="102" r="1.5" fill="#C8A84E" opacity="0.6" />
          <g className="hero-gripper-action" style={{ transformOrigin: `${armX}px 106px` }}>
            <path d={`M${armX - 5},106 L${armX - 11},118 L${armX - 8},120 L${armX - 2},108`} fill="url(#armGrad)" stroke="#F5F0E6" strokeWidth="0.3" opacity="0.8" />
            <path d={`M${armX + 5},106 L${armX + 11},118 L${armX + 8},120 L${armX + 2},108`} fill="url(#armGrad)" stroke="#F5F0E6" strokeWidth="0.3" opacity="0.8" />
          </g>
        </g>

        <text x="330" y="210" fill="#C8A84E" opacity="0.12" fontSize="8" fontFamily="var(--font-mono), monospace" textAnchor="middle">
          PRECISION PLACEMENT
        </text>
      </svg>
    </div>
  );
}

function StaticWordmark() {
  return (
    <svg viewBox="0 0 660 200" className="w-full max-w-[500px]" xmlns="http://www.w3.org/2000/svg">
      <text x="60" y="130" fill="#F5F0E6" fontSize="44" fontFamily="var(--font-display), system-ui" fontWeight="800" letterSpacing="2">
        ROBOTOMATED
      </text>
    </svg>
  );
}
