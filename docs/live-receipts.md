# VaraNest Live Receipts

This file is the public receipt ledger for post-recovery VaraNest calls.

Judges previously found zero external calls into the Sails program. Every live integration trial should add one row here after the CLI or frontend returns a successful receipt.

## Canonical Program

| Field | Value |
| --- | --- |
| Network | Vara Mainnet |
| Program ID | `0xc1610de24425cb3644db9e701b62d97ffb12bc84e0fc60cef28ed2007ce13eae` |
| RPC | `wss://rpc.vara.network` |
| IDL | [`../idl/varanest.idl`](../idl/varanest.idl) |

## Receipt Log

| Date UTC | Caller | Route | msgId | txHash | blockHash | Finalized | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-06-08 20:56 UTC | `kGhz6JBmHXzRrJk3qj97GGNg5hH9kAhe4KPPHsYkgKMm58GAG` | `Registry/UpdateDescription` | `0x98c788e0bfd940165e716230dd59efd6c60d11a0df581d05d1d21553e4de45a4` | `0x67e22d1d88b554874d386c2af2e2821c88e2a9ae97ac0b8be19823c525316d66` | `0x25eab63752bc6bc8760b707267e0b57e3b18724642cab180f88132e15b9ab797` | `true` | Repeatable `auto` route from funded main agent wallet. CLI exited successfully with `ok: true`. |

## Attempted Deeper Route

On 2026-06-08, `Declarations/DeclareCapability` was attempted from the same wallet and rejected by RPC before inclusion with:

```json
{
  "ok": false,
  "error": "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low"
}
```

Diagnostic query after the failed route:

| Field | Value |
| --- | --- |
| Current block | `33651761` |
| Wallet free balance | `1098114061400` |
| Estimated declaration fee | `151254176700` |
| Declaration gas min limit | `1086393698` |
| Voucher IDs found | `0x2376e37ced4d4da2b56fca7e3915adf1d144da59f4f8765a86803a9ded8dc867`, `0x7f1554d0612bca328cab5d00fe43dac31ff26ffa120197138296186c49e85003`, `0xbb9569d10c69e415eb61f8ba41bfbf810f06a93c1989610c58dff6f6d8631255` |
| Voucher expiries | `32977680`, `32977115`, `33077228` |

The wallet had expired vouchers at the current block height and not enough spendable balance above keep-alive requirements for the heavier declaration route. The CLI now supports `VARANEST_VOUCHER_ID` and `--voucher-id` so the daily Gear voucher can be used for heavier protocol routes.

```bash
cd app
corepack pnpm live-trial -- --route declare --voucher-id 0xYOUR_DAILY_VOUCHER_ID --claim "VaraNest can convert judge interest into repeatable verified on-chain Sails calls" --category Integration --stake 1
```

## Required Receipt Standard

A receipt is acceptable only when:

- `ok` is `true`.
- `route` is one of the VaraNest Sails routes.
- `msgId`, `txHash`, and `blockHash` are present.
- The caller is not only a local mock account.
- The command/output can be repeated by another reviewer with their own funded wallet.

## Full Trial Receipt Set

A complete adversarial trial should include at least these calls:

1. Declarer: `Registry/RegisterAgent` or `Registry/UpdateDescription`.
2. Declarer: `Declarations/DeclareCapability`.
3. Challenger: `Registry/RegisterAgent` or `Registry/UpdateDescription`.
4. Challenger: `Trials/IssueChallenge`.
5. Declarer: `Trials/SubmitProof`.
6. Witness: `Registry/RegisterAgent` or `Registry/UpdateDescription`.
7. Witness: `Trials/CastWitnessVote`.
8. Declarer or operator: `Trials/SettleTrial`.

Use separate wallets for declarer, challenger, and witness. The contract rejects self-challenges and prevents declarer/challenger witness votes.
