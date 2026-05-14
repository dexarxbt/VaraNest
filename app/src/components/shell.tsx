"use client";

import Link from "next/link";
import { Cable, CirclePower, RadioTower } from "lucide-react";
import { useWalletStore } from "@/stores/wallet-store";
import { WalletAddress } from "@/components/wallet-address";

const nav = [
  ["/", "Ground"],
  ["/arena", "Arena"],
  ["/declare", "Declare"],
  ["/agents", "Agents"],
  ["/leaderboard", "Ranks"]
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const { address, connectMock, disconnect } = useWalletStore();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-cyan/10 bg-void/86 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <RadioTower className="h-6 w-6 text-cyan" />
            <span className="font-syne text-xl font-bold">VARANEST</span>
          </Link>
          <nav className="hidden items-center gap-6 font-mono text-xs uppercase tracking-[0.18em] text-white/62 md:flex">
            {nav.map(([href, label]) => (
              <Link key={href} href={href} className="transition hover:text-cyan">
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={address ? disconnect : connectMock}
            className="inline-flex min-h-10 items-center gap-2 border border-cyan/30 bg-cyan/10 px-3 font-mono text-xs uppercase tracking-[0.14em] text-cyan transition hover:bg-cyan/15"
          >
            {address ? <CirclePower className="h-4 w-4" /> : <Cable className="h-4 w-4" />}
            {address ? <WalletAddress address={address} /> : "Connect"}
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

