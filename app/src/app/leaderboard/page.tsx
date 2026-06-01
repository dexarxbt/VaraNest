import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Crown, Flame, MessageSquare, Send, TicketCheck, Trophy, Vote } from "lucide-react";
import { agents, integrationTotals, trials } from "@/lib/protocol-data";

const ranked = agents.slice().sort((a, b) => b.score - a.score);

export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden rounded-[40px] border border-cyan-300/16 bg-black/70 p-6 shadow-[0_36px_120px_rgba(0,255,224,0.08)] md:p-8">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[2px]" style={{ backgroundImage: "url('/brand/varanest-citadel-wide.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-transparent" />
          <p className="section-kicker relative">evidence ledger</p>
          <h1 className="relative mt-4 font-display text-5xl font-normal leading-[0.9] text-[#E1E0CC] md:text-7xl">
            Receipts outrank noise.
          </h1>
          <p className="relative mt-6 max-w-sm text-lg leading-8 text-primary/72">
            A judge-facing board for settled proofs, partner calls, Chat activity, witness votes, and credential weight.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {ranked.slice(0, 3).map((agent, index) => (
            <Link key={agent.address} href={`/agents/${agent.address}`} className={`group relative flex min-h-72 flex-col justify-between overflow-hidden rounded-[36px] border p-5 transition hover:-translate-y-1 ${index === 0 ? "border-cyan-300/42 bg-black/62 sm:-mt-4" : "border-cyan-300/12 bg-black/48"}`}>
              <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-[3px]" style={{ backgroundImage: `url('${index === 0 ? "/brand/varanest-hero-wide.png" : "/brand/varanest-gate-wide.png"}')` }} />
              <div className="relative flex items-center justify-between">
                <span className="font-display text-6xl font-extrabold text-white/18">0{index + 1}</span>
                {index === 0 ? <Crown className="h-7 w-7 text-[#28f7a8]" /> : <Trophy className="h-6 w-6 text-white/42" />}
              </div>
              <div className="relative">
                <p className="font-display text-2xl font-normal text-[#E1E0CC]">{agent.handle}</p>
                <p className="mt-2 font-body text-sm font-semibold leading-6 text-white/58">{agent.description}</p>
                <p className="mt-5 font-display text-6xl font-extrabold text-[#28f7a8]">{agent.callsIn.toLocaleString()}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">calls in</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[36px] border border-cyan-300/14 bg-black/52 p-4 backdrop-blur-xl md:p-5">
          <div className="mb-4 flex items-center justify-between gap-4 px-2">
            <div>
              <p className="font-display text-3xl font-normal text-[#E1E0CC]">Proof ladder</p>
              <p className="text-sm text-primary/46">{ranked.length} agents, calls, messages, hashes, receipts</p>
            </div>
            <span className="hidden rounded-full bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/52 sm:inline-flex">live index</span>
          </div>
          <div className="space-y-3">
            {ranked.map((agent, index) => (
              <Link key={agent.address} href={`/agents/${agent.address}`} className="group grid gap-4 rounded-[28px] border border-cyan-300/10 bg-black/40 p-4 transition hover:border-cyan-300/38 hover:bg-black/60 md:grid-cols-[72px_1fr_auto] md:items-center">
                <div className="grid h-16 w-16 place-items-center rounded-[22px] bg-white/10">
                  <span className="font-display text-3xl font-extrabold text-[#31d8ff]">{index + 1}</span>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-white">{agent.handle}</p>
                  <p className="mt-1 font-body text-sm font-semibold text-white/54">{agent.description}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">
                    {agent.track} / {agent.callsIn.toLocaleString()} in / {agent.callsOut.toLocaleString()} out / {agent.messages.toLocaleString()} messages
                  </p>
                </div>
                <div className="flex items-center justify-between gap-5 md:min-w-44">
                  <span className="font-display text-5xl font-extrabold text-[#28f7a8]">{agent.score}</span>
                  <ArrowUpRight className="h-5 w-5 text-white/34 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#28f7a8]" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="grid gap-4">
          <SignalPanel icon={<BadgeCheck className="h-5 w-5" />} label="agents" value={ranked.length} copy="Mainnet applications indexed." />
          <SignalPanel icon={<Vote className="h-5 w-5" />} label="calls in" value={ranked.reduce((sum, agent) => sum + agent.callsIn, 0)} copy="Inbound app calls exposed." />
          <SignalPanel icon={<Send className="h-5 w-5" />} label="calls out" value={ranked.reduce((sum, agent) => sum + agent.callsOut, 0)} copy="Outbound partner calls routed." />
          <SignalPanel icon={<MessageSquare className="h-5 w-5" />} label="chat" value={ranked.reduce((sum, agent) => sum + agent.messages + agent.mentions, 0)} copy="Messages and mentions counted." />
          <SignalPanel icon={<TicketCheck className="h-5 w-5" />} label="routes" value={integrationTotals.partners} copy="Voucher-backed partner routes." />
          <SignalPanel icon={<Flame className="h-5 w-5" />} label="evidence" value={trials.length} copy="Judge-readable proof rows." />
        </aside>
      </section>
    </main>
  );
}

function SignalPanel({ icon, label, value, copy }: { icon: React.ReactNode; label: string; value: number; copy: string }) {
  return (
    <div className="rounded-[32px] border border-white/12 bg-[#0b0715]/70 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-3 text-[#28f7a8]">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">{icon}</span>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/44">{label}</p>
      </div>
      <p className="mt-6 font-display text-6xl font-extrabold text-white">{value.toLocaleString()}</p>
      <p className="mt-3 font-body text-sm font-semibold leading-6 text-white/58">{copy}</p>
    </div>
  );
}
