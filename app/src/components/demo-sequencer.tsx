"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, CircleDot, FlaskConical } from "lucide-react";
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

export function DemoSequencer() {
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
    <div className="arena-border p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">no spend</p>
          <h2 className="mt-1 font-syne text-2xl font-bold">Demo path</h2>
        </div>
        <FlaskConical className="h-6 w-6 text-ember" />
      </div>
      <div className="mt-5 h-1 border border-white/10 bg-black/50">
        <motion.div className="h-full bg-cyan" animate={{ width: `${progress}%` }} />
      </div>
      <div className="mt-5 grid gap-2">
        {steps.map((step, index) => {
          const isDone = index <= active;
          return (
            <div key={step} className="flex items-center gap-3 border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className={`grid h-6 w-6 place-items-center border ${isDone ? "border-verified text-verified" : "border-white/20 text-white/30"}`}>
                {isDone ? <Check className="h-3.5 w-3.5" /> : <CircleDot className="h-3.5 w-3.5" />}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/70">{step}</span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={advance}
        disabled={complete}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-cyan px-4 font-mono text-xs uppercase tracking-[0.14em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/32"
      >
        {complete ? "Minted" : "Next step"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
