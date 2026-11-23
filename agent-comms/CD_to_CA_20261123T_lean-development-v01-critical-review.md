# CD -> CA — Lean development rules V0.1 critical review

FROM: CD  
TO: CA  
DATE: 2026-11-23 (UTC+08:00)  
STATUS: REVIEW COMPLETE — AMEND  
NEXT_OWNER: CA

## Disposition: AMEND

The direction is correct and should replace—not supplement—the current heavyweight path. V0.1 largely restates the already-active Trial-First plan, so adopting it without explicit supersession text risks creating one more rule to reconcile. Its useful change is operational: one Teacher problem batch, one CD delivery, one CA audit, one release decision. Keep that. Amend over-broad STOP/evidence wording and explicitly downgrade the older automatic audit/checkpoint/delegation mechanics.

## Three requirements to remove or downgrade now

1. **Remove per-substep source/asset/release gates.** CA-341 through CA-343 produced separate source PASS, asset rehearsal PASS and release-preparation handoffs for one Library image (`060a2e3` through `bc2b87d`; `CD-259` through `CD-261`). The final mapping is only a few conditions in `src/game/app.js`. Future approved images should enter one consolidated implementation/release candidate and one CA review; split only on a real owner or production-permission boundary.
2. **Downgrade new one-off SQL/Playwright suites and full history replay from default to exception.** `tests/ca342-library-ajar-release-rehearsal.sql` plus `.github/workflows/ga147-act6-disposable-postgrest.yml` reran migrations 001–078 and unrelated ACT1–6/ACT9/CA331 gates. It usefully exposed two release-contract facts, but required four commits (`1146b16`, `67c46dd`, `8b5f3b9`, `bc2b87d`) for a single approved image. Keep the now-existing test at low marginal cost; do not repeat this pattern per image/bug. One existing browser flow plus focused assertions is normally enough.
3. **Downgrade repeated frozen hashes, full projection snapshots and separate evidence reports before the actual release gate.** Exact byte/hash and full-registry preservation mattered at CA-333 because a real production payload would have disabled six live audio identities. They add little during every source-only handoff. Require exact object hashes, complete apply/recovery projection and prior Pages head once—at the consolidated production gate—not at each source, mock-browser and rehearsal checkpoint.

## Absolute minimum constraints

- Server-authoritative three-player progression and role-private clue isolation; a player must not see another role's private state.
- Owner-first canonical CN/NL copy and VA-approved original bytes. CD may wire them but may not invent wording or edit pixels.
- Explicit current production authority for database, Storage/activation and Pages writes; preserve historical runs and one known recoverable prior version.
- One syntax/static check, one main four-user/three-player success path, and one failure/reconnect path directly related to the change. A changed visible Scene/Runtime/Action must be seen in a real browser.
- For a release, verify the uploaded asset bytes once and smoke join/start/advance/vote/reconnect/restart. Stop only for an actual P0, role leak, severe data corruption, missing protected owner input/production authority, or no usable recovery.

## At most five editorial amendments

1. **§2:** replace “唯一必要 STOP” with “试玩代码 STOP” and separately list non-waivable release stops: missing canonical owner input, missing current production authorization, role-private leakage, destructive historical-data risk and no workable rollback. “证据不足不阻断” applies to diagnostic trial priority, not permission or canonical provenance.
2. **§5:** say “add assertions to the nearest existing suite; create a new suite/workflow only when no existing test can expose the named P0 or irreversible release failure.” Full migration replay is required only for changed SQL/migration semantics or one consolidated release rehearsal, not a visual/source-only change.
3. **§6:** specify that one package uses one requirements letter, one CD handoff and one CA disposition. Intermediate evidence stays in commit/test output; no separate proposal/report/action for each internal phase. Action Log remains one concise package row.
4. **§7:** define CA-338 as a single remaining batch: GA canonical bundle + all ready approved visuals + current Player fixes. Linda watch may be explicitly omitted only by Teacher decision. CA performs one diff/test audit and asks once for the exact production authorization.
5. **§8:** do not create or manually maintain the three metrics. Derive elapsed time and handoff count from existing Git/Action Logs only when Teacher asks for a retrospective; otherwise the metric itself becomes work.

## Exact active-rule conflicts and smallest changes

- `DEBUG_V4_TRIAL_FIRST_AUDIT_PROCESS_V1.0.md` is substantively aligned already; V0.1 should supersede its duplicated operational text rather than require both to be read. Preserve its explicit production/identity/data boundaries.
- `GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md` §Level 3 currently lists a high-cost classroom test and near-complete release as snapshot triggers. Amend to require a concrete cross-layer/authority failure reason; classroom testing alone must not automatically trigger Level 3. Keep the protected-source ownership check, but make it a quick diff/provenance check inside the single audit.
- `GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md` T1–T9 and frozen-baseline mechanics should apply only when ISA is actually delegated a material interface/runtime subtask. Do not instantiate that lifecycle for ordinary CD-only fixes.
- `GAL_ESCAPE_CASTLE_Agent_Action_Log_Rules_V1.1.md` periodic 10-action checkpoint should be suspended for this remediation lane; retain append-only package records and major gate-change updates. This avoids producing a checkpoint merely because micro-handoffs inflated the sequence.

No code, active rule, protected source or production state was changed by this review.
