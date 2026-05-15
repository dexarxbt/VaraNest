"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type MagneticButtonProps = {
  href?: string;
  children: React.ReactNode;
  tone?: "cyan" | "violet" | "ghost";
  onClick?: () => void;
};

export function MagneticButton({ href, children, tone = "cyan", onClick }: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });
  const glowX = useTransform(springX, [-20, 20], ["15%", "85%"]);
  const glowY = useTransform(springY, [-20, 20], ["20%", "80%"]);

  const className =
    tone === "cyan"
      ? "border-cyan/40 bg-cyan text-black"
      : tone === "violet"
        ? "border-violet/40 bg-violet/15 text-violet"
        : "border-white/14 bg-white/[0.03] text-white/78";

  const content = (
    <motion.span
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.14);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`relative inline-flex min-h-12 items-center justify-center overflow-hidden border px-5 font-mono text-xs uppercase tracking-[0.16em] transition ${className}`}
    >
      <motion.span
        aria-hidden="true"
        style={{ left: glowX, top: glowY }}
        className="absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-xl"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick}>
      {content}
    </button>
  );
}
