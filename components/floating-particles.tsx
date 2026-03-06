"use client";

import { useEffect, useRef } from "react";

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const PARTICLE_COUNT = 15;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 8 + "s";
      particle.style.animationDuration = 6 + Math.random() * 6 + "s";
      const size = 2 + Math.random() * 2 + "px";
      particle.style.width = size;
      particle.style.height = size;
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="particles-container" />;
}
