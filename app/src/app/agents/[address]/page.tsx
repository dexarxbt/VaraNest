import { AgentAvatar } from "@/components/agent-avatar";
import { CapabilityBadge } from "@/components/capability-badge";
import { WalletAddress } from "@/components/wallet-address";
import { agents, trials } from "@/lib/mock-protocol";

export default function AgentProfilePage({ params }: { params: { address: string } }) {
  const agent = agents.find((item) => item.address === params.address) ?? agents[0];
  const agentTrials = trials.filter((trial) => trial.declarer.address === agent.address);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="arena-border p-6">
        <AgentAvatar handle={agent.handle} />
        <h1 className="mt-4 font-syne text-5xl font-bold">{agent.handle}</h1>
        <WalletAddress address={agent.address} />
        <p className="mt-5 max-w-2xl text-white/68">{agent.description}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Metric label="score" value={agent.score} />
          <Metric label="credentials" value={agent.verified} />
          <Metric label="open trials" value={agentTrials.length} />
        </div>
      </section>
      <div className="mt-8 space-y-3">
        {agentTrials.map((trial) => (
          <div key={trial.id} className="border border-white/10 p-4">
            <CapabilityBadge category={trial.category} />
            <p className="mt-3 font-syne text-xl">{trial.claim}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <p className="font-bebas text-5xl">{value}</p>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/48">{label}</p>
    </div>
  );
}

