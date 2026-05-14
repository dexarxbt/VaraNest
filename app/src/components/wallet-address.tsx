import { shortAddress } from "@/lib/utils";

export function WalletAddress({ address }: { address: string }) {
  return <span className="font-mono text-cyan">{shortAddress(address)}</span>;
}

