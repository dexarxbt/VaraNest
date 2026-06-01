"use client";

import { useState } from "react";
import { BadgePlus, CheckCircle2, ChevronRight, Fingerprint, LockKeyhole, RadioTower, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { categories, program } from "@/lib/protocol-data";
import { getTxUrl } from "@/lib/varanest-config";
import { useWalletStore } from "@/stores/wallet-store";
import type { LiveCallReceipt } from "@/lib/varanest-client";

const steps = ["Write", "Stake", "Review"];

export default function DeclarePage() {
  const { address, source, connectInjected, mode } = useWalletStore();
  const [claim, setClaim] = useState("Summarize governance.");
  const [category, setCategory] = useState("Governance");
  const [stake, setStake] = useState("5");
  const [armed, setArmed] = useState(false);
  const [submitting, setSubmitting] = useState<"trial" | "claim" | null>(null);
  const [receipt, setReceipt] = useState<LiveCallReceipt | null>(null);

  async function ensureWallet() {
    if (!address || !source) {
      toast.message("Connect wallet first. Nothing sent.");
      void connectInjected();
      return null;
    }
    return { address, source };
  }

  function liveHandle() {
    const suffix = address?.slice(-8).toLowerCase().replace(/[^a-z0-9]/g, "") || "agent";
    return `varanest-${suffix}`.slice(0, 32);
  }

  async function runLiveTrial() {
    const wallet = await ensureWallet();
    if (!wallet) return;

    setSubmitting("trial");
    setReceipt(null);
    try {
      const { runRepeatableLiveTrial } = await import("@/lib/varanest-client");
      const result = await runRepeatableLiveTrial(
        wallet,
        liveHandle(),
        `VaraNest repeatable live trial at ${new Date().toISOString()}: ${claim.slice(0, 80)}`
      );
      setReceipt(result);
      setArmed(true);
      if (result.ok) {
        toast.success(`${result.route} submitted.`);
      } else {
        toast.error(`Transaction included, but program reply failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Live registration failed.");
    } finally {
      setSubmitting(null);
    }
  }

  async function submitDeclaration() {
    const wallet = await ensureWallet();
    if (!wallet) return;

    const numericStake = Number(stake);
    if (!Number.isFinite(numericStake) || numericStake < 0) {
      toast.error("Stake must be a positive number.");
      return;
    }

    setSubmitting("claim");
    setReceipt(null);
    try {
      const { declareCapabilityLive } = await import("@/lib/varanest-client");
      const result = await declareCapabilityLive(wallet, claim, category, BigInt(Math.round(numericStake)));
      setReceipt(result);
      setArmed(true);
      if (result.ok) {
        toast.success("Capability declaration submitted.");
      } else {
        toast.error(`Transaction included, but declaration failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Capability declaration failed. Register the wallet first if this is a new account.");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="relative overflow-hidden rounded-[38px] border border-cyan-300/16 bg-black/70 p-6 shadow-[0_36px_120px_rgba(0,255,224,0.08)] md:p-7">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[2px]" style={{ backgroundImage: "url('/brand/varanest-portrait.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/72 to-black" />
          <p className="section-kicker relative">launch chamber</p>
          <h1 className="relative mt-4 font-display text-5xl font-normal leading-[0.9] text-[#E1E0CC] md:text-6xl">
            Launch a claim. Leave a trail.
          </h1>
          <p className="relative mt-5 max-w-sm text-base leading-7 text-primary/72">
            Stage a capability assertion with visible route, wallet, protocol weight, and receipt before anything touches mainnet.
          </p>

          <div className="relative mt-8 space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 font-display text-sm font-extrabold text-[#28f7a8]">{index + 1}</span>
                <span className="font-body text-sm font-extrabold text-white">{step}</span>
                <ChevronRight className="ml-auto h-4 w-4 text-white/28" />
              </div>
            ))}
          </div>

          <div className="relative mt-7 rounded-[28px] border border-cyan-300/22 bg-black/46 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-primary">
              <LockKeyhole className="h-4 w-4" />
              <p className="text-[11px] uppercase tracking-[0.2em]">manual approval</p>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/66">
              The interface prepares evidence. Your wallet decides submission.
            </p>
          </div>
        </aside>

        <section className="rounded-[38px] border border-cyan-300/14 bg-black/50 p-4 backdrop-blur-xl md:p-6">
          <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <FieldShell eyebrow="01 / claim" title="What can you prove?">
                <textarea
                  value={claim}
                  onChange={(event) => setClaim(event.target.value)}
                  className="min-h-40 w-full resize-none rounded-[26px] border border-white/12 bg-black/28 p-5 font-body text-xl font-extrabold leading-8 text-white outline-none transition placeholder:text-white/28 focus:border-[#28f7a8]/60"
                />
              </FieldShell>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell eyebrow="02 / category" title="Pick the arena.">
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/12 bg-[#130928] px-4 font-body text-sm font-extrabold text-white outline-none focus:border-[#28f7a8]/60"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell eyebrow="03 / weight" title="Add signal weight.">
                  <div className="flex h-14 overflow-hidden rounded-2xl border border-white/12 bg-black/28">
                    <input
                      value={stake}
                      onChange={(event) => setStake(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent px-4 font-mono text-lg font-bold text-[#ff7a2f] outline-none"
                    />
                    <span className="grid w-24 place-items-center border-l border-white/10 font-mono text-xs uppercase tracking-[0.16em] text-white/42">weight</span>
                  </div>
                </FieldShell>
              </div>

              <button type="button" onClick={runLiveTrial} disabled={submitting !== null} className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-medium text-black shadow-[0_18px_58px_rgba(0,255,224,0.16)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60">
                <RadioTower className="h-4 w-4" />
                {submitting === "trial" ? "Calling mainnet..." : "Run live trial call"}
              </button>
              <button type="button" onClick={submitDeclaration} disabled={submitting !== null} className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#28f7a8]/34 bg-[#28f7a8]/12 px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#28f7a8] transition hover:border-[#28f7a8]/70 hover:bg-[#28f7a8]/18 disabled:cursor-not-allowed disabled:opacity-60">
                <BadgePlus className="h-4 w-4 transition group-hover:rotate-12" />
                {submitting === "claim" ? "Submitting..." : "Submit capability"}
              </button>
            </form>

            <aside className="space-y-4">
              <div className="rounded-[30px] border border-white/12 bg-[#08050f]/76 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/46">receipt</p>
                  <Sparkles className="h-4 w-4 text-[#28f7a8]" />
                </div>
                <div className="mt-5 space-y-4 font-mono text-xs leading-6 text-white/66">
                  <ReceiptRow label="program" value={`${program.id.slice(0, 12)}...${program.id.slice(-8)}`} />
                  <ReceiptRow label="route" value="Declarations/DeclareCapability" />
                  <ReceiptRow label="wallet" value={address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "not connected"} />
                  <ReceiptRow label="mode" value={mode} />
                </div>
              </div>

              <div className="rounded-[30px] border border-white/12 bg-white/[0.07] p-5">
                <p className="font-display text-2xl font-extrabold text-white">Preview</p>
                <p className="mt-4 font-body text-lg font-extrabold leading-7 text-white">{claim}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/58">{category}</span>
                  <span className="rounded-full bg-[#ff7a2f]/16 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#ff9a5c]">{stake} weight</span>
                </div>
              </div>

              {armed ? (
                <div className="rounded-[30px] border border-[#28f7a8]/28 bg-[#28f7a8]/12 p-5">
                  <div className="flex items-center gap-2 text-[#28f7a8]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-display text-lg font-extrabold">{receipt?.ok === false ? "Included, failed" : "Submitted"}</span>
                  </div>
                  {receipt ? (
                    <div className="mt-4 space-y-3 font-mono text-[11px] leading-5 text-white/72">
                      <ReceiptRow label="route" value={receipt.route} />
                      <ReceiptRow label="message" value={receipt.msgId} />
                      <ReceiptRow label="tx" value={receipt.txHash} />
                      <ReceiptRow label="block" value={receipt.blockHash} />
                      <ReceiptRow label="finalized" value={receipt.finalized ? "yes" : "pending"} />
                      {receipt.error ? <ReceiptRow label="error" value={receipt.error} /> : null}
                      {getTxUrl(receipt.txHash) ? (
                        <a className="inline-flex text-[#28f7a8] underline-offset-4 hover:underline" href={getTxUrl(receipt.txHash) ?? undefined} target="_blank" rel="noreferrer">
                          Open explorer receipt
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm font-semibold leading-6 text-white/66">Wallet approval requested.</p>
                  )}
                </div>
              ) : (
                <div className="grid gap-3 rounded-[30px] border border-white/10 bg-black/18 p-5">
                  <SafetyPoint icon={<ShieldCheck className="h-4 w-4" />} text="Live program." />
                  <SafetyPoint icon={<Fingerprint className="h-4 w-4" />} text="Visible wallet." />
                  <SafetyPoint icon={<RadioTower className="h-4 w-4" />} text="Manual approval." />
                </div>
              )}
            </aside>
          </div>
        </section>
      </section>
    </main>
  );
}

function FieldShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-[30px] border border-white/10 bg-black/16 p-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#28f7a8]">{eyebrow}</span>
      <span className="mt-2 block font-display text-xl font-extrabold text-white">{title}</span>
      <div className="mt-4">{children}</div>
    </label>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="uppercase tracking-[0.18em] text-white/34">{label}</p>
      <p className="mt-1 break-all text-white/78">{value}</p>
    </div>
  );
}

function SafetyPoint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-white/68">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-[#28f7a8]">{icon}</span>
      {text}
    </div>
  );
}
