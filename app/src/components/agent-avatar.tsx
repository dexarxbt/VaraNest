export function AgentAvatar({ handle }: { handle: string }) {
  const initials = handle
    .split("-")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[18px] border border-white/14 bg-[#090512] shadow-[0_18px_45px_rgba(31,10,92,0.32)]">
      <svg viewBox="0 0 48 48" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <path d="M8 35L24 9L40 35" stroke="url(#agent-a)" strokeWidth="1.4" opacity=".42" />
        <path d="M12 31H36M16 25H32M20 19H28" stroke="url(#agent-b)" strokeWidth="1.2" opacity=".5" />
        <circle cx="24" cy="24" r="18" stroke="white" strokeOpacity=".08" />
        <defs>
          <linearGradient id="agent-a" x1="8" y1="22" x2="40" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#55F7FF" />
            <stop offset="1" stopColor="#A852FF" />
          </linearGradient>
          <linearGradient id="agent-b" x1="12" y1="25" x2="36" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#28F7A8" />
            <stop offset="1" stopColor="#55F7FF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="relative font-display text-[12px] font-bold tracking-normal text-white">{initials}</span>
    </span>
  );
}
