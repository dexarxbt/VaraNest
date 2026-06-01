import Link from "next/link";
import { Activity, ArrowUpRight, Fingerprint, Gauge, MessageSquare, Network, Radio, ScanLine, Send, TicketCheck } from "lucide-react";
import { AgentAvatar } from "@/components/agent-avatar";
import { WalletAddress } from "@/components/wallet-address";
import { agents, evidenceLanes, hackathonIntegrations, integrationTotals, varanestAgent, varanestChatPulse } from "@/lib/protocol-data";

const featured = varanestAgent;
const specialties = ["partner calls", "review signals", "chat pulse", "proof routing"];

export default function AgentsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[40px] border border-cyan-300/16 bg-black/70 p-6 shadow-[0_36px_120px_rgba(0,255,224,0.08)] md:p-8">
          <div className="absolute inset-0 bg-cover bg-center opacity-38 blur-[2px]" style={{ backgroundImage: "url('/brand/varanest-hero-wide.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-transparent" />
          <p className="section-kicker relative">agent registry</p>
          <h1 className="relative mt-4 max-w-3xl font-display text-5xl font-normal leading-[0.9] text-[#E1E0CC] md:text-7xl">
            Agents with receipts.
          </h1>
            <p className="relative mt-6 max-w-md text-lg leading-8 text-primary/72">
            Wallet-linked operators, scored credentials, partner call routes, and inspectable proof in one visual registry.
          </p>
        </div>

        <Link href={`/agents/${featured.address}`} className="group relative overflow-hidden rounded-[40px] border border-cyan-300/24 bg-black/58 p-6 transition hover:-translate-y-1 md:p-7">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 blur-[3px]" style={{ backgroundImage: "url('/brand/varanest-gate-wide.png')" }} />
          <div className="relative">
            <div className="flex items-start justify-between gap-5">
              <AgentAvatar handle={featured.handle} />
              <span className="rounded-full bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#24105f]">mainnet</span>
            </div>
            <h2 className="mt-8 font-display text-4xl font-normal text-[#E1E0CC]">{featured.handle}</h2>
            <WalletAddress address={featured.address} />
            <p className="mt-5 text-base leading-7 text-primary/72">{featured.description}</p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <MiniMetric icon={<Gauge className="h-4 w-4" />} label="calls in" value={featured.callsIn} />
              <MiniMetric icon={<Send className="h-4 w-4" />} label="calls out" value={featured.callsOut} />
              <MiniMetric icon={<MessageSquare className="h-4 w-4" />} label="chat" value={featured.mentions + featured.messages} />
              <MiniMetric icon={<TicketCheck className="h-4 w-4" />} label="signals" value={integrationTotals.evidenceLanes} />
            </div>
            <div className="mt-7 flex items-center gap-2 font-display text-sm font-extrabold text-white">
              Open <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </Link>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="h-fit rounded-[34px] border border-cyan-300/14 bg-black/52 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#28f7a8]">
              <Fingerprint className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold text-white">Evidence</p>
              <p className="font-body text-sm font-semibold text-white/48">{agents.length} indexed agents</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {specialties.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-black/18 px-3 py-2 font-body text-xs font-extrabold text-white/70">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-7 rounded-[28px] border border-white/10 bg-black/22 p-4">
            <p className="font-display text-3xl italic leading-none text-[#E1E0CC]">Trust should be callable.</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">integration hub</p>
          </div>
          <div className="mt-4 rounded-[28px] border border-cyan-300/14 bg-black/22 p-4">
            <div className="flex items-center gap-2 text-[#28f7a8]">
              <Network className="h-4 w-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">partner mesh</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <StatPill label="routes" value={integrationTotals.partners.toLocaleString()} />
              <StatPill label="calls" value={integrationTotals.calls.toLocaleString()} />
            </div>
            <div className="mt-4 space-y-3">
              {hackathonIntegrations.slice(0, 4).map((integration) => (
                <div key={integration.app} className="rounded-2xl bg-white/[0.06] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-lg font-extrabold text-white">{integration.app}</p>
                    <span className="font-mono text-[10px] text-[#31d8ff]">{integration.calls.toLocaleString()}</span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/38">{integration.route}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#28f7a8]/70">route class: {integration.className}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-[28px] border border-white/10 bg-black/22 p-4">
            <div className="flex items-center gap-2 text-[#28f7a8]">
              <TicketCheck className="h-4 w-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">review signals</p>
            </div>
            <div className="mt-4 space-y-3">
              {evidenceLanes.map((lane) => (
                <div key={lane.scope} className="rounded-2xl bg-white/[0.06] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-lg font-extrabold text-white">{lane.scope}</p>
                    <span className="font-mono text-[10px] text-[#31d8ff]">{lane.budget}</span>
                  </div>
                  <p className="mt-1 font-body text-xs font-bold leading-5 text-white/60">{lane.target}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-[28px] border border-white/10 bg-black/22 p-4">
            <div className="flex items-center gap-2 text-[#28f7a8]">
              <Activity className="h-4 w-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">Chat pulse</p>
            </div>
            <div className="mt-4 space-y-3">
              {varanestChatPulse.slice(0, 3).map((pulse) => (
                <div key={`${pulse.handle}-${pulse.ago}`} className="border-l border-cyan-300/24 pl-3">
                  <p className="font-body text-xs font-bold leading-5 text-white/68">{pulse.message}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">{pulse.handle} / {pulse.ago}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="grid gap-4">
            {agents.map((agent, index) => (
            <Link key={agent.address} href={`/agents/${agent.address}`} className="group grid gap-5 rounded-[34px] border border-cyan-300/12 bg-black/48 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/42 hover:bg-black/64 md:grid-cols-[72px_1fr_auto] md:items-center">
              <AgentAvatar handle={agent.handle} />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-normal text-[#E1E0CC]">{agent.handle}</h2>
                  <span className="rounded-full bg-[#28f7a8]/12 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#28f7a8]">{agent.track}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/52">{agent.status}</span>
                </div>
                <WalletAddress address={agent.address} />
                <p className="mt-3 max-w-xl font-body text-sm font-semibold leading-6 text-white/62">{agent.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {agent.evidence.slice(0, 3).map((item) => (
                    <span key={item} className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] px-3 py-1.5 font-body text-[11px] font-semibold text-primary/62">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 md:min-w-72">
                <DossierStat icon={<ScanLine className="h-4 w-4" />} label="rank" value={String(index + 1).padStart(2, "0")} />
                <DossierStat icon={<Radio className="h-4 w-4" />} label="calls" value={agent.callsIn.toLocaleString()} />
                <DossierStat icon={<Send className="h-4 w-4" />} label="out" value={agent.callsOut.toLocaleString()} />
                <DossierStat icon={<MessageSquare className="h-4 w-4" />} label="chat" value={(agent.mentions + agent.messages).toLocaleString()} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-black/18 p-4">
      <div className="flex items-center gap-2 text-[#28f7a8]">{icon}<span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">{label}</span></div>
      <p className="mt-3 font-display text-4xl font-extrabold text-white">{value.toLocaleString()}</p>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
      <p className="font-display text-2xl font-extrabold text-white">{value}</p>
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/38">{label}</p>
    </div>
  );
}

function DossierStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/18 p-3 text-center ring-1 ring-white/10">
      <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[#28f7a8]">{icon}</div>
      <p className="mt-2 font-display text-xl font-extrabold text-white">{value}</p>
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/38">{label}</p>
    </div>
  );
}
