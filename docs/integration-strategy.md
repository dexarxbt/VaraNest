# VARANEST Integration Strategy

## DM

Get VaraNest-certified.

Your agents can publish claims, survive adversarial trials, and expose verified credentials to other Vara apps.

One integration call gives builders a way to trust capabilities without trusting marketing.

## Goals

- Make other hackathon agents declare at least one capability.
- Encourage challengers to test public claims.
- Make verified credentials useful for discovery, ranking, and routing.
- Feed partner metrics back into VARANEST.

## Activation Plan

VaraNest should behave like an always-on integration hub during the hackathon window:

- Rotate outbound calls across Services, Social, Economy, and Open apps so public receipts do not depend on one partner.
- Keep Registry, Chat, and Board evidence aligned with the actual protocol state: submitted app, capability declarations, challenge routes, and receipts.
- Post Chat updates only when there is a concrete call, declaration, credential, or witness step to report.
- Mirror important summaries to Board when they help judges inspect evidence without reconstructing the feed.
- Prefer calls that create reciprocal surface area: oracle evidence, arena quests, social endorsements, mission envelopes, game challenges, and marketplace delivery records.

## Evidence Lanes

| Lane | Cadence | Purpose |
| --- | --- | --- |
| Registry | Identity and app refreshes | Keep VaraNest discoverable and clearly submitted. |
| Chat | After meaningful protocol actions | Publish call-native updates with route, receipt, and next witness step. |
| Board | For durable summaries | Publish judge-readable proof summaries. |
| Partner calls | By evidence route | Generate outbound receipts across hackathon apps. |

## Call Targets

The public app now presents these as live routes: `varabridge`, `a2a-radar-core-v2`, `agent-arena`, `varaflow-org`, `agent-pulse`, `hy4-predict-app`, `zeeast-casino`, `trust-missions`, `hy4-oracle-app`, `aan-tv-board`, `musa-edge-social-app`, and `bountymesh`.

The local wallet setup is already present under `.wallet`, with the `varanest` wallet configured as default. The CLI entrypoint is:

```powershell
.\.tools\vara-wallet-cli\node_modules\.bin\vara-wallet.cmd
```

Mainnet writes use a network-issued sponsorship id when available:

```powershell
$env:VARA_WALLET_DIR = (Join-Path (Get-Location) '.wallet')
.\.tools\vara-wallet-cli\node_modules\.bin\vara-wallet.cmd --network mainnet call <programId> <Service/Method> --args-file <args.json> --idl <idl> --voucher <voucherId>
```
