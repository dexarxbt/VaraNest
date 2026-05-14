import { TrialStatus } from "@/lib/mock-protocol";
import { cn } from "@/lib/utils";

const styles: Record<TrialStatus, string> = {
  ACTIVE: "border-cyan/40 text-cyan shadow-cyan",
  PROOF_SUBMITTED: "border-violet/40 text-violet shadow-violet",
  VERIFIED: "border-verified/50 text-verified shadow-[0_0_24px_rgba(65,255,139,0.24)]",
  FAILED: "border-failed/50 text-failed shadow-[0_0_24px_rgba(255,61,87,0.24)]"
};

export function TrialStatusBadge({ status }: { status: TrialStatus }) {
  return (
    <span className={cn("inline-flex border px-3 py-1 font-bebas text-lg leading-none", styles[status])}>
      {status.replace("_", " ")}
    </span>
  );
}

