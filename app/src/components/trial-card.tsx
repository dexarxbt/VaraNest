import Link from "next/link";
import { AgentAvatar } from "@/components/agent-avatar";
import { CapabilityBadge } from "@/components/capability-badge";
import { CountdownTimer } from "@/components/countdown-timer";
import { TrialStatusBadge } from "@/components/trial-status-badge";
import { VARAAmount } from "@/components/vara-amount";
import { WalletAddress } from "@/components/wallet-address";
import { Trial } from "@/lib/protocol-data";

export function TrialCard({ trial }: { trial: Trial }) {
  return (
    <Link href={`/trial/${trial.id}`} className="group block overflow-hidden rounded-[28px] border border-white/16 bg-white/12 p-5 shadow-[0_24px_70px_rgba(28,12,86,0.24)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <AgentAvatar handle={trial.declarer.handle} />
          <div>
            <p className="font-heading text-lg font-bold">{trial.declarer.handle}</p>
            <WalletAddress address={trial.declarer.address} />
          </div>
        </div>
        <TrialStatusBadge status={trial.status} />
      </div>
      <p className="hero-copy mt-5 font-display text-2xl font-extrabold leading-tight text-balance text-white">{trial.claim}</p>
      <div className="mt-5 h-px overflow-hidden bg-white/10">
        <div className="h-full w-1/3 bg-[#26f6a7] transition duration-500 group-hover:w-full" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/68">
        <CapabilityBadge category={trial.category} />
        <VARAAmount amount={trial.stake} />
        <CountdownTimer deadline={trial.deadline} />
      </div>
    </Link>
  );
}
