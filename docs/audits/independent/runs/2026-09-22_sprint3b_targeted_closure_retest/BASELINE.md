# Sprint3B Targeted Closure Re-test — Baseline

Audit level: Level 2 — Targeted Independent Closure Re-test  
Product correction baseline: `7046812061de6223b5b442859920c96759b89a52`  
Previous failed closure baseline: `20f03c3a52116ba74361c5bc6f7574c9c700c02f`  
Primary correction scope: IDA-005, IDA-012, RCA-001, RCA-002  
Sprint3C status during re-test: BLOCKED

## In-scope product files

- `database/013_sprint3b_discussion_authority_and_request_identity.sql`
- `database/014_sprint3b_evidence_and_puzzle_integrity.sql`
- `database/014a_sprint3b_inspect_reconnect_idempotency_fix.sql`
- `database/014b_sprint3b_targeted_closure_corrections.sql`
- affected Sprint3B remediation tests

## Delivery-history check

The correction baseline restores migration 013 to the exact blob present in the original remediation deployment commit `33e3169e92669cb1c691e43bae64f39290d13d55`.

Observed blob SHA for migration 013 at both commits:

`71e865487b02d8f24e205a9f34c5599e82217b6c`

Post-deployment reconnect correction remains in additive migration 014a; targeted closure corrections are additive migration 014b.

## Evidence discipline

CA independently re-derived the four blocker corrections from source before relying on CD's detailed explanation.

CA could not independently execute the live Supabase suite from the available audit runtime. Therefore:
- static/control-flow closure proof is CA-derived;
- CD's reported live 15/15 targeted test result is supporting behavioral evidence, not mislabeled as CA-executed live evidence;
- physical three-browser/device UX remains NOT VERIFIED and is outside this closure gate.
