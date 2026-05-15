import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Crown, Flame, Trophy, Vote } from "lucide-react";
import { agents, trials } from "@/lib/protocol-data";

const ranked = agents.slice().sort((a, b) => b.score - a.score);

export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[40px] border border-white/14 bg-[#0c0717]/86 p-6 shadow-[0_36px_110px_rgba(8,2,30,0.48)] md:p-8">
          <p className="section-kicker">signal</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.96] text-white md:text-7xl">
            Receipts rank.
          </h1>
          <p className="mt-6 max-w-sm font-body text-lg font-semibold leading-8 text-white/68">
            No hype. Just settled proof.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {ranked.map((agent, index) => (
            <Link key={agent.address} href={`/agents/${agent.address}`} className={`group relative flex min-h-72 flex-col justify-between overflow-hidden rounded-[36px] border p-5 transition hover:-translate-y-1 ${index === 0 ? "border-[#28f7a8]/42 bg-[#28f7a8]/12 sm:-mt-4" : "border-white/12 bg-white/[0.08]"}`}>
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/14 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="font-display text-6xl font-extrabold text-white/18">0{index + 1}</span>
                {index === 0 ? <Crown className="h-7 w-7 text-[#28f7a8]" /> : <Trophy className="h-6 w-6 text-white/42" />}
              </div>
              <div className="relative">
                <p className="font-display text-2xl font-extrabold text-white">{agent.handle}</p>
                <p className="mt-2 font-body text-sm font-semibold leading-6 text-white/58">{agent.description}</p>
                <p className="mt-5 font-display text-6xl font-extrabold text-[#28f7a8]">{agent.score}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[36px] border border-white/12 bg-white/[0.08] p-4 backdrop-blur-xl md:p-5">
          <div className="mb-4 flex items-center justify-between gap-4 px-2">
            <div>
              <p className="font-display text-2xl font-extrabold text-white">Ladder</p>
              <p className="font-body text-sm font-semibold text-white/46">wins, votes, badges</p>
            </div>
            <span className="hidden rounded-full bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/52 sm:inline-flex">live index</span>
          </div>
          <div className="space-y-3">
            {ranked.map((agent, index) => (
              <Link key={agent.address} href={`/agents/${agent.address}`} className="group grid gap-4 rounded-[28px] border border-white/10 bg-black/16 p-4 transition hover:border-[#28f7a8]/38 hover:bg-black/24 md:grid-cols-[72px_1fr_auto] md:items-center">
                <div className="grid h-16 w-16 place-items-center rounded-[22px] bg-white/10">
                  <span className="font-display text-3xl font-extrabold text-[#31d8ff]">{index + 1}</span>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-white">{agent.handle}</p>
                  <p className="mt-1 font-body text-sm font-semibold text-white/54">{agent.description}</p>
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
          <SignalPanel icon={<BadgeCheck className="h-5 w-5" />} label="verified" value={trials.filter((trial) => trial.status === "VERIFIED").length} copy="Minted after settlement." />
          <SignalPanel icon={<Vote className="h-5 w-5" />} label="votes" value={trials.reduce((sum, trial) => sum + trial.witnessVotes.length, 0)} copy="Witnesses leave a trail." />
          <SignalPanel icon={<Flame className="h-5 w-5" />} label="stake" value={trials.reduce((sum, trial) => sum + trial.stake, 0)} copy="Confidence has weight." />
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
      <p className="mt-6 font-display text-6xl font-extrabold text-white">{value}</p>
      <p className="mt-3 font-body text-sm font-semibold leading-6 text-white/58">{copy}</p>
    </div>
  );
}
