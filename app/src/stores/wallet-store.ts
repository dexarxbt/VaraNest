import { create } from "zustand";
import { toast } from "sonner";

type WalletState = {
  address: string | null;
  source: string | null;
  network: "mainnet" | "testnet";
  mode: "disconnected" | "injected";
  connectInjected: () => Promise<void>;
  disconnect: () => void;
};

type InjectedAccount = {
  address: string;
  name?: string;
};

type InjectedExtension = {
  accounts: {
    get: () => Promise<InjectedAccount[]>;
  };
};

type InjectedWeb3Provider = {
  enable: (origin: string) => Promise<InjectedExtension>;
};

function getInjectedWeb3(): Record<string, InjectedWeb3Provider> | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  return (window as typeof window & { injectedWeb3?: Record<string, InjectedWeb3Provider> }).injectedWeb3;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  source: null,
  network: "mainnet",
  mode: "disconnected",
  connectInjected: async () => {
    const injectedWeb3 = getInjectedWeb3();
    const extensionName = injectedWeb3 ? Object.keys(injectedWeb3)[0] : null;

    if (!extensionName || !injectedWeb3) {
      toast.error("Install or unlock a Vara/Substrate wallet extension.");
      set({ address: null, mode: "disconnected" });
      return;
    }

    try {
      const extension = await injectedWeb3[extensionName].enable("VaraNest");
      const accounts = await extension.accounts.get();
      const account = accounts[0];

      if (!account) {
        toast.error("Wallet connected, but no account was exposed.");
        return;
      }

      set({ address: account.address, source: extensionName, mode: "injected" });
      toast.success(`Connected ${account.name ?? "wallet"}`);
    } catch (error) {
      if ((error as Error).message?.includes("Reject")) {
        toast.info("Wallet connection was cancelled.");
      } else {
        toast.error("Failed to connect wallet. Try again.");
      }
    }
  },
  disconnect: () => set({ address: null, source: null, mode: "disconnected" })
}));
