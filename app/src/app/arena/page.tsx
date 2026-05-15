"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Clock3, Filter, Flame, Radio, Search, Swords, Vote } from "lucide-react";
import { CountdownTimer } from "@/components/countdown-timer";
import { TrialStatusBadge } from "@/components/trial-status-badge";
import { VARAAmount } from "@/components/vara-amount";
import { WalletAddress } from "@/components/wallet-address";
import { trials } from "@/lib/protocol-data";

const filters = ["All", "Challenged", "Proof", "Verified"];
const categories = ["Governance", "Security", "DeFi", "Identity"];

export default function ArenaPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const featured = trials[0];
  const filteredTrials = useMemo(() => {
    return trials.filter((trial) => {
      const matchesQuery = `${trial.claim} ${trial.declarer.handle} ${trial.category}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Challenged" && trial.status === "ACTIVE") ||
        (activeFilter === "Proof" && trial.status === "PROOF_SUBMITTED") ||
        (activeFilter === "Verified" && trial.status === "VERIFIED");
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[40px] border border-white/14 bg-[#110821]/82 p-6 shadow-[0_36px_110px_rgba(11,3,33,0.46)] md:p-8">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#28f7a8]/18 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-1/2 w-2/3 bg-[linear-gradient(120deg,transparent,rgba(151,102,255,0.22))]" />
          <p className="section-kicker">arena</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-extrabold leading-[0.96] text-white md:text-7xl">
            Pressure test.
          </h1>
          <p className="mt-6 max-w-md font-body text-lg font-semibold leading-8 text-white/70">
            Claims enter loud. Proof leaves clean.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <SignalTile label="open trials" value={trials.filter((trial) => trial.status !== "VERIFIED").length} tone="cyan" />
            <SignalTile label="verified" value={trials.filter((trial) => trial.status === "VERIFIED").length} tone="green" />
            <SignalTile label="witness votes" value={trials.reduce((sum, trial) => sum + trial.witnessVotes.length, 0)} tone="ember" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[40px] border border-white/16 bg-white/[0.11] p-5 backdrop-blur-xl md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#28f7a8]">hot case</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-white">{featured.id}</h2>
            </div>
            <TrialStatusBadge status={featured.status} />
          </div>
          <div className="mt-7 rounded-[30px] bg-black/24 p-5 ring-1 ring-white/10">
            <p className="font-display text-3xl font-extrabold leading-tight text-white">{featured.claim}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <CasePill icon={<Swords className="h-4 w-4" />} label="challenger" value={featured.challenger.handle} />
              <CasePill icon={<Clock3 className="h-4 w-4" />} label="deadline" value={<CountdownTimer deadline={featured.deadline} />} />
              <CasePill icon={<Flame className="h-4 w-4" />} label="stake" value={<VARAAmount amount={featured.stake} />} />
              <CasePill icon={<Vote className="h-4 w-4" />} label="witnesses" value={`${featured.witnessVotes.length} votes`} />
            </div>
          </div>
          <Link href={`/trial/${featured.id}`} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-display text-sm font-extrabold text-[#24105f] transition hover:scale-[1.01]">
            Open trial <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[250px_1fr_290px]">
        <aside className="h-fit rounded-[32px] border border-white/12 bg-black/18 p-4 backdrop-blur-xl">
          <label className="flex h-12 items-center gap-3 rounded-2xl bg-white/10 px-4">
            <Search className="h-4 w-4 text-white/54" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent font-mono text-[11px] uppercase tracking-[0.18em] text-white outline-none placeholder:text-white/52"
            />
          </label>
          <div className="mt-5 space-y-2">
            {filters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`flex h-11 w-full items-center justify-between rounded-2xl px-4 font-body text-sm font-extrabold transition ${activeFilter === filter ? "bg-[#28f7a8] text-[#1d0d48]" : "text-white/66 hover:bg-white/10 hover:text-white"}`}
              >
                {filter}
                <Filter className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/38">Tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-body text-xs font-bold text-white/68">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          {filteredTrials.map((trial, index) => (
            <Link key={trial.id} href={`/trial/${trial.id}`} className="group grid gap-4 overflow-hidden rounded-[34px] border border-white/12 bg-white/[0.09] p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#28f7a8]/42 hover:bg-white/[0.13] md:grid-cols-[88px_1fr_auto] md:items-center">
              <div className="grid h-20 w-20 place-items-center rounded-[26px] bg-black/26 ring-1 ring-white/10">
                <span className="font-display text-2xl font-extrabold text-[#28f7a8]">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-display text-xl font-extrabold text-white">{trial.declarer.handle}</p>
                  <WalletAddress address={trial.declarer.address} />
                </div>
                <p className="mt-3 max-w-2xl font-body text-lg font-bold leading-7 text-white/86">{trial.claim}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">{trial.category}</span>
                  <VARAAmount amount={trial.stake} />
                  <CountdownTimer deadline={trial.deadline} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 md:block md:text-right">
                <TrialStatusBadge status={trial.status} />
                <p className="mt-0 font-mono text-[11px] uppercase tracking-[0.18em] text-white/42 md:mt-4">{trial.witnessVotes.length} votes</p>
              </div>
            </Link>
          ))}
          {filteredTrials.length === 0 ? (
            <div className="rounded-[34px] border border-white/12 bg-white/[0.08] p-8 text-center backdrop-blur-xl">
              <p className="font-display text-2xl font-bold text-white">No match.</p>
              <p className="mt-2 text-sm font-semibold text-white/52">Try another signal.</p>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-[32px] border border-white/12 bg-[#0b0715]/70 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ff6b2c]/16 text-[#ff6b2c]">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-extrabold text-white">Pulse</p>
              <p className="font-body text-sm font-semibold text-white/48">live reads</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {["Pressure up", "Proof window", "Mint ready"].map((item, index) => (
              <div key={item} className="flex gap-3">
                <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 font-mono text-[10px] text-[#28f7a8]">{index + 1}</span>
                <div>
                  <p className="font-body text-sm font-extrabold text-white">{item}</p>
                  <p className="mt-1 text-xs leading-5 text-white/48">Indexed from mainnet.</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function SignalTile({ label, value, tone }: { label: string; value: number; tone: "cyan" | "green" | "ember" }) {
  const color = tone === "green" ? "text-[#28f7a8]" : tone === "ember" ? "text-[#ff7a2f]" : "text-[#31d8ff]";
  return (
    <div className="rounded-[26px] border border-white/12 bg-white/[0.08] p-4">
      <p className={`font-display text-4xl font-extrabold ${color}`}>{value}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/48">{label}</p>
    </div>
  );
}

function CasePill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3">
      <div className="flex items-center gap-2 text-[#28f7a8]">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">{label}</span>
      </div>
      <div className="mt-2 font-body text-sm font-extrabold text-white">{value}</div>
    </div>
  );
}
