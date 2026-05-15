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
  ["/declare", "Claim Lab"],
  ["/agents", "Operators"],
  ["/leaderboard", "Signal"]
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { address, connectInjected, disconnect } = useWalletStore();

  return (
    <div className="min-h-screen">
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="soft-panel flex min-h-16 items-center justify-between rounded-[24px] px-4 md:px-5">
            <Link href="/" className="group flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[#140b2e] ring-1 ring-[#62f7ff]/28 transition group-hover:ring-[#28f7a8]/60">
                <Image src="/varanest-mark.svg" alt="VaraNest" width={44} height={44} className="h-10 w-10 object-contain" priority />
              </span>
              <span>
                <span className="block font-display text-base font-extrabold leading-none text-white">VaraNest</span>
                <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/42 sm:block">proof network</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full bg-black/14 p-1 md:flex">
              {nav.map(([href, label]) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-full px-4 py-2 font-body text-sm font-extrabold transition ${
                      active ? "bg-white text-[#24105f]" : "text-white/68 hover:bg-white/10 hover:text-white"
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
                className="hidden h-11 items-center gap-2 rounded-full bg-[#28f7a8] px-5 font-body text-sm font-extrabold text-[#24105f] shadow-[0_16px_44px_rgba(40,247,168,0.24)] transition hover:scale-[1.02] md:inline-flex"
              >
                <Wallet className="h-4 w-4" />
                {address ? <WalletAddress address={address} /> : "Connect wallet"}
              </button>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/14 bg-white/10 text-white md:hidden"
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {open ? (
            <div className="soft-panel mt-2 grid gap-2 rounded-[22px] p-3 md:hidden">
              {nav.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-body text-sm font-bold text-white/80 hover:bg-white/10">
                  {label}
                </Link>
              ))}
              <button onClick={address ? disconnect : connectInjected} className="rounded-2xl bg-[#28f7a8] px-4 py-3 font-body text-sm font-extrabold text-[#24105f]">
                {address ? "Disconnect wallet" : "Connect wallet"}
              </button>
            </div>
          ) : null}
        </div>
      </header>
      <div className="pt-24">{children}</div>
    </div>
  );
}
