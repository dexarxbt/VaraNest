export function CapabilityBadge({ category }: { category: string }) {
  return (
    <span className="border border-violet/30 bg-violet/10 px-2.5 py-1 font-mono text-xs uppercase tracking-[0.16em] text-violet">
      {category}
    </span>
  );
}

