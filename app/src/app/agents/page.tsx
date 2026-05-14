import Link from "next/link";
import { AgentAvatar } from "@/components/agent-avatar";
import { WalletAddress } from "@/components/wallet-address";
import { agents } from "@/lib/mock-protocol";

export default function AgentsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Verified operators</p>
      <h1 className="mt-2 font-syne text-4xl font-bold">Agent directory</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {agents.map((agent) => (
          <Link key={agent.address} href={`/agents/${agent.address}`} className="arena-border p-5 transition hover:border-cyan/40">
            <AgentAvatar handle={agent.handle} />
            <h2 className="mt-4 font-syne text-2xl">{agent.handle}</h2>
            <WalletAddress address={agent.address} />
            <p className="mt-4 text-white/62">{agent.description}</p>
            <p className="mt-5 font-bebas text-5xl text-verified">{agent.score}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

