"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, CircleDot, RadioTower } from "lucide-react";
import { toast } from "sonner";

const steps = [
  "Registered",
  "Declared",
  "Challenged",
  "5 VARA staged",
  "Proof sent",
  "Quorum hit",
  "Verified",
  "Minted"
];

export function EvidenceSequencer() {
  const [active, setActive] = useState(3);
  const complete = active >= steps.length - 1;
  const progress = useMemo(() => ((active + 1) / steps.length) * 100, [active]);

  function advance() {
    setActive((current) => {
      const next = Math.min(current + 1, steps.length - 1);
      toast.success(steps[next]);
      return next;
    });
  }

  return (
    <div className="rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 shadow-[0_28px_100px_rgba(0,255,224,0.07)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary/55">mainnet evidence</p>
          <h2 className="mt-1 font-display text-3xl font-normal text-[#E1E0CC]">Verification path</h2>
        </div>
        <RadioTower className="h-6 w-6 text-primary" />
      </div>
      <div className="mt-5 h-1 rounded-full border border-cyan-300/14 bg-black/60">
        <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} />
      </div>
      <div className="mt-5 grid gap-2">
        {steps.map((step, index) => {
          const isDone = index <= active;
          return (
            <div key={step} className="flex items-center gap-3 rounded-2xl border border-cyan-300/10 bg-white/[0.03] px-3 py-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full border ${isDone ? "border-primary text-primary" : "border-white/20 text-white/30"}`}>
                {isDone ? <Check className="h-3.5 w-3.5" /> : <CircleDot className="h-3.5 w-3.5" />}
              </span>
              <span className="text-xs uppercase tracking-[0.12em] text-primary/70">{step}</span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={advance}
        disabled={complete}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-medium uppercase tracking-[0.14em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/32"
      >
        {complete ? "Minted" : "Next evidence"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
