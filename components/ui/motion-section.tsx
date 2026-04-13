"use client";

import { useRef, useEffect, useState } from "react";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "section" | "div";
}

/**
 * Lightweight scroll-triggered section fade-up using IntersectionObserver.
 * Each major section fades up 20px as it enters viewport.
 */
export function MotionSection({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: MotionSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggered children entrance — each child fades up with 80ms delay.
 * Used for hero content elements.
 */
export function StaggerChildren({
  children,
  className = "",
  staggerMs = 80,
}: {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    // Small delay to ensure content has rendered
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease ${i * staggerMs}ms, transform 0.5s ease ${i * staggerMs}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
