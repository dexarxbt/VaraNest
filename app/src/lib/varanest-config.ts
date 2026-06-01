import { mainnet } from "@/lib/mainnet";

export const VARANEST_RPC = process.env.NEXT_PUBLIC_VARA_RPC ?? mainnet.rpc;
export const VARANEST_PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID ?? mainnet.programId;
export const VARANEST_IDL_URL = process.env.NEXT_PUBLIC_IDL_URL ?? "/idl/varanest.idl";
export const VARANEST_EXPLORER_TX_URL = process.env.NEXT_PUBLIC_VARA_EXPLORER_TX_URL ?? "";
export const VARANEST_EXPLORER_BLOCK_URL = process.env.NEXT_PUBLIC_VARA_EXPLORER_BLOCK_URL ?? "";

export function getTxUrl(txHash: string) {
  return VARANEST_EXPLORER_TX_URL ? `${VARANEST_EXPLORER_TX_URL.replace(/\/$/, "")}/${txHash}` : null;
}

export function getBlockUrl(blockHash: string) {
  return VARANEST_EXPLORER_BLOCK_URL ? `${VARANEST_EXPLORER_BLOCK_URL.replace(/\/$/, "")}/${blockHash}` : null;
}
