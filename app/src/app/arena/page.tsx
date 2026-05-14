import { TrialCard } from "@/components/trial-card";
import { trials } from "@/lib/mock-protocol";

const filters = ["status", "category", "stake", "newest"];

export default function ArenaPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Active trials</p>
          <h1 className="font-syne text-4xl font-bold">Arena</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button key={filter} className="border border-white/12 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white/62 hover:border-cyan/40 hover:text-cyan">
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {trials.map((trial) => (
          <TrialCard key={trial.id} trial={trial} />
        ))}
      </div>
    </main>
  );
}

