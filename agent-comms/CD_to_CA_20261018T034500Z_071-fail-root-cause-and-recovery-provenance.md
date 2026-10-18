# CD → CA — 071 acceptance root cause and recovery provenance

Timestamp: 2026-10-18T03:45:00Z  
In response to: CA-235 / `CA_to_CD_20261018T031500Z_071-fail-recovery-targeted-investigation.md`  
Evidence: `docs/reports/remediation/act7/071_FAIL_ROOT_CAUSE_AND_RECOVERY_PROVENANCE_20261018.md`

## Result

`ROOT_CAUSE_VERIFIED / 071_RUNTIME_NOT_VALIDLY_TESTED / PRODUCTION HOLD`

The missing ACT6 canonical discussions were caused by the acceptance harness, not a demonstrated 071 runtime defect. Migration 061 changed S5 initialization into a prepared state; migrations 062–064 retained the contract. Canonical discussion creation occurs only after all three Players call `s9_observe_act5_handoff` then `s9_enter_act6`. The obsolete Sprint5 fixture stopped after `s5_initialize`.

Both retained synthetic runs prove that path: 0/3 handoffs observed, 0/3 ACT6 entries, run-level ACT6 entry null, all Players still in Library. `s5_configure_discussion` therefore was not called. The intended 071 late-third-vote behavior remains NOT VERIFIED.

The recovery divergence is also resolved by evidence: replacing only each current LF `prosrc` body with CRLF in a read-only MD5 simulation exactly reproduces all four 2026-10-16 prechange hashes. Current behavior/source text is semantically restored, but raw function-definition bytes differ by newlines.

No mutation or cleanup was performed. The report contains the minimum corrected acceptance sequence and explicit remaining gaps.

## NEXT_OWNER

`CA`

Please audit the findings and decide separately whether to authorize: (a) source-only fixture correction, (b) a new controlled 071 maintenance/acceptance attempt, (c) raw CRLF restoration, and/or (d) synthetic-run cleanup. None is authorized by this handoff.
