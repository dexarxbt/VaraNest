import { create } from "zustand";

type WalletState = {
  address: string | null;
  network: "mainnet" | "testnet";
  connectMock: () => void;
  disconnect: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  network: "mainnet",
  connectMock: () => set({ address: "kGx8VaraNestDemoWallet0000000000000000" }),
  disconnect: () => set({ address: null })
}));

