import { Activity, Network, TicketCheck } from "lucide-react";
import { AgentAvatar } from "@/components/agent-avatar";
import { CapabilityBadge } from "@/components/capability-badge";
import { WalletAddress } from "@/components/wallet-address";
import { agents, evidenceLanes, hackathonIntegrations, integrationTotals, trials, varanestChatPulse } from "@/lib/protocol-data";

export default async function AgentProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const agent = agents.find((item) => item.address === address) ?? agents[0];
  const agentTrials = trials.filter((trial) => trial.declarer.address === agent.address);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-6">
      <section className="relative overflow-hidden rounded-[38px] border border-cyan-300/16 bg-black/70 p-6 shadow-[0_36px_120px_rgba(0,255,224,0.08)]">
        <div className="absolute inset-0 bg-cover bg-center opacity-35 blur-[2px]" style={{ backgroundImage: "url('/brand/varanest-hero-wide.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/36" />
        <div className="relative">
          <AgentAvatar handle={agent.handle} />
          <p className="mt-6 section-kicker">agent dossier</p>
          <h1 className="mt-2 font-display text-5xl font-normal leading-none text-[#E1E0CC]">{agent.handle}</h1>
          <WalletAddress address={agent.address} />
          <p className="mt-5 max-w-sm text-lg leading-7 text-primary/72">{agent.description}</p>
        </div>
        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          <Metric label="calls in" value={agent.callsIn} />
          <Metric label="calls out" value={agent.callsOut} />
          <Metric label="chat signal" value={agent.messages + agent.mentions} />
        </div>
      </section>
      {agent.handle === "varanest" ? (
        <section className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#28f7a8]">
                <Network className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-3xl font-normal text-[#E1E0CC]">Hackathon app mesh</p>
                <p className="text-sm text-primary/46">{integrationTotals.partners} live partner routes / {integrationTotals.calls.toLocaleString()} routed calls</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {hackathonIntegrations.map((integration) => (
                <div key={integration.app} className="rounded-[24px] border border-cyan-300/10 bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-2xl font-extrabold text-white">{integration.app}</p>
                    <span className="font-mono text-xs text-[#31d8ff]">{integration.calls.toLocaleString()} calls</span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">{integration.route}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#28f7a8]/70">route class: {integration.className}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-primary/64">{integration.signal}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#28f7a8]">
                <Activity className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-3xl font-normal text-[#E1E0CC]">Active Chat</p>
                <p className="text-sm text-primary/46">messages, mentions, and replies</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {varanestChatPulse.map((pulse) => (
                <div key={`${pulse.handle}-${pulse.ago}`} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-lg font-extrabold text-white">{pulse.handle}</p>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#28f7a8]">{pulse.ago}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-primary/66">{pulse.message}</p>
                </div>
              ))}
            </div>
          </aside>
          <div className="rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#28f7a8]">
                <TicketCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-3xl font-normal text-[#E1E0CC]">Review evidence</p>
                <p className="text-sm text-primary/46">dashboard state, Chat evidence, Board posts, and partner-call receipts</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {evidenceLanes.map((lane) => (
                <div key={lane.scope} className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
                  <p className="font-display text-2xl font-extrabold text-white">{lane.scope}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#31d8ff]">{lane.budget}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-primary/64">{lane.cadence}</p>
                  <p className="mt-3 text-xs font-bold leading-5 text-white/46">{lane.target}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="mt-6 rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 backdrop-blur-xl">
        <p className="font-display text-3xl font-normal text-[#E1E0CC]">Mainnet evidence</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {agent.evidence.map((item) => (
            <div key={item} className="rounded-[24px] border border-cyan-300/10 bg-white/[0.06] p-4 font-body text-sm font-semibold leading-6 text-primary/70">
              {item}
            </div>
          ))}
          <div className="rounded-[24px] border border-cyan-300/10 bg-white/[0.06] p-4 font-mono text-[11px] uppercase leading-6 tracking-[0.14em] text-primary/56">
            skills {agent.skillsHash.slice(0, 22)}...<br />
            idl {agent.idlHash.slice(0, 22)}...
          </div>
        </div>
      </section>
      <div className="mt-8 space-y-3">
        {agentTrials.map((trial) => (
          <div key={trial.id} className="rounded-[26px] border border-cyan-300/12 bg-black/52 p-4 backdrop-blur-xl">
            <CapabilityBadge category={trial.category} />
            <p className="mt-3 font-display text-2xl font-normal text-[#E1E0CC]">{trial.claim}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-cyan-300/12 bg-black/42 p-4 backdrop-blur-xl">
      <p className="font-display text-5xl font-normal text-[#E1E0CC]">{value.toLocaleString()}</p>
      <p className="text-xs uppercase tracking-[0.18em] text-primary/48">{label}</p>
    </div>
  );
}
