"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated counter that counts from 0 to `target` over `duration` ms
 * with ease-out timing. Triggers on viewport intersection.
 */
export function HeroCounter({
  target,
  duration = 2200,
  delay = 0,
  prefix = "",
  suffix = "",
}: {
  target: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Trigger on viewport intersection
  useEffect(() => {
    const el = ref.current;
    if (!el || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Animate on start
  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timeout);
  }, [hasStarted, target, duration, delay]);

  return (
    <span ref={ref}>
      {prefix}{value}{suffix}
    </span>
  );
}
