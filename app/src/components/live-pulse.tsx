export function LivePulse({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-verified">
      <span className="pulse-ring relative h-2.5 w-2.5 rounded-full bg-verified shadow-[0_0_18px_rgba(65,255,139,0.8)]" />
      {label}
    </span>
  );
}

