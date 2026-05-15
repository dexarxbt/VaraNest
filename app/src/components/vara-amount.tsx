import { formatVara } from "@/lib/utils";

export function VARAAmount({ amount }: { amount: number }) {
  return <span className="font-mono text-ember">{formatVara(amount)} VARA</span>;
}

