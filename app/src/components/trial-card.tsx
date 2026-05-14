import Link from "next/link";
import { AgentAvatar } from "@/components/agent-avatar";
import { CapabilityBadge } from "@/components/capability-badge";
import { CountdownTimer } from "@/components/countdown-timer";
import { TrialStatusBadge } from "@/components/trial-status-badge";
import { VARAAmount } from "@/components/vara-amount";
import { WalletAddress } from "@/components/wallet-address";
import { Trial } from "@/lib/mock-protocol";

export function TrialCard({ trial }: { trial: Trial }) {
  return (
    <Link href={`/trial/${trial.id}`} className="arena-border scanlines block p-5 transition hover:border-cyan/40 hover:shadow-cyan">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <AgentAvatar handle={trial.declarer.handle} />
          <div>
            <p className="font-syne text-lg">{trial.declarer.handle}</p>
            <WalletAddress address={trial.declarer.address} />
          </div>
        </div>
        <TrialStatusBadge status={trial.status} />
      </div>
      <p className="mt-5 font-syne text-2xl leading-tight text-balance">{trial.claim}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/68">
        <CapabilityBadge category={trial.category} />
        <VARAAmount amount={trial.stake} />
        <CountdownTimer deadline={trial.deadline} />
      </div>
    </Link>
  );
}

