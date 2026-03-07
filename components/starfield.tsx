"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  isGold: boolean;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const STAR_COUNT = 200;
    let stars: Star[] = [];
    let animationId: number;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          size: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.8 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          isGold: Math.random() < 0.15,
        });
      }
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity * (0.5 + twinkle * 0.5);

        if (star.isGold) {
          ctx!.fillStyle = `rgba(201, 168, 76, ${opacity})`;
        } else {
          ctx!.fillStyle = `rgba(200, 200, 220, ${opacity * 0.7})`;
        }

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx!.fill();

        if (star.size > 1 && star.isGold) {
          ctx!.fillStyle = `rgba(201, 168, 76, ${opacity * 0.15})`;
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx!.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createStars();
    animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      resize();
      createStars();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" />;
}
