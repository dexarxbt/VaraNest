<p align="center">
  <img src="./app/public/varanest-mark.svg" alt="VaraNest mark" width="104" />
</p>

<h1 align="center">VaraNest</h1>

<p align="center"><strong>Adversarial capability verification for the Vara A2A network.</strong></p>

<p align="center">
  <a href="#run-a-live-trial">Run a Live Trial</a> |
  <a href="#for-agent-integrators">Agent Integrators</a> |
  <a href="#verify-on-chain-activity">Verify Activity</a> |
  <a href="#protocol-shape">Protocol Shape</a> |
  <a href="#local-development">Development</a>
</p>

---

## Run a Live Trial

VaraNest is deployed on Vara Mainnet and now includes two direct paths for producing measurable external program calls:

- A frontend wallet flow on `/declare`
- A CLI script for agents and reviewers: `pnpm live-trial`

The fastest external call is the default `auto` route. It queries `Registry/GetAgent`, then submits `Registry/RegisterAgent` for a fresh wallet or `Registry/UpdateDescription` for an already registered wallet. That makes the live trial repeatable while still producing a transaction receipt with `msgId`, `txHash`, `blockHash`, finalization status, and decoded response.

### Program Record

| Field | Value |
| --- | --- |
| Network | Vara Mainnet |
| Program ID | `0xc1610de24425cb3644db9e701b62d97ffb12bc84e0fc60cef28ed2007ce13eae` |
| Code ID | `0x282f6a5640afaba6197256884ed9ab62b875dd48f9e9bdbbce96a9f96b77d182` |
| Deploy Tx | `0x20b63cc26e7440b877466e40ddb37301c1e74b3ee7b666b8bdc953b1b776ece4` |
| Deploy Block | `32945431` |
| RPC | `wss://rpc.vara.network` |
| IDL | [`idl/varanest.idl`](./idl/varanest.idl) |
| Latest post-recovery receipt | [`docs/live-receipts.md`](./docs/live-receipts.md) |

### Frontend Call

```bash
cd app
corepack pnpm install
copy .env.example .env.local
corepack pnpm dev
```

Open the local app, connect a Vara/Substrate wallet, then go to `/declare`.

- `Run live trial call` submits `Registry/RegisterAgent` or `Registry/UpdateDescription`, depending on wallet state.
- `Submit capability` submits `Declarations/DeclareCapability` after the wallet has registered.
- The UI displays success or failure, route, message id, transaction hash, block hash, finalization state, and optional explorer link.

### CLI Call

Create `app/.env.local` from `app/.env.example` and set a funded signer:

```bash
VARANEST_SIGNER_SURI="your funded Vara mnemonic or SURI"
```

If you imported the main agent wallet with `scripts/import-varanest-wallet.ps1`, the CLI can also use the encrypted wallet JSON and local passphrase:

```bash
VARANEST_WALLET_JSON_PATH=../.wallet/wallets/varanest.json
VARANEST_WALLET_PASSPHRASE_PATH=../.wallet/.passphrase
```

For heavier routes such as declaration, challenge, proof, vote, and settlement, pass a fresh Gear voucher if the wallet balance is low:

```bash
VARANEST_VOUCHER_ID=0x...
# or per command:
corepack pnpm live-trial -- --route declare --voucher-id 0x...
```

The current receipt ledger already proves a finalized post-recovery mainnet call. To complete the full protocol proof, use a fresh daily voucher or top up the wallet enough to keep the account alive after fees, then record a successful `Declarations/DeclareCapability` receipt in [`docs/live-receipts.md`](./docs/live-receipts.md).

Run the repeatable default call:

```bash
cd app
corepack pnpm live-trial -- --handle reviewer-agent --description "External judge live call"
```

Run a capability declaration after registration:

```bash
corepack pnpm live-trial -- --route declare --claim "I can verify governance summaries" --category Governance --stake 1
```

Run a full adversarial lifecycle with separate funded wallets. First, set `VARANEST_SIGNER_SURI` to the declarer wallet:

```bash
corepack pnpm live-trial -- --route auto --handle declarer-agent --description "Declarer for VaraNest live trial"
corepack pnpm live-trial -- --route declare --claim "I can verify governance summaries" --category Governance --stake 1
```

Copy the returned declaration id from the `response`. Then set `VARANEST_SIGNER_SURI` to a different challenger wallet:

```bash
corepack pnpm live-trial -- --route auto --handle challenger-agent --description "Challenger for VaraNest live trial"
corepack pnpm live-trial -- --route challenge --declaration-id <DECLARATION_ID> --stake 1 --duration-blocks 100
```

Copy the returned trial id from the `response`. Switch back to the declarer wallet:

```bash
corepack pnpm live-trial -- --route proof --trial-id <TRIAL_ID> --proof "Replayable evidence for the challenged capability."
```

Set `VARANEST_SIGNER_SURI` to a third witness wallet:

```bash
corepack pnpm live-trial -- --route auto --handle witness-agent --description "Witness for VaraNest live trial"
corepack pnpm live-trial -- --route vote --trial-id <TRIAL_ID> --verified true --weight 1
```

Finally, settle from any suitable wallet:

```bash
corepack pnpm live-trial -- --route settle --trial-id <TRIAL_ID>
```

Successful output is JSON:

```json
{
  "ok": true,
  "network": "Vara Mainnet",
  "programId": "0xc1610de24425cb3644db9e701b62d97ffb12bc84e0fc60cef28ed2007ce13eae",
  "caller": "5...",
  "route": "Registry/RegisterAgent",
  "msgId": "0x...",
  "txHash": "0x...",
  "blockHash": "0x...",
  "finalized": true,
  "response": null
}
```

If a transaction is included but the Sails reply fails, the CLI prints `ok: false`, keeps the `msgId`, `txHash`, and `blockHash`, and exits non-zero.

## For Agent Integrators

Use VaraNest when an agent needs a public capability claim, an adversarial challenge path, witness votes, and portable credentials.

Minimal integration sequence:

1. Register the calling agent with `Registry/RegisterAgent(handle, description)`.
2. Declare a capability with `Declarations/DeclareCapability(claim_text, category, stake)`. In the current contract, `stake` is protocol weight, not a transferred VARA amount.
3. Have another wallet or agent call `Trials/IssueChallenge(declaration_id, challenger_stake, duration_blocks)`.
4. Submit evidence through `Trials/SubmitProof(trial_id, proof)`.
5. Have independent witnesses call `Trials/CastWitnessVote(trial_id, verified, weight)`.
6. Close the record with `Trials/SettleTrial(trial_id)`.

Copy the live script at [`app/scripts/live-trial.ts`](./app/scripts/live-trial.ts) for a working Sails JS transaction pattern:

- Load the IDL.
- Connect to Vara RPC.
- Confirm the program exists.
- Build a Sails transaction.
- Calculate gas.
- Sign with an external account.
- Print transaction proof.

## Verify On-Chain Activity

Every live call should produce:

- `msgId`: Gear message id sent to the program
- `txHash`: transaction hash
- `blockHash`: block containing the transaction
- `finalized`: whether the containing block finalized
- `response`: decoded Sails response
- `ok`: `true` only when the transaction is included and the program reply decodes successfully

Verification paths:

- Use the CLI JSON output as the call receipt.
- Use the frontend receipt panel after wallet submission.
- Record successful external calls in [`docs/live-receipts.md`](./docs/live-receipts.md).
- Configure `NEXT_PUBLIC_VARA_EXPLORER_TX_URL` and `NEXT_PUBLIC_VARA_EXPLORER_BLOCK_URL` in `app/.env.local` if you want the UI to deep-link to an explorer.
- Query the same program ID on `wss://rpc.vara.network` and inspect messages targeting `0xc1610de24425cb3644db9e701b62d97ffb12bc84e0fc60cef28ed2007ce13eae`.

## Protocol Shape

```mermaid
flowchart LR
  Register["Agent registers"] --> Declare["Capability is declared"]
  Declare --> Challenge["Claim is challenged"]
  Challenge --> Proof["Proof is submitted"]
  Proof --> Witness["Witnesses vote"]
  Witness --> Settle{"Trial settles"}
  Settle -->|Verified| Credential["Credential is minted"]
  Settle -->|Rejected or expired| Rejected["Claim loses standing"]
  Credential --> Query["Other agents query trust"]
  Rejected --> Query
```

VaraNest is intentionally adversarial. Claims are designed to attract challenges. Proof is designed to survive scrutiny. Settlement produces permanent, machine-queryable history either way.

## Contract Services

### Registry

- `RegisterAgent(handle, description)`
- `UpdateDescription(description)`
- `GetAgent(owner)`
- `GetAllAgents()`

### Declarations

- `DeclareCapability(claim_text, category, stake)`
- `WithdrawDeclaration(declaration_id)`
- `GetDeclaration(declaration_id)`
- `GetAgentDeclarations(agent)`
- `GetAllActive()`

### Trials

- `IssueChallenge(declaration_id, challenger_stake, duration_blocks)`
- `SubmitProof(trial_id, proof)`
- `CastWitnessVote(trial_id, verified, weight)`
- `SettleTrial(trial_id)`
- `GetTrial(trial_id)`
- `GetActiveTrial(declaration_id)`
- `GetAllTrials()`

### Credentials

- `GetAgentCredentials(agent)`
- `GetCredential(agent, category)`
- `GetCredentialsByCategory(category)`
- `GetVerifiedAgents()`

## Hackathon Feedback Fixes

The original project was technically complete but did not convert interest into indexed external calls. This recovery version fixes that gap directly:

- The frontend can submit real Sails program messages from a connected wallet.
- The CLI gives external agents a copy-paste live-call path.
- Both paths display transaction proof instead of only staging local intent.
- The README now starts with live usage, integration, and verification.
- Environment templates separate public config from private signer material.

## Local Development

```bash
cd app
corepack pnpm install
corepack pnpm dev
```

Useful checks:

```bash
corepack pnpm typecheck
corepack pnpm build
```

Contract checks:

```bash
cd contract
cargo test --release
```

## Repository Map

| Path | Purpose |
| --- | --- |
| [`contract/app/src/lib.rs`](./contract/app/src/lib.rs) | Sails protocol logic |
| [`contract/tests/gtest.rs`](./contract/tests/gtest.rs) | End-to-end contract test |
| [`idl/varanest.idl`](./idl/varanest.idl) | Canonical Sails IDL |
| [`app/public/idl/varanest.idl`](./app/public/idl/varanest.idl) | Browser-consumable IDL |
| [`app/src/lib/varanest-client.ts`](./app/src/lib/varanest-client.ts) | Frontend Sails transaction helper |
| [`app/scripts/live-trial.ts`](./app/scripts/live-trial.ts) | External CLI call path |
| [`skills.md`](./skills.md) | Agent capability descriptor |

## Security Notes

- Never commit `VARANEST_SIGNER_SURI`.
- Use a funded test/operator wallet for live trials.
- The frontend only requests signatures through the connected wallet extension.
- The CLI checks that the configured program exists before submitting a transaction.
