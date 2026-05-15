"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Radio, ShieldCheck } from "lucide-react";
import { program } from "@/lib/protocol-data";

type ApplicationResponse = {
  data?: {
    applicationById?: {
      handle: string;
      status: string;
      track: string;
      githubUrl: string;
      idlUrl: string;
    } | null;
    allAnnouncements?: {
      nodes: Array<{ postId: string; title: string; kind: string; postedAt: string }>;
    };
  };
};

async function fetchStatus() {
  const query = `
    query($id: String!) {
      applicationById(id: $id) {
        handle
        status
        track
        githubUrl
        idlUrl
      }
      allAnnouncements(
        filter: { applicationId: { equalTo: $id } }
        orderBy: POSTED_AT_DESC
        first: 3
      ) {
        nodes { postId title kind postedAt }
      }
    }
  `;

  const response = await fetch("https://agents-api.vara.network/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables: { id: program.id } })
  });

  if (!response.ok) {
    throw new Error("Unable to load Agent Network status");
  }

  return (await response.json()) as ApplicationResponse;
}

export function MainnetStatus() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["agent-network-status", program.id],
    queryFn: fetchStatus,
    refetchInterval: 20000
  });

  const application = data?.data?.applicationById;
  const announcements = data?.data?.allAnnouncements?.nodes ?? [];

  return (
    <div className="relative overflow-hidden border border-white/10 bg-black/30 p-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-verified to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-verified">Agent Network</p>
          <h2 className="mt-1 font-syne text-xl font-bold">Indexed mainnet identity</h2>
        </div>
        <Radio className="h-6 w-6 text-verified" />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Signal label="handle" value={application?.handle ?? (isLoading ? "syncing" : "varanest")} />
        <Signal label="status" value={application?.status ?? (isError ? "offline" : "Building")} />
        <Signal label="track" value={application?.track ?? "Services"} />
      </div>

      <div className="mt-4 space-y-2">
        {announcements.length > 0 ? (
          announcements.map((item, index) => (
            <motion.div
              key={item.postId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="flex items-center justify-between gap-3 border border-white/10 bg-black/28 px-3 py-2"
            >
              <span className="truncate font-mono text-xs text-white/62">{item.title}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">{item.kind}</span>
            </motion.div>
          ))
        ) : (
          <div className="border border-white/10 bg-black/28 px-3 py-3 font-mono text-xs text-white/46">
            {isLoading ? "Reading public indexer..." : "No indexed announcements returned yet."}
          </div>
        )}
      </div>

      <a
        href="https://github.com/dexarxbt/VaraNest"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-cyan"
      >
        Source registry artifacts <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="data-panel p-3">
      <ShieldCheck className="h-4 w-4 text-verified" />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className="mt-1 truncate font-mono text-sm text-white">{value}</p>
    </div>
  );
}
