"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Braces, FileSignature, Gavel, ShieldQuestion, Vote } from "lucide-react";
import { toast } from "sonner";
import { program } from "@/lib/protocol-data";
import { useWalletStore } from "@/stores/wallet-store";

const actions = [
  {
    id: "register",
    label: "Register agent",
    route: "Registry/RegisterAgent",
    icon: FileSignature,
    args: ['"cipher-scribe"', '"Reads proposals cleanly"']
  },
  {
    id: "declare",
    label: "Declare capability",
    route: "Declarations/DeclareCapability",
    icon: Braces,
    args: ['"Summarize governance."', '"Governance"', "5 VARA"]
  },
  {
    id: "challenge",
    label: "Issue challenge",
    route: "Trials/IssueChallenge",
    icon: Gavel,
    args: ["declaration_id", "5 VARA", "100 blocks"]
  },
  {
    id: "proof",
    label: "Submit proof",
    route: "Trials/SubmitProof",
    icon: ShieldQuestion,
    args: ["trial_id", '"Matched quorum, spend, and vote impact."']
  },
  {
    id: "vote",
    label: "Witness vote",
    route: "Trials/CastWitnessVote",
    icon: Vote,
    args: ["trial_id", "verified: true", "weight: 1"]
  },
  {
    id: "settle",
    label: "Settle trial",
    route: "Trials/SettleTrial",
    icon: BadgeCheck,
    args: ["trial_id"]
  }
];

export function TransactionWorkstation() {
  const [selected, setSelected] = useState(actions[1]);
  const [armed, setArmed] = useState(false);
  const { address, mode, connectInjected } = useWalletStore();
  const payload = useMemo(() => `${selected.route}(${selected.args.join(", ")})`, [selected]);

  function arm() {
    if (!address) {
    toast.message("Connect wallet first. Nothing sent.");
      void connectInjected();
      return;
    }
    setArmed(true);
    toast.success("Intent staged.");
  }

  return (
    <section className="relative overflow-hidden border border-white/10 bg-[#07070b] p-5">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-cyan/10 to-transparent" />
      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">wallet gated</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-syne text-2xl font-bold">Call shape</h2>
          <span className="border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
            {mode === "injected" ? "wallet ready" : "locked"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[230px_1fr]">
          <div className="grid gap-1.5">
            {actions.map((action) => {
              const Icon = action.icon;
              const active = selected.id === action.id;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    setSelected(action);
                    setArmed(false);
                  }}
                  className={`flex min-h-10 items-center gap-3 border px-3 text-left transition ${
                    active ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-white/10 bg-black/25 text-white/56 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-mono text-xs uppercase tracking-[0.12em]">{action.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border border-white/10 bg-black/35 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">{selected.route}</p>
            <AnimatePresence mode="wait">
              <motion.pre
                key={selected.id}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                className="mt-4 overflow-x-auto border border-white/10 bg-black/50 p-4 font-mono text-sm leading-7 text-white/74"
              >
{`program: ${program.id}
route:   ${selected.route}
args:    ${selected.args.join("\n         ")}
wallet:  ${address ?? "not connected"}`}
              </motion.pre>
            </AnimatePresence>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-lg text-sm leading-6 text-white/56">
                Prepared locally. Sent only from your wallet.
              </p>
              <button
                type="button"
                onClick={arm}
                className="inline-flex min-h-11 items-center gap-2 bg-cyan px-4 font-mono text-xs uppercase tracking-[0.14em] text-black transition hover:bg-white"
              >
                {armed ? "Intent staged" : "Stage intent"}
              </button>
            </div>
            {armed ? <p className="mt-4 font-mono text-xs text-verified">{payload}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
