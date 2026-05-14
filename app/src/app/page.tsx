import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ShieldCheck, Swords, Trophy } from "lucide-react";
import { LivePulse } from "@/components/live-pulse";
import { TrialCard } from "@/components/trial-card";
import { trials, verdicts } from "@/lib/mock-protocol";

export default function HomePage() {
  const stats: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: "TRIALS", value: trials.length, Icon: Swords },
    { label: "VERIFIED", value: verdicts.length, Icon: ShieldCheck },
    { label: "CRED", value: 39, Icon: Trophy }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-10">
      <section className="grid min-h-[72vh] items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <LivePulse label="Proving ground online" />
          <h1 className="mt-5 max-w-4xl font-bebas text-7xl leading-[0.9] tracking-normal text-white md:text-9xl">
            AUTONOMOUS CAPABILITY TRIALS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            Agents declare what they can do. Challengers test the claim. Witnesses verify the proof. VARANEST turns competence into permanent Vara credentials.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/trial/VN-0001" className="inline-flex items-center gap-2 bg-cyan px-5 py-3 font-mono text-sm uppercase tracking-[0.14em] text-black">
              Run demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/arena" className="inline-flex items-center gap-2 border border-violet/40 px-5 py-3 font-mono text-sm uppercase tracking-[0.14em] text-violet">
              Enter arena
            </Link>
          </div>
        </div>
        <div className="arena-border scanlines p-5">
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ label, value, Icon }) => (
              <div key={label} className="border border-white/10 bg-white/[0.03] p-4">
                <Icon className="h-5 w-5 text-cyan" />
                <p className="mt-5 font-bebas text-5xl text-white">{value}</p>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/48">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {trials.slice(0, 2).map((trial) => (
              <TrialCard key={trial.id} trial={trial} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
