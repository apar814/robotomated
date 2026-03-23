"use client";

import { useEffect, useState } from "react";

/**
 * "The Placement" — A robotic arm descends carrying the bridge "O"
 * and places it into the gap in ROBOT_MATED, completing the wordmark.
 *
 * Bug fixes:
 * - viewBox widened to 660px so all 11 letters fit
 * - Single O element (not two), starts above at opacity 0, descends with arm
 * - fontSize reduced to 44 with tighter spacing to fit in viewBox
 */
export function HeroAnimation() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return (
      <div className="flex h-[400px] w-full max-w-[600px] items-center justify-center">
        <StaticWordmark />
      </div>
    );
  }

  // Letter metrics: fontSize=44, each char ~30px wide, total ~330px for 11 chars
  // ROBOT = 5 chars @ x=60, MATED = 5 chars starting after the O gap
  // O gap center: ~210px from "ROBOT" end
  const fontSize = 44;
  const oX = 206; // x position of the bridge O in the wordmark
  const oY = 150; // baseline y
  const oCenterY = 135; // vertical center of the O for circuits/pulses

  return (
    <div className="relative flex h-[400px] w-full max-w-[600px] items-center justify-center overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />

      <svg viewBox="0 0 660 240" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="armGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5F0E6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4C9B5" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* ── STATIC WORDMARK PARTS ── */}
        {/* "ROBOT" — always full opacity */}
        <text
          x="60" y={oY}
          fill="#F5F0E6"
          fontSize={fontSize}
          fontFamily="var(--font-display), system-ui"
          fontWeight="800"
          letterSpacing="2"
        >
          ROBOT
        </text>

        {/* "MATED" — starts dim, brightens on O placement */}
        <text
          x="240" y={oY}
          className="hero-text-right"
          fill="#F5F0E6"
          fontSize={fontSize}
          fontFamily="var(--font-display), system-ui"
          fontWeight="800"
          letterSpacing="2"
        >
          MATED
        </text>

        {/* Gap glow pulse — pulses in the gap before O arrives */}
        <circle cx={oX + 14} cy={oCenterY} r="3" fill="#C8A84E" className="hero-gap-pulse" />

        {/* ── THE BRIDGE O — single element, animated from above into position ── */}
        {/* This is the ONLY O. It starts at translateY(-120) opacity 0, descends, and stays. */}
        <g className="hero-o-placement" style={{ transformOrigin: `${oX + 14}px ${oY}px` }}>
          <text
            x={oX} y={oY}
            fill="#F5F0E6"
            fontSize={fontSize}
            fontFamily="var(--font-display), system-ui"
            fontWeight="800"
          >
            O
          </text>
          {/* Circuit crosshair inside the O — appears on placement */}
          <line x1={oX + 4} y1={oCenterY} x2={oX + 24} y2={oCenterY} stroke="#C8A84E" strokeWidth="0.8" className="hero-circuit-lines" />
          <line x1={oX + 14} y1={oCenterY - 12} x2={oX + 14} y2={oCenterY + 12} stroke="#C8A84E" strokeWidth="0.8" className="hero-circuit-lines" />
          <circle cx={oX + 14} cy={oCenterY} r="1.5" fill="#C8A84E" className="hero-circuit-lines" />
        </g>

        {/* Gold connection lines — zip on placement */}
        <line x1="170" y1={oCenterY} x2={oX + 2} y2={oCenterY} stroke="#C8A84E" strokeWidth="1" className="hero-connect-left" strokeDasharray="38" strokeDashoffset="38" />
        <line x1={oX + 26} y1={oCenterY} x2="270" y2={oCenterY} stroke="#C8A84E" strokeWidth="1" className="hero-connect-right" strokeDasharray="38" strokeDashoffset="38" />

        {/* Gold pulse ring on placement */}
        <circle cx={oX + 14} cy={oCenterY} fill="none" stroke="#C8A84E" strokeWidth="1" className="hero-place-pulse" r="3" opacity="0" />

        {/* ── ROBOTIC ARM — descends with the O, retracts after ── */}
        <g className="hero-arm-move" style={{ transformOrigin: `${oX + 14}px 0px` }}>
          {/* Shoulder mount */}
          <rect x={oX + 6} y="-10" width="16" height="20" rx="3" fill="#1A2235" stroke="#C8A84E" strokeWidth="0.5" opacity="0.6" />
          {/* Upper arm */}
          <rect x={oX + 10} y="8" width="8" height="50" rx="4" fill="url(#armGrad)" />
          <line x1={oX + 14} y1="12" x2={oX + 14} y2="54" stroke="#C8A84E" strokeWidth="0.6" opacity="0.3" />
          {/* Elbow joint */}
          <circle cx={oX + 14} cy="58" r="6" fill="#1A2235" stroke="#F5F0E6" strokeWidth="1" opacity="0.8" />
          <circle cx={oX + 14} cy="58" r="2" fill="#C8A84E" opacity="0.6" />
          {/* Forearm */}
          <rect x={oX + 10} y="62" width="8" height="40" rx="4" fill="url(#armGrad)" />
          <line x1={oX + 14} y1="66" x2={oX + 14} y2="98" stroke="#C8A84E" strokeWidth="0.6" opacity="0.3" />
          {/* Wrist */}
          <circle cx={oX + 14} cy="102" r="5" fill="#1A2235" stroke="#F5F0E6" strokeWidth="1" opacity="0.8" />
          <circle cx={oX + 14} cy="102" r="1.5" fill="#C8A84E" opacity="0.6" />
          {/* Gripper */}
          <g className="hero-gripper-action" style={{ transformOrigin: `${oX + 14}px 106px` }}>
            <path d={`M${oX + 9},106 L${oX + 3},118 L${oX + 6},120 L${oX + 12},108`} fill="url(#armGrad)" stroke="#F5F0E6" strokeWidth="0.3" opacity="0.8" />
            <path d={`M${oX + 19},106 L${oX + 25},118 L${oX + 22},120 L${oX + 16},108`} fill="url(#armGrad)" stroke="#F5F0E6" strokeWidth="0.3" opacity="0.8" />
          </g>
        </g>

        {/* Label */}
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
        ROBOT
      </text>
      <text x="206" y="130" fill="#F5F0E6" opacity="0.65" fontSize="44" fontFamily="var(--font-display), system-ui" fontWeight="800">
        O
      </text>
      <text x="240" y="130" fill="#F5F0E6" fontSize="44" fontFamily="var(--font-display), system-ui" fontWeight="800" letterSpacing="2">
        MATED
      </text>
      <line x1="210" y1="115" x2="230" y2="115" stroke="#C8A84E" strokeWidth="0.8" opacity="0.3" />
      <line x1="220" y1="103" x2="220" y2="127" stroke="#C8A84E" strokeWidth="0.8" opacity="0.3" />
      <circle cx="220" cy="115" r="1.5" fill="#C8A84E" opacity="0.4" />
    </svg>
  );
}
