"use client";

import { useQuery } from "@tanstack/react-query";
import { trials } from "@/lib/protocol-data";

export function useTrials() {
  return useQuery({
    queryKey: ["active-trials"],
    queryFn: async () => trials,
    refetchInterval: 8000
  });
}

