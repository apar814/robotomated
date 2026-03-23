"use client";

import { useState, useEffect } from "react";

const useCases = [
  "I need a cobot for my CNC shop...",
  "Best robot vacuum under $500?",
  "Automate our warehouse picking...",
  "Surgical robot for urology dept...",
  "Last-mile delivery for groceries...",
];

export function Typewriter() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const currentText = useCases[currentIndex];

  useEffect(() => {
    const speed = deleting ? 30 : 60;
    const timeout = setTimeout(() => {
      if (!deleting && charIndex < currentText.length) {
        setCharIndex(charIndex + 1);
      } else if (!deleting && charIndex === currentText.length) {
        setTimeout(() => setDeleting(true), 1500);
      } else if (deleting && charIndex > 0) {
        setCharIndex(charIndex - 1);
      } else {
        setDeleting(false);
        setCurrentIndex((currentIndex + 1) % useCases.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, currentIndex, currentText.length]);

  return (
    <span className="font-mono text-blue">
      {currentText.slice(0, charIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}
