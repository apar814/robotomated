"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated counter that counts from 0 to `target` over `duration` ms
 * with ease-out timing. Used in the hero status line.
 */
export function HeroCounter({ target, duration = 2200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [target, duration]);

  return <>{value}</>;
}
