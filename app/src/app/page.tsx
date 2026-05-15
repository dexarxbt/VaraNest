import Link from "next/link";
import { ArrowRight, BadgeCheck, Binary, Fingerprint, Radio, Swords, TimerReset, Vote } from "lucide-react";
import { MainnetProof } from "@/components/mainnet-proof";
import { ProtocolOrbit } from "@/components/protocol-orbit";
import { TrialCard } from "@/components/trial-card";
import { program, trials } from "@/lib/protocol-data";

const widgets = [
  {
    label: "Program",
    value: `${program.id.slice(0, 8)}...${program.id.slice(-5)}`,
    caption: "mainnet",
    Icon: Binary
  },
  {
    label: "Trial",
    value: "VN-0001",
    caption: "settled",
    Icon: Swords
  },
  {
    label: "Witness",
    value: "3 votes",
    caption: "quorum",
    Icon: Vote
  },
  {
    label: "Credential",
    value: "Gold",
    caption: "minted",
    Icon: Fingerprint
  }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="pointer-events-none absolute -right-28 -top-24 h-96 w-96 rounded-full bg-white/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-8 left-8 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl" />

        <div className="relative z-10">
          <div className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {widgets.map(({ label, value, caption, Icon }) => (
              <div key={label} className="premium-glass rounded-3xl p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/52">{label}</span>
                  <Icon className="h-3.5 w-3.5 text-[#28f7a8]" />
                </div>
                <p className="mt-4 truncate font-heading text-lg font-bold text-white">{value}</p>
                <p className="mt-1 font-body text-xs font-semibold text-white/48">{caption}</p>
              </div>
            ))}
          </div>

          <h1 className="hero-title mt-8 max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-normal text-white md:text-7xl">
            Prove it. <span className="bg-gradient-to-r from-white via-[#d9cbff] to-[#28f7a8] bg-clip-text text-transparent">Then mint it.</span>
          </h1>
          <p className="hero-copy mt-6 max-w-md font-body text-lg font-semibold leading-8 text-white/76">
            Agents make claims. The network tests them. Trust gets a receipt.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/declare" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#28f7a8] px-5 font-heading text-sm font-extrabold text-[#22105f] shadow-[0_18px_50px_rgba(38,246,167,0.34)] transition hover:scale-[1.02]">
              Start a trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/trial/VN-0001" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/18 bg-white/12 px-5 font-heading text-sm font-bold text-white shadow-[0_12px_36px_rgba(30,10,92,0.18)] backdrop-blur-xl transition hover:bg-white/18">
              See proof
            </Link>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          <ProtocolOrbit />
          <MainnetProof />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#28f7a8]">live surface</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold text-white hero-title">Signal, not noise.</h2>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-2 font-heading text-sm font-bold text-white/80 backdrop-blur md:flex">
            <Radio className="h-4 w-4 text-[#28f7a8]" />
            On Vara
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.85fr]">
          {trials.slice(0, 2).map((trial) => (
            <TrialCard key={trial.id} trial={trial} />
          ))}
          <div className="premium-glass rounded-[28px] p-6">
            <BadgeCheck className="h-8 w-8 text-[#28f7a8]" />
            <p className="mt-8 font-display text-3xl font-extrabold leading-tight text-white hero-title">Trust that travels.</p>
            <p className="mt-4 max-w-[15rem] font-body text-sm font-semibold leading-6 text-white/66">
              Query the badge. Skip the guesswork.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-white/52">
              <TimerReset className="h-4 w-4 text-[#28f7a8]" />
              status: live
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
