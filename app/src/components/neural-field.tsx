"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const activeCanvas = canvas;
    const activeContext = context;

    let animation = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: 0.5, y: 0.5 };
    const particles: Particle[] = [];

    function resize() {
      const rect = activeCanvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      activeCanvas.width = Math.floor(width * ratio);
      activeCanvas.height = Math.floor(height * ratio);
      activeContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.length = 0;
      const count = Math.min(96, Math.max(42, Math.floor((width * height) / 12000)));
      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: 0.8 + Math.random() * 1.6
        });
      }
    }

    function onPointerMove(event: PointerEvent) {
      const rect = activeCanvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
    }

    function draw() {
      activeContext.clearRect(0, 0, width, height);
      const px = pointer.x * width;
      const py = pointer.y * height;

      const gradient = activeContext.createRadialGradient(px, py, 0, px, py, Math.max(width, height) * 0.7);
      gradient.addColorStop(0, "rgba(33,246,255,0.16)");
      gradient.addColorStop(0.34, "rgba(141,92,255,0.08)");
      gradient.addColorStop(1, "rgba(5,5,8,0)");
      activeContext.fillStyle = gradient;
      activeContext.fillRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx + (px - particle.x) * 0.0008;
        particle.y += particle.vy + (py - particle.y) * 0.0008;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      }

      for (let a = 0; a < particles.length; a += 1) {
        const source = particles[a];
        for (let b = a + 1; b < particles.length; b += 1) {
          const target = particles[b];
          const distance = Math.hypot(source.x - target.x, source.y - target.y);
          if (distance < 132) {
            activeContext.strokeStyle = `rgba(33,246,255,${(1 - distance / 132) * 0.16})`;
            activeContext.lineWidth = 1;
            activeContext.beginPath();
            activeContext.moveTo(source.x, source.y);
            activeContext.lineTo(target.x, target.y);
            activeContext.stroke();
          }
        }
      }

      for (const particle of particles) {
        activeContext.fillStyle = "rgba(244,251,255,0.72)";
        activeContext.beginPath();
        activeContext.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        activeContext.fill();
      }

      animation = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    activeCanvas.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      activeCanvas.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-80" />;
}
