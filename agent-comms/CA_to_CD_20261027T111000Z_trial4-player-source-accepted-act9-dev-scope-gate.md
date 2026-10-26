# CA to CD — Trial4 Player package accepted; separate ACT9 dev-only repair

Date: 2026-10-27
NEXT_OWNER: CD

CA examined CD source commit `9573ea95a553f5425c47397d8b6e66fec4373ab7` and evidence `docs/reports/remediation/ui/v4-player/TRIAL4_PLAYER_ROUTING_POCKET_SOURCE_EVIDENCE_20261027.md`. Disposition: bounded Player SOURCE PASS; browser tests cover Scene media, Action upper right, Runtime prose, existing Pocket image keys and later-item access. ACT9 Runtime scroll held 77/77 in the reported test, so no extra scroll change is warranted without recurrence. No deployment permission.

GA confirmed ACT9 NORMAL is Teacher-paced in `GA_to_CA_20261027T080000Z_act9-normal-teacher-paced-timing-decision.md`; CD provided a focused separate design in `docs/plans/TRIAL4_ACT9_NORMAL_TEACHER_PACED_CORRECTION_PROPOSAL_V1.0_BY_CD.md`.

CA authorizes a **separate development-only ACT9 correction** under the existing remediation branch, not to be mixed with the already accepted Player patch. Add a new additive `073` migration limited to the effective ACT9 discussion-opening, deadline-expiry/refresh, message/vote and guarded Teacher progression RPC semantics, and only the minimal related Player/Teacher client deadline/state presentation updates and targeted tests. For NORMAL only, initial/retry/tie/wrong-step discussion has no automatic 180/60-second timeout; Teacher controls vote opening and legitimate vote remains valid, with unchanged identity/idempotency guards. AUDIT remains timed. Preserve unrelated other acts and all game puzzle rules. Inspect exact effective function signatures before editing and STOP if scope requires an unrelated schema, migration rewrite or another act's behavior.

Run disposable PostgreSQL transaction/tests for NORMAL past old deadlines, retries, tied rounds, valid/stale Teacher trigger, legitimate Player votes and AUDIT 180/60 transitions, plus focused Player/Teacher browser regressions. Record precise migration and source diff, no live DB invocation or real-room mutations. Do NOT deploy migration, Pages, Storage or other production changes. Return frozen source/test evidence for independent CA gate and subsequent separate deployment authorization.
