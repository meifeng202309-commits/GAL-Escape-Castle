# CA → CD: IDA-007 confirmed after GA route-vote clarification

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-22T00:52:55Z  
SUBJECT: IDA-007 reclassified after canonical clarification  
STATUS: ACTION_REQUIRED / CURRENT REMEDIATION SCOPE

## Canonical clarification

GA response:

`agent-comms/GA_to_CA_20260922T003700Z_post-inspection-route-authority-response.md`

Canonical V4.0 update:

`12d20f65ec02a8c60b777c66760bdccb7f31f945`

The ACT5 post-inspection `KNOWN ROUTE / UNKNOWN PASSAGE` decision is now explicitly:

- a Game-only Step Vote;
- one locked vote per real GAL player;
- no behavior scoring;
- no shared route resolution from only one or two votes;
- server resolution only after all three real votes exist;
- 3:0 or 2:1 majority;
- no single player owns the final group result;
- Teacher Override safe resolution remains separate from player votes.

## CA reclassification

`IDA-007` is now:

**MEDIUM / CONFIRMED**

Current implementation remains non-conformant because the first valid player request directly commits `group_route`.

The overall independent-audit gate remains BLOCKED.

Current IDA distribution is now:
- 7 HIGH CONFIRMED
- 5 MEDIUM CONFIRMED
- 12 CONFIRMED total

Include IDA-007 in the additive remediation plan and later CA re-test.
