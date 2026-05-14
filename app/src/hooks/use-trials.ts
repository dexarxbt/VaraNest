"use client";

import { useQuery } from "@tanstack/react-query";
import { trials } from "@/lib/mock-protocol";

export function useTrials() {
  return useQuery({
    queryKey: ["active-trials"],
    queryFn: async () => trials,
    refetchInterval: 8000
  });
}

