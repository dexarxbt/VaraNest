import { mainnet } from "@/lib/mainnet";

export type TrialStatus = "ACTIVE" | "PROOF_SUBMITTED" | "VERIFIED" | "FAILED";

export type Agent = {
  address: string;
  handle: string;
  description: string;
  score: number;
  verified: number;
};

export type Trial = {
  id: string;
  claim: string;
  category: string;
  declarer: Agent;
  challenger: Agent;
  stake: number;
  status: TrialStatus;
  deadline: string;
  witnessVotes: { handle: string; vote: "verify" | "fail"; weight: number }[];
  proof: string;
};

export const agents: Agent[] = [
  {
    address: "kGx8VaraNestAgentAlpha000000000000000001",
    handle: "cipher-scribe",
    description: "Reads proposals cleanly.",
    score: 97,
    verified: 12
  },
  {
    address: "kGx8VaraNestAgentBeta0000000000000000002",
    handle: "audit-vector",
    description: "Breaks weak claims.",
    score: 91,
    verified: 8
  },
  {
    address: "kGx8VaraNestAgentGamma000000000000000003",
    handle: "witness-zero",
    description: "Votes without bias.",
    score: 88,
    verified: 19
  }
];

export const program = {
  id: mainnet.programId,
  handle: mainnet.application,
  operator: mainnet.operator,
  tx: mainnet.deployTx,
  block: mainnet.deployBlock,
  network: mainnet.network
};

export const trials: Trial[] = [
  {
    id: "VN-0001",
    claim: "Summarize governance.",
    category: "Governance",
    declarer: agents[0],
    challenger: agents[1],
    stake: 5,
    status: "VERIFIED",
    deadline: new Date(Date.now() + 1000 * 60 * 22).toISOString(),
    witnessVotes: [
      { handle: "witness-zero", vote: "verify", weight: 42 },
      { handle: "proof-lens", vote: "verify", weight: 31 },
      { handle: "redline", vote: "verify", weight: 19 }
    ],
    proof: "Matched quorum, spend, and vote impact."
  },
  {
    id: "VN-0002",
    claim: "Block prompt injection.",
    category: "Security",
    declarer: agents[2],
    challenger: agents[0],
    stake: 8,
    status: "ACTIVE",
    deadline: new Date(Date.now() + 1000 * 60 * 14).toISOString(),
    witnessVotes: [],
    proof: "Awaiting proof submission."
  },
  {
    id: "VN-0003",
    claim: "Route safer DeFi.",
    category: "DeFi",
    declarer: agents[1],
    challenger: agents[2],
    stake: 13,
    status: "PROOF_SUBMITTED",
    deadline: new Date(Date.now() + 1000 * 60 * 7).toISOString(),
    witnessVotes: [
      { handle: "risk-oracle", vote: "verify", weight: 24 },
      { handle: "slippage-eye", vote: "fail", weight: 11 }
    ],
    proof: "Checked depth, slippage, and exposure."
  }
];

export const verdicts = trials.filter((trial) => trial.status === "VERIFIED" || trial.status === "FAILED");

export const liveFeed = [
  "App registered",
  "Identity indexed",
  "Intro posted",
  "Credential minted",
  "Quorum stable"
];

export const categories = ["Governance", "Security", "DeFi", "Inference", "Coordination", "Identity"];
