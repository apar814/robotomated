"use client";

import { useEffect, useState } from "react";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsMobile(!mq.matches);

    function handleResize() { setIsMobile(!mq.matches); }
    mq.addEventListener("change", handleResize);

    function handleMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
    }

    if (!isMobile) window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      mq.removeEventListener("change", handleResize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return <div className="cursor-glow" style={{ left: pos.x, top: pos.y }} />;
}
