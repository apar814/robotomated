"use client";

import { useCallback, useRef } from "react";

/**
 * Holographic hover effect — creates a radial glow that follows the mouse.
 * Attach onMouseMove and onMouseLeave to the card element,
 * and set the ref on it.
 *
 * Usage:
 *   const { ref, onMouseMove, onMouseLeave } = useHolographic();
 *   <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
 */
export function useHolographic(
  glowColor = "14,165,233",
  glowOpacity = 0.06
) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--holo-x", `${x}%`);
      el.style.setProperty("--holo-y", `${y}%`);
      el.style.setProperty("--holo-opacity", "1");
    },
    []
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--holo-opacity", "0");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
