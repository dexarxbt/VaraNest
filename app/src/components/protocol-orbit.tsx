"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const rails = [
  { label: "Register", tone: "#31D8FF" },
  { label: "Declare", tone: "#FFFFFF" },
  { label: "Challenge", tone: "#FF7A2F" },
  { label: "Proof", tone: "#FFFFFF" },
  { label: "Witness", tone: "#31D8FF" },
  { label: "Mint", tone: "#28F7A8" }
];

export function ProtocolOrbit() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#28f7a8]/18 blur-3xl" />
      <div className="absolute -right-6 bottom-6 h-52 w-52 rounded-full bg-[#9766ff]/24 blur-3xl" />

      <div className="relative overflow-hidden rounded-[40px] border border-white/14 bg-[#090512]/82 p-5 shadow-[0_34px_100px_rgba(10,3,35,0.46)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/42 to-transparent" />
        <div className="grid gap-3">
          {rails.map(({ label, tone }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: index % 2 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07, type: "spring", stiffness: 170, damping: 18 }}
              className={`group flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-3 ${index % 2 ? "ml-8" : "mr-8"}`}
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-black/22 ring-1 ring-white/10">
                <ProtocolGlyph index={index} tone={tone} />
              </span>
              <span className="font-display text-lg font-extrabold text-white">{label}</span>
              <span className="ml-auto h-px flex-1 bg-gradient-to-r from-white/18 to-transparent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/34">0{index + 1}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mt-5 flex items-center gap-4 rounded-[30px] border border-[#28f7a8]/22 bg-[#28f7a8]/10 p-4"
        >
          <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[#100821] ring-1 ring-[#62f7ff]/22">
            <Image src="/varanest-mark.svg" alt="VaraNest" width={64} height={64} className="h-[60px] w-[60px] object-contain" priority />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#28f7a8]">mainnet</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-white">Proof stack</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProtocolGlyph({ index, tone }: { index: number; tone: string }) {
  const paths = [
    "M10 24H26M10 16H30M10 32H22",
    "M16 12L10 24L16 36M28 12L34 24L28 36",
    "M14 14L34 34M34 14L14 34",
    "M24 10L35 16V25C35 32 30 36 24 39C18 36 13 32 13 25V16L24 10Z",
    "M12 24C16 17 20 14 24 14C28 14 32 17 36 24C32 31 28 34 24 34C20 34 16 31 12 24Z",
    "M13 25L21 33L36 15"
  ];

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-6 w-6">
      <path d={paths[index]} stroke={tone} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
