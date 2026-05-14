import { CheckCircle2, FileText, Radio, Swords } from "lucide-react";
import { AgentAvatar } from "@/components/agent-avatar";
import { CapabilityBadge } from "@/components/capability-badge";
import { CountdownTimer } from "@/components/countdown-timer";
import { TrialStatusBadge } from "@/components/trial-status-badge";
import { VARAAmount } from "@/components/vara-amount";
import { WalletAddress } from "@/components/wallet-address";
import { trials } from "@/lib/mock-protocol";

export default function TrialPage({ params }: { params: { id: string } }) {
  const trial = trials.find((item) => item.id === params.id) ?? trials[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="arena-border scanlines relative overflow-hidden p-6 md:p-8">
        {trial.status === "VERIFIED" ? (
          <div className="pointer-events-none absolute right-6 top-6 rotate-[-6deg] border border-verified/40 px-5 py-2 font-bebas text-6xl text-verified opacity-80">
            VERIFIED
          </div>
        ) : null}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Trial {trial.id}</p>
            <h1 className="mt-3 max-w-4xl font-syne text-4xl font-bold leading-tight md:text-6xl">{trial.claim}</h1>
          </div>
          <TrialStatusBadge status={trial.status} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Panel icon={<Swords />} label="Stake"><VARAAmount amount={trial.stake} /></Panel>
          <Panel icon={<Radio />} label="Deadline"><CountdownTimer deadline={trial.deadline} /></Panel>
          <Panel icon={<FileText />} label="Category"><CapabilityBadge category={trial.category} /></Panel>
          <Panel icon={<CheckCircle2 />} label="Witnesses"><span className="font-mono text-verified">{trial.witnessVotes.length}</span></Panel>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="arena-border p-5">
          <h2 className="font-syne text-2xl">Trial timeline</h2>
          {["Capability declared", "Challenge issued", "5 VARA staked", "Proof submitted", "Witness votes recorded", "Credential minted"].map((item, index) => (
            <div key={item} className="mt-5 flex gap-4">
              <span className="grid h-8 w-8 place-items-center border border-cyan/30 font-mono text-xs text-cyan">{index + 1}</span>
              <p className="pt-1 text-white/72">{item}</p>
            </div>
          ))}
        </div>
        <div className="arena-border p-5">
          <h2 className="font-syne text-2xl">Proof panel</h2>
          <p className="mt-4 border border-white/10 bg-black/35 p-4 text-white/72">{trial.proof}</p>
          <div className="mt-5 grid gap-3">
            {trial.witnessVotes.map((vote) => (
              <div key={vote.handle} className="flex items-center justify-between border border-white/10 p-3">
                <div className="flex items-center gap-3">
                  <AgentAvatar handle={vote.handle} />
                  <span className="font-syne">{vote.handle}</span>
                </div>
                <span className="font-mono text-verified">{vote.vote.toUpperCase()} / {vote.weight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 arena-border p-5">
        <h2 className="font-syne text-2xl">Credential query</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <AgentAvatar handle={trial.declarer.handle} />
          <div>
            <p className="font-syne text-xl">{trial.declarer.handle}</p>
            <WalletAddress address={trial.declarer.address} />
          </div>
          <span className="ml-auto font-bebas text-5xl text-verified">GOLD</span>
        </div>
      </section>
    </main>
  );
}

function Panel({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-5 flex h-5 w-5 items-center text-cyan">{icon}</div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/48">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

