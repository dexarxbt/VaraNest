"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Wallet, X } from "lucide-react";
import { useState } from "react";
import { useWalletStore } from "@/stores/wallet-store";
import { WalletAddress } from "@/components/wallet-address";

const nav = [
  ["/arena", "Trials"],
  ["/declare", "Launch"],
  ["/agents", "Agents"],
  ["/leaderboard", "Ledger"]
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { address, connectInjected, disconnect } = useWalletStore();

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-primary">
      <div className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-32 blur-[3px]" style={{ backgroundImage: "url('/brand/varanest-citadel-wide.png')" }} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_8%,rgba(0,255,224,0.16),transparent_28%),linear-gradient(to_bottom,rgba(0,0,0,0.78),#000_72%)]" />
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-25 mix-blend-overlay" />
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-16 items-center justify-between rounded-[24px] border border-cyan-300/14 bg-black/58 px-4 shadow-[0_22px_90px_rgba(0,255,224,0.08)] backdrop-blur-2xl md:px-5">
            <Link href="/" className="group flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-black ring-1 ring-cyan-300/28 transition group-hover:ring-primary/60">
                <Image src="/varanest-mark.svg" alt="VaraNest" width={44} height={44} className="h-10 w-10 object-contain" priority />
              </span>
              <span>
                <span className="block font-display text-2xl leading-none text-[#E1E0CC]">VaraNest</span>
                <span className="mt-1 hidden text-[10px] uppercase tracking-[0.22em] text-primary/42 sm:block">agent proof citadel</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/8 md:flex">
              {nav.map(([href, label]) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active ? "bg-primary text-black" : "text-primary/68 hover:bg-white/10 hover:text-[#E1E0CC]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={address ? disconnect : connectInjected}
                className="hidden h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-black shadow-[0_16px_44px_rgba(0,255,224,0.16)] transition hover:scale-[1.02] md:inline-flex"
              >
                <Wallet className="h-4 w-4" />
                {address ? <WalletAddress address={address} /> : "Connect wallet"}
              </button>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/14 bg-white/10 text-primary md:hidden"
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {open ? (
            <div className="mt-2 grid gap-2 rounded-[22px] border border-white/12 bg-black/72 p-3 backdrop-blur-2xl md:hidden">
              {nav.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-primary/80 hover:bg-white/10">
                  {label}
                </Link>
              ))}
              <button onClick={address ? disconnect : connectInjected} className="rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-black">
                {address ? "Disconnect wallet" : "Connect wallet"}
              </button>
            </div>
          ) : null}
        </div>
      </header>
      <div className="relative z-10 pt-24">{children}</div>
    </div>
  );
}
