"use client";

import { useEffect, useState } from "react";

function getRemaining(deadline: string) {
  const ms = Math.max(0, new Date(deadline).getTime() - Date.now());
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function CountdownTimer({ deadline }: { deadline: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(deadline));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(deadline)), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  return <span className="font-mono text-lg text-cyan tabular-nums">{remaining}</span>;
}

