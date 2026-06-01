"use client";

import { GearApi } from "@gear-js/api";
import { web3FromSource } from "@polkadot/extension-dapp";
import { u8aToHex } from "@polkadot/util";
import { decodeAddress } from "@polkadot/util-crypto";
import { Sails } from "sails-js";
import type { TransactionBuilder } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";
import { VARANEST_IDL_URL, VARANEST_PROGRAM_ID, VARANEST_RPC } from "@/lib/varanest-config";

type LiveCallInput = {
  address: string;
  source: string;
};

export type LiveCallReceipt = {
  ok: boolean;
  route: string;
  msgId: string;
  txHash: string;
  blockHash: string;
  finalized: boolean;
  response: unknown;
  error?: string;
};

async function loadSails() {
  const [api, idl] = await Promise.all([
    GearApi.create({ providerAddress: VARANEST_RPC }),
    fetch(VARANEST_IDL_URL).then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load VaraNest IDL from ${VARANEST_IDL_URL}`);
      }
      return response.text();
    })
  ]);

  const parser = await SailsIdlParser.new();
  const sails = new Sails(parser)
    .parseIdl(idl)
    .setApi(api)
    .setProgramId(VARANEST_PROGRAM_ID as `0x${string}`);

  return { api, sails };
}

async function sendWithInjectedWallet<T>(
  input: LiveCallInput,
  build: (sails: Sails) => Promise<{ route: string; transaction: TransactionBuilder<T> }> | { route: string; transaction: TransactionBuilder<T> }
): Promise<LiveCallReceipt> {
  const { api, sails } = await loadSails();

  try {
    const exists = await api.program.exists(VARANEST_PROGRAM_ID as `0x${string}`);
    if (!exists) {
      throw new Error(`Program ${VARANEST_PROGRAM_ID} was not found on ${VARANEST_RPC}`);
    }

    const injector = await web3FromSource(input.source);
    const { route, transaction } = await build(sails);
    transaction.withAccount(input.address, { signer: injector.signer });
    await transaction.calculateGas(false, 0);

    const result = await transaction.signAndSend();
    const finalized = await result.isFinalized.catch(() => false);

    try {
      const response = await result.response();

      return {
        ok: true,
        route,
        msgId: result.msgId,
        txHash: result.txHash,
        blockHash: result.blockHash,
        finalized,
        response
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        ok: false,
        route,
        msgId: result.msgId,
        txHash: result.txHash,
        blockHash: result.blockHash,
        finalized,
        response: null,
        error: message
      };
    }
  } finally {
    await api.disconnect();
  }
}

async function isRegistered(sails: Sails, address: string) {
  try {
    const actorId = u8aToHex(decodeAddress(address));
    const agent = await sails.services.Registry.queries.GetAgent(actorId).withAddress(address).call();
    return Boolean(agent);
  } catch {
    return false;
  }
}

export async function runRepeatableLiveTrial(input: LiveCallInput, handle: string, description: string) {
  return sendWithInjectedWallet(input, async (sails) => {
    if (await isRegistered(sails, input.address)) {
      return {
        route: "Registry/UpdateDescription",
        transaction: sails.services.Registry.functions.UpdateDescription(description)
      };
    }

    return {
      route: "Registry/RegisterAgent",
      transaction: sails.services.Registry.functions.RegisterAgent(handle, description)
    };
  });
}

export async function registerAgentLive(input: LiveCallInput, handle: string, description: string) {
  return sendWithInjectedWallet(input, (sails) => ({
    route: "Registry/RegisterAgent",
    transaction: sails.services.Registry.functions.RegisterAgent(handle, description)
  }));
}

export async function updateAgentDescriptionLive(input: LiveCallInput, description: string) {
  return sendWithInjectedWallet(input, (sails) => ({
    route: "Registry/UpdateDescription",
    transaction: sails.services.Registry.functions.UpdateDescription(description)
  }));
}

export async function declareCapabilityLive(input: LiveCallInput, claim: string, category: string, stake: bigint) {
  return sendWithInjectedWallet(input, (sails) => ({
    route: "Declarations/DeclareCapability",
    transaction: sails.services.Declarations.functions.DeclareCapability(claim, category, stake)
  }));
}
