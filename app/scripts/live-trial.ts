import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { GearApi, GearKeyring } from "@gear-js/api";
import type { KeyringPair } from "@polkadot/keyring/types";
import { u8aToHex } from "@polkadot/util";
import { decodeAddress } from "@polkadot/util-crypto";
import { Sails } from "sails-js";
import type { TransactionBuilder } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";

process.on("uncaughtException", (error) => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("disconnected from") && message.includes("1000:: Normal Closure")) {
    return;
  }

  console.error(JSON.stringify({ ok: false, error: message }, null, 2));
  process.exitCode = 1;
});

type Route = "auto" | "register" | "update" | "declare" | "challenge" | "proof" | "vote" | "settle";

type CliOptions = {
  route: Route;
  handle: string;
  description: string;
  claim: string;
  category: string;
  stake: bigint;
  declarationId: bigint;
  trialId: bigint;
  durationBlocks: bigint;
  proof: string;
  verified: boolean;
  weight: number;
  voucherId?: `0x${string}`;
};

const DEFAULT_RPC = "wss://rpc.vara.network";
const DEFAULT_PROGRAM_ID = "0xc1610de24425cb3644db9e701b62d97ffb12bc84e0fc60cef28ed2007ce13eae";
const DEFAULT_WALLET_JSON_PATH = resolve(process.cwd(), "..", ".wallet", "wallets", "varanest.json");
const DEFAULT_WALLET_PASSPHRASE_PATH = resolve(process.cwd(), "..", ".wallet", ".passphrase");
const ROUTES: Route[] = ["auto", "register", "update", "declare", "challenge", "proof", "vote", "settle"];

function loadDotEnv(filePath: string) {
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...parts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = parts.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function parseBool(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "verify", "verified"].includes(value.toLowerCase());
}

function parseBigIntArg(name: string, fallback: string) {
  const value = argValue(name) ?? fallback;
  if (!/^\d+$/.test(value)) {
    throw new Error(`${name} must be an integer protocol value, received "${value}".`);
  }
  return BigInt(value);
}

function parseNumberArg(name: string, fallback: string) {
  const value = argValue(name) ?? fallback;
  if (!/^\d+$/.test(value)) {
    throw new Error(`${name} must be a positive integer, received "${value}".`);
  }
  return Number(value);
}

function parseRoute(value: string | undefined): Route {
  const route = (value ?? "auto") as Route;
  if (!ROUTES.includes(route)) {
    throw new Error(`--route must be one of: ${ROUTES.join(", ")}`);
  }
  return route;
}

function parseOptions(): CliOptions {
  return {
    route: parseRoute(argValue("--route")),
    handle: argValue("--handle") ?? `varanest-${Date.now().toString(36)}`.slice(0, 32),
    description: argValue("--description") ?? `External VaraNest live call at ${new Date().toISOString()}`,
    claim: argValue("--claim") ?? "I can complete a VaraNest live integration trial.",
    category: argValue("--category") ?? "Integration",
    stake: parseBigIntArg("--stake", "1"),
    declarationId: parseBigIntArg("--declaration-id", "0"),
    trialId: parseBigIntArg("--trial-id", "0"),
    durationBlocks: parseBigIntArg("--duration-blocks", "100"),
    proof: argValue("--proof") ?? "Live external integration proof submitted through VaraNest CLI.",
    verified: parseBool(argValue("--verified"), true),
    weight: parseNumberArg("--weight", "1"),
    voucherId: (argValue("--voucher-id") ?? process.env.VARANEST_VOUCHER_ID) as `0x${string}` | undefined
  };
}

async function isRegistered(sails: Sails, address: string) {
  const actorId = u8aToHex(decodeAddress(address));
  const agent = await sails.services.Registry.queries.GetAgent(actorId).withAddress(address).call();
  return Boolean(agent);
}

async function loadSigner(): Promise<KeyringPair> {
  const signerSuri = process.env.VARANEST_SIGNER_SURI;
  if (signerSuri) {
    return GearKeyring.fromSuri(signerSuri, "varanest-live-trial");
  }

  const walletJsonPath = resolve(process.cwd(), process.env.VARANEST_WALLET_JSON_PATH ?? DEFAULT_WALLET_JSON_PATH);
  const passphrasePath = resolve(process.cwd(), process.env.VARANEST_WALLET_PASSPHRASE_PATH ?? DEFAULT_WALLET_PASSPHRASE_PATH);

  if (!existsSync(walletJsonPath)) {
    throw new Error("Missing signer. Set VARANEST_SIGNER_SURI or provide VARANEST_WALLET_JSON_PATH.");
  }

  const passphrase = existsSync(passphrasePath) ? readFileSync(passphrasePath, "utf8").trim() : undefined;
  return GearKeyring.fromJson(readFileSync(walletJsonPath, "utf8"), passphrase);
}

async function buildTransaction(sails: Sails, address: string, options: CliOptions): Promise<{ route: string; transaction: TransactionBuilder<unknown> }> {
  if (options.route === "auto") {
    if (await isRegistered(sails, address)) {
      return {
        route: "Registry/UpdateDescription",
        transaction: sails.services.Registry.functions.UpdateDescription(options.description)
      };
    }

    return {
      route: "Registry/RegisterAgent",
      transaction: sails.services.Registry.functions.RegisterAgent(options.handle, options.description)
    };
  }

  if (options.route === "register") {
    return {
      route: "Registry/RegisterAgent",
      transaction: sails.services.Registry.functions.RegisterAgent(options.handle, options.description)
    };
  }

  if (options.route === "update") {
    return {
      route: "Registry/UpdateDescription",
      transaction: sails.services.Registry.functions.UpdateDescription(options.description)
    };
  }

  if (options.route === "declare") {
    return {
      route: "Declarations/DeclareCapability",
      transaction: sails.services.Declarations.functions.DeclareCapability(options.claim, options.category, options.stake)
    };
  }

  if (options.route === "challenge") {
    if (options.declarationId <= 0n) throw new Error("--declaration-id is required for --route challenge");
    return {
      route: "Trials/IssueChallenge",
      transaction: sails.services.Trials.functions.IssueChallenge(options.declarationId, options.stake, options.durationBlocks)
    };
  }

  if (options.route === "proof") {
    if (options.trialId <= 0n) throw new Error("--trial-id is required for --route proof");
    return {
      route: "Trials/SubmitProof",
      transaction: sails.services.Trials.functions.SubmitProof(options.trialId, options.proof)
    };
  }

  if (options.route === "vote") {
    if (options.trialId <= 0n) throw new Error("--trial-id is required for --route vote");
    return {
      route: "Trials/CastWitnessVote",
      transaction: sails.services.Trials.functions.CastWitnessVote(options.trialId, options.verified, options.weight)
    };
  }

  if (options.trialId <= 0n) throw new Error("--trial-id is required for --route settle");
  return {
    route: "Trials/SettleTrial",
    transaction: sails.services.Trials.functions.SettleTrial(options.trialId)
  };
}

async function main() {
  loadDotEnv(resolve(process.cwd(), ".env.local"));
  loadDotEnv(resolve(process.cwd(), ".env"));
  loadDotEnv(resolve(process.cwd(), "..", ".env"));

  const options = parseOptions();
  const rpc = process.env.VARANEST_VARA_RPC ?? process.env.NEXT_PUBLIC_VARA_RPC ?? DEFAULT_RPC;
  const programId = process.env.VARANEST_PROGRAM_ID ?? process.env.NEXT_PUBLIC_PROGRAM_ID ?? DEFAULT_PROGRAM_ID;
  const idlPath = resolve(process.cwd(), process.env.VARANEST_IDL_PATH ?? "public/idl/varanest.idl");

  if (!existsSync(idlPath)) {
    throw new Error(`IDL not found at ${idlPath}`);
  }

  const api = await GearApi.create({ providerAddress: rpc });

  try {
    const exists = await api.program.exists(programId as `0x${string}`);
    if (!exists) {
      throw new Error(`Program ${programId} was not found on ${rpc}`);
    }

    const parser = await SailsIdlParser.new();
    const sails = new Sails(parser)
      .parseIdl(readFileSync(idlPath, "utf8"))
      .setApi(api)
      .setProgramId(programId as `0x${string}`);
    const account = await loadSigner();
    const { route, transaction } = await buildTransaction(sails, account.address, options);

    transaction.withAccount(account);
    if (options.voucherId) {
      transaction.withVoucher(options.voucherId);
    }
    await transaction.calculateGas(false, 0);
    const receipt = await transaction.signAndSend();
    const finalized = await receipt.isFinalized.catch(() => false);

    try {
      const response = await receipt.response();
      console.log(JSON.stringify({
        ok: true,
        network: "Vara Mainnet",
        rpc,
        programId,
        caller: account.address,
        route,
        msgId: receipt.msgId,
        txHash: receipt.txHash,
        blockHash: receipt.blockHash,
        finalized,
        response
      }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({
        ok: false,
        network: "Vara Mainnet",
        rpc,
        programId,
        caller: account.address,
        route,
        msgId: receipt.msgId,
        txHash: receipt.txHash,
        blockHash: receipt.blockHash,
        finalized,
        error: error instanceof Error ? error.message : String(error)
      }, null, 2));
      process.exitCode = 1;
    }
  } finally {
    await api.disconnect();
  }
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error instanceof Error ? error.message : String(error)
  }, null, 2));
  process.exitCode = 1;
});
