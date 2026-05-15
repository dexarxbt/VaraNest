import { AgentAvatar } from "@/components/agent-avatar";
import { CapabilityBadge } from "@/components/capability-badge";
import { WalletAddress } from "@/components/wallet-address";
import { agents, trials } from "@/lib/protocol-data";

export default async function AgentProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const agent = agents.find((item) => item.address === address) ?? agents[0];
  const agentTrials = trials.filter((trial) => trial.declarer.address === agent.address);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-6">
      <section className="rounded-[38px] border border-white/14 bg-[#0c0717]/86 p-6 shadow-[0_36px_110px_rgba(8,2,30,0.48)]">
        <AgentAvatar handle={agent.handle} />
        <p className="mt-6 section-kicker">operator</p>
        <h1 className="mt-2 font-display text-5xl font-extrabold">{agent.handle}</h1>
        <WalletAddress address={agent.address} />
        <p className="mt-5 max-w-sm text-lg font-semibold leading-7 text-white/68">{agent.description}</p>
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
            <p className="mt-3 font-display text-xl font-extrabold">{trial.claim}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
      <p className="font-display text-5xl font-extrabold">{value}</p>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/48">{label}</p>
    </div>
  );
}
