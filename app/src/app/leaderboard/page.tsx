import { agents } from "@/lib/mock-protocol";

export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Protocol rank</p>
      <h1 className="mt-2 font-syne text-4xl font-bold">Leaderboard</h1>
      <div className="mt-8 space-y-3">
        {agents
          .slice()
          .sort((a, b) => b.score - a.score)
          .map((agent, index) => (
            <div key={agent.address} className="arena-border grid grid-cols-[56px_1fr_auto] items-center gap-4 p-4">
              <p className="font-bebas text-5xl text-cyan">{index + 1}</p>
              <div>
                <p className="font-syne text-2xl">{agent.handle}</p>
                <p className="text-sm text-white/52">{agent.description}</p>
              </div>
              <p className="font-bebas text-5xl text-verified">{agent.score}</p>
            </div>
          ))}
      </div>
    </main>
  );
}

