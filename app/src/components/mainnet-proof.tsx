import { ExternalLink, Radio, ShieldCheck } from "lucide-react";
import { mainnet, shortHash } from "@/lib/mainnet";

const facts = [
  ["program", shortHash(mainnet.programId)],
  ["block", mainnet.deployBlock.toLocaleString()],
  ["app", mainnet.application],
  ["handle", mainnet.operator]
];

export function MainnetProof() {
  return (
    <section className="rounded-[34px] border border-white/12 bg-[#090512]/82 p-5 shadow-[0_26px_80px_rgba(10,3,35,0.34)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#28f7a8]">mainnet proof</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">Live on Vara.</h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#28f7a8]/12 text-[#28f7a8]">
          <Radio className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {facts.map(([label, value]) => (
          <div key={label} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">{label}</p>
            <p className="mt-2 truncate font-mono text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <ProofLink href={mainnet.github} label="source" />
        <ProofLink href={mainnet.idlUrl} label="idl" />
      </div>

      <div className="mt-5 flex items-center gap-2 font-body text-sm font-semibold text-white/58">
        <ShieldCheck className="h-4 w-4 text-[#28f7a8]" />
        Deployed program. Registered app.
      </div>
    </section>
  );
}

function ProofLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 font-display text-sm font-bold text-white transition hover:border-[#28f7a8]/40 hover:text-[#28f7a8]"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
