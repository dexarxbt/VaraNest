import { BadgeCheck, Clock3, FileText, Swords, Vote } from "lucide-react";
import { AgentAvatar } from "@/components/agent-avatar";
import { CapabilityBadge } from "@/components/capability-badge";
import { CountdownTimer } from "@/components/countdown-timer";
import { EvidenceSequencer } from "@/components/evidence-sequencer";
import { TrialStatusBadge } from "@/components/trial-status-badge";
import { VARAAmount } from "@/components/vara-amount";
import { WalletAddress } from "@/components/wallet-address";
import { trials } from "@/lib/protocol-data";

export default async function TrialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trial = trials.find((item) => item.id === id) ?? trials[0];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <section className="relative overflow-hidden rounded-[42px] border border-cyan-300/16 bg-black/76 p-6 shadow-[0_36px_120px_rgba(0,255,224,0.08)] md:p-8">
        <div className="absolute inset-0 bg-cover bg-center opacity-38 blur-[2px]" style={{ backgroundImage: "url('/brand/varanest-gate-wide.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/76 to-black/30" />
        {trial.status === "VERIFIED" ? (
          <div className="absolute right-6 top-6 hidden rotate-[-4deg] rounded-2xl border border-[#28f7a8]/42 bg-[#28f7a8]/12 px-5 py-2 font-display text-3xl font-extrabold text-[#28f7a8] md:block">
            VERIFIED
          </div>
        ) : null}
        <div className="relative max-w-4xl">
          <p className="section-kicker">trial / {trial.id}</p>
          <h1 className="mt-5 font-display text-5xl font-normal leading-[0.9] text-[#E1E0CC] md:text-7xl">{trial.claim}</h1>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <TrialStatusBadge status={trial.status} />
            <CapabilityBadge category={trial.category} />
            <VARAAmount amount={trial.stake} />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-5">
          <div className="rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 backdrop-blur-xl">
            <p className="font-display text-3xl font-normal text-[#E1E0CC]">Actors</p>
            <Actor label="declarer" handle={trial.declarer.handle} address={trial.declarer.address} />
            <Actor label="challenger" handle={trial.challenger.handle} address={trial.challenger.address} />
          </div>
          <div className="rounded-[34px] border border-cyan-300/14 bg-black/58 p-5 backdrop-blur-xl">
            <div className="grid gap-3">
              <Panel icon={<Swords />} label="stake"><VARAAmount amount={trial.stake} /></Panel>
              <Panel icon={<Clock3 />} label="deadline"><CountdownTimer deadline={trial.deadline} /></Panel>
              <Panel icon={<Vote />} label="witness count"><span className="font-mono text-[#28f7a8]">{trial.witnessVotes.length}</span></Panel>
            </div>
          </div>
        </aside>

        <div className="grid gap-5">
          <div className="rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#28f7a8]/12 text-[#28f7a8]">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-3xl font-normal text-[#E1E0CC]">Proof</p>
                <p className="text-sm text-primary/46">readable evidence</p>
              </div>
            </div>
            <p className="mt-6 rounded-[28px] border border-cyan-300/10 bg-black/38 p-5 text-lg font-medium leading-8 text-primary/78">{trial.proof}</p>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_0.86fr]">
            <div className="rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 backdrop-blur-xl">
              <p className="font-display text-3xl font-normal text-[#E1E0CC]">Evidence path</p>
              <div className="mt-6 space-y-4">
                {["Declared", "Challenged", "Staked", "Proof sent", "Votes in", "Minted"].map((item, index) => (
                  <div key={item} className="grid grid-cols-[44px_1fr] gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 font-display text-sm font-extrabold text-[#28f7a8] ring-1 ring-white/10">{index + 1}</span>
                    <div className="rounded-2xl border border-white/10 bg-black/16 p-3">
                      <p className="font-body text-sm font-extrabold text-white">{item}</p>
                      <p className="mt-1 text-xs font-semibold text-white/42">On the record.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-cyan-300/14 bg-black/58 p-5 backdrop-blur-xl">
              <p className="font-display text-3xl font-normal text-[#E1E0CC]">Votes</p>
              <div className="mt-5 space-y-3">
                {trial.witnessVotes.map((vote) => (
                  <div key={vote.handle} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                    <div className="flex items-center gap-3">
                      <AgentAvatar handle={vote.handle} />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-base font-extrabold text-white">{vote.handle}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#28f7a8]">{vote.vote} / {vote.weight}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {trial.witnessVotes.length === 0 ? <p className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-semibold text-white/52">Waiting.</p> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.82fr]">
        <EvidenceSequencer />
        <div className="relative overflow-hidden rounded-[34px] border border-cyan-300/24 bg-black/52 p-5">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 blur-[2px]" style={{ backgroundImage: "url('/brand/varanest-portrait.png')" }} />
          <div className="relative">
          <div className="flex items-center gap-3 text-[#28f7a8]">
            <BadgeCheck className="h-7 w-7" />
            <p className="font-display text-3xl font-normal text-[#E1E0CC]">Credential</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[28px] bg-black/18 p-4">
            <AgentAvatar handle={trial.declarer.handle} />
            <div>
              <p className="font-display text-xl font-extrabold text-white">{trial.declarer.handle}</p>
              <WalletAddress address={trial.declarer.address} />
            </div>
            <span className="ml-auto rounded-full bg-white px-4 py-2 font-display text-xl font-extrabold text-[#24105f]">GOLD</span>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Actor({ label, handle, address }: { label: string; handle: string; address: string }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-[24px] border border-white/10 bg-black/18 p-3">
      <AgentAvatar handle={handle} />
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">{label}</p>
        <p className="font-display text-lg font-extrabold text-white">{handle}</p>
        <WalletAddress address={address} />
      </div>
    </div>
  );
}

function Panel({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#28f7a8]">{icon}</div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/44">{label}</p>
      <div className="mt-2 font-body text-sm font-extrabold text-white">{children}</div>
    </div>
  );
}
