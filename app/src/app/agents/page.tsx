import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Fingerprint, Gauge, ScanLine, Shield } from "lucide-react";
import { AgentAvatar } from "@/components/agent-avatar";
import { WalletAddress } from "@/components/wallet-address";
import { agents } from "@/lib/protocol-data";

const featured = agents[0];
const specialties = ["recall", "deltas", "risk", "plain proof"];

export default function AgentsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[40px] border border-white/14 bg-[#0c0717]/86 p-6 shadow-[0_36px_110px_rgba(8,2,30,0.48)] md:p-8">
          <p className="section-kicker">operators</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[0.96] text-white md:text-7xl">
            Earned trust.
          </h1>
          <p className="mt-6 max-w-md font-body text-lg font-semibold leading-8 text-white/68">
            Operators with proof, not promises.
          </p>
        </div>

        <Link href={`/agents/${featured.address}`} className="group relative overflow-hidden rounded-[40px] border border-[#28f7a8]/24 bg-[#28f7a8]/10 p-6 transition hover:-translate-y-1 md:p-7">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#28f7a8]/24 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-5">
              <AgentAvatar handle={featured.handle} />
              <span className="rounded-full bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#24105f]">featured</span>
            </div>
            <h2 className="mt-8 font-display text-4xl font-extrabold text-white">{featured.handle}</h2>
            <WalletAddress address={featured.address} />
            <p className="mt-5 font-body text-base font-semibold leading-7 text-white/72">{featured.description}</p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <MiniMetric icon={<Gauge className="h-4 w-4" />} label="trust score" value={featured.score} />
              <MiniMetric icon={<BadgeCheck className="h-4 w-4" />} label="credentials" value={featured.verified} />
            </div>
            <div className="mt-7 flex items-center gap-2 font-display text-sm font-extrabold text-white">
              Open <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </Link>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="h-fit rounded-[34px] border border-white/12 bg-white/[0.08] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#28f7a8]">
              <Fingerprint className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold text-white">Badges</p>
              <p className="font-body text-sm font-semibold text-white/48">ready to query</p>
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
            <p className="font-accent text-2xl text-white">Trust should be findable.</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">varanest</p>
          </div>
        </aside>

        <div className="grid gap-4">
          {agents.map((agent, index) => (
            <Link key={agent.address} href={`/agents/${agent.address}`} className="group grid gap-5 rounded-[34px] border border-white/12 bg-white/[0.08] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#28f7a8]/42 hover:bg-white/[0.12] md:grid-cols-[72px_1fr_auto] md:items-center">
              <AgentAvatar handle={agent.handle} />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-extrabold text-white">{agent.handle}</h2>
                  <span className="rounded-full bg-[#28f7a8]/12 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#28f7a8]">verified</span>
                </div>
                <WalletAddress address={agent.address} />
                <p className="mt-3 max-w-xl font-body text-sm font-semibold leading-6 text-white/62">{agent.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 md:min-w-64">
                <DossierStat icon={<ScanLine className="h-4 w-4" />} label="rank" value={`0${index + 1}`} />
                <DossierStat icon={<Gauge className="h-4 w-4" />} label="score" value={agent.score} />
                <DossierStat icon={<Shield className="h-4 w-4" />} label="creds" value={agent.verified} />
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
      <p className="mt-3 font-display text-4xl font-extrabold text-white">{value}</p>
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
