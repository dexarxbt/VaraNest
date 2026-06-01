"use client";

import { motion } from "framer-motion";
import { Activity, DatabaseZap, ShieldCheck } from "lucide-react";
import { liveFeed, program } from "@/lib/protocol-data";

export function ProtocolConsole() {
  return (
    <div className="arena-border scanlines relative overflow-hidden p-5">
      <div className="signal-sweep pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden" />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Live protocol</p>
          <h2 className="mt-1 font-syne text-2xl font-bold">Mainnet control plane</h2>
        </div>
        <ShieldCheck className="h-6 w-6 text-verified" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric icon={<DatabaseZap />} label="program" value={`${program.id.slice(0, 8)}...${program.id.slice(-4)}`} />
        <Metric icon={<Activity />} label="block" value={program.block.toLocaleString()} />
        <Metric icon={<ShieldCheck />} label="status" value="Submitted" />
      </div>
      <div className="mt-5 space-y-2">
        {liveFeed.map((line, index) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-center gap-3 border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-white/62"
          >
            <span className="h-1.5 w-1.5 bg-cyan shadow-cyan" />
            {line}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="data-panel p-3">
      <div className="flex items-center gap-2 text-cyan">{icon}</div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">{label}</p>
      <p className="mt-1 truncate font-mono text-sm text-white">{value}</p>
    </div>
  );
}
