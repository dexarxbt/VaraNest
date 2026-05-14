export function AgentAvatar({ handle }: { handle: string }) {
  const initials = handle
    .split("-")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="grid h-11 w-11 place-items-center border border-cyan/30 bg-cyan/10 font-syne text-sm text-cyan shadow-cyan">
      {initials}
    </span>
  );
}

