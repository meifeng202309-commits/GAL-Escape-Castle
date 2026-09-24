# Sprint4 Asset Manager V2 — Third Focused Level 1 CA Re-audit

Baseline: `7ce7821f988ef33d495629508fc0d4e18ff4f527`  
Scope: closure of `S4-RC-002` and `S4-RC-003`, plus directly adjacent regression risk  
Audit level: Level 1 — Focused re-audit  
Decision: **PASS — SPRINT4 VERIFIED**

## 1. Inputs and independence

CA froze the submitted correction baseline and independently reconstructed the changed authority / transition model from:

- `database/026_sprint4_group_target_and_registry_lock.sql`;
- `tests/sprint4-026-db-regression.sql`;
- `tests/sprint4-static-check.js`;
- prior migrations `018–025`;
- current registry sync / candidate import / group activation / rollback paths;
- canonical Sprint4 authority condition `S4-SCOPE-03`.

Commit `7ce7821f...` adds migration 026 and regression coverage without modifying deployed migrations `018–025`.

CD-reported Supabase transaction and concurrency results are supporting evidence. CA independently verified the relevant source/control-flow invariants.

## 2. Closure matrix

| Finding | Re-audit status | Result |
|---|---|---|
| S4-RC-002 MEDIUM | **FIXED_VERIFIED** | NULL, empty, NULL-element, duplicate, nonexistent and partially-resolved target sets are rejected before a transition can succeed. The helper rechecks resolved cardinality after lock acquisition, and rollback inherits the same authoritative target-set validation. |
| S4-RC-003 MEDIUM | **FIXED_VERIFIED** | The transition helper now locks the relevant `asset_registry_projection` rows in stable asset-key order before candidate status mutation and retains that authority boundary through eligibility checks, event writes and ACTIVE/SUPERSEDED mutation. Concurrent registry updates on those keys cannot commit a conflicting `active_version` while the transition is in flight. |

## 3. Adjacent authority / concurrency review

### Target-set authority

The transition no longer equates “no violating row found” with “valid target”. It establishes:

- non-null input;
- non-empty input;
- no NULL ids;
- no duplicate ids;
- exact pre-lock resolution count;
- exact post-lock resolution count.

This closes the prior zero-row false-success class.

### Registry / runtime version authority

The canonical version authority and runtime ACTIVE mutation now share a transaction-level serialization boundary on the same registry rows.

The submitted two-session evidence is consistent with the source model: a concurrent update to the locked projection row fails on lock timeout rather than committing an incompatible version truth.

### Rollback

`asset_manager_rollback_group(...)` still performs its normalization update before delegating to the transition helper, but any helper exception propagates through the same transaction, so a rejected target/authority check does not leave the preliminary status update committed.

No adjacent silent-corruption defect was found.

### Non-blocking operational boundary

CA did not independently stress-test high-contention multi-key registry sync against multi-key transitions with deliberately inverted row-acquisition order. PostgreSQL transactional abort/deadlock handling would preserve consistency rather than silently split authority; this is therefore an operational availability boundary, not a Sprint4 release blocker.

## 4. Regression / evidence review

CD reports migration 026 applied successfully and provides:

- seven-case DB rejection matrix covering NULL, empty, NULL-element, duplicate, nonexistent, partial and rollback-nonexistent targets;
- two-session concurrency evidence where the competing registry update receives SQLSTATE `55P03` while the transition retains the registry lock;
- all static suites PASS;
- Sprint1 live 40/40 PASS;
- Sprint2 live 23/23 PASS;
- Sprint3A live 15/15 PASS;
- Sprint3B live 44/44 PASS;
- Sprint3B remediation live 15/15 PASS;
- Sprint3C live 15/15 PASS;
- Sprint4 live 15/15 PASS.

These results are consistent with the independently derived correction model.

Physical multi-device Asset Manager UX remains outside this focused closure proof and is not required to close S4-RC-002 / S4-RC-003.

## 5. Canonical compliance

Sprint4 Asset Manager V2 now satisfies the previously bound authority conditions relevant to this gate:

- lifecycle authority no longer has the legacy service-role writer bypass;
- same-key/version replay cannot silently substitute a different immutable candidate package;
- group activation / rollback leaves durable operational evidence;
- invalid target sets cannot be acknowledged as successful transitions;
- registry `active_version` and runtime ACTIVE mutation cannot silently diverge through the previously identified race;
- migrations `018–026` are additive history;
- no Sprint5 implementation is present in this baseline.

## 6. Codex Recurring-Error Pattern Scan

| Pattern | Result | Focused result |
|---|---|---|
| A — local correctness / cross-module handoff | PASS | Registry authority and candidate transition now share the required commit boundary. |
| B — retry / distributed boundary | PASS | Invalid/stale target identity is rejected rather than false-acknowledged. |
| C — UI rule mistaken for server rule | PASS | Target identity and version authority are enforced in server-side functions. |
| D — current state vs historical evidence | PASS | Real grouped transitions retain durable activation/rollback events. |
| E — authority accretion / legacy reachability | PASS | Prior legacy production writer bypass remains revoked; migration 026 does not reintroduce an alternate writer. |
| F — self-confirming tests | PASS WITH LIMITATION | The new DB fixture challenges malformed target identities and CD supplied an actual two-session lock test. Extreme multi-key contention remains not independently stress-tested but does not expose a silent-corruption path in the reviewed model. |

## 7. Gate disposition

**Sprint4 Asset Manager V2 = VERIFIED PASS.**

All Sprint4 findings through `S4-RC-003` are now `FIXED_VERIFIED`.

Deployed migrations `018–026` are immutable. The next unused migration is **027**.

The next canonical roadmap scope is:

`Sprint5 — ACT 6–8 + visual-dynamic UI`

CD may proceed with Sprint5 within the current canonical V4.0 / Codex V2.3 scope. No broader gameplay redesign is authorized by this PASS.

## 8. Next-Scope Failure Forecast — Sprint5

| Risk ID | Next-scope area / interface | Why this area is high-risk | Invariant / failure class to watch |
|---|---|---|---|
| S5-RISK-01 | ACT6 DiscussionRoom revote + fallback | ACT6 adds a second vote round after a 1:1:1 tie and then a system fallback. Prior project defects show stale requests can cross round boundaries. | A message/vote from an old round must not be reinterpreted in the new round; fallback must remain system provenance, never a player vote. |
| S5-RISK-02 | ACT7 repeated Clock vote rounds | The clock puzzle can repeat indefinitely after 1:1:1 ties and also maintains wrong-attempt/hint progression. | One player action per round; tie means no clock touched; retry/reconnect must not duplicate physical action, attempt count or hint progression. |
| S5-RISK-03 | Dynamic clock / portrait overlays + Asset Manager | Sprint5 is the first gameplay scope that materially consumes anchor-dependent dynamic overlays and ACTIVE asset versions. | Overlay geometry must correspond to the resolved ACTIVE asset/version; missing/fallback assets must not silently place exact UI on unrelated geometry or block core progression. |
| S5-RISK-04 | ACT8 private first choice vs final route vote | ACT8 intentionally records private behavior stance before later group resolution. | The LOCKED private first choice must remain immutable and distinct from the final route vote; C/D initial stance must not be overwritten by group outcome. |
| S5-RISK-05 | ACT8 asymmetric information / SHARE PHOTO | Linda's Closure Order is private unless she actively shares it, while map/photo evidence is group-visible. | Private knowledge must not become group-visible merely because the scene opens; sharing must preserve provenance and must not imply transfer of physical ownership. |
| S5-RISK-06 | ACT8 Main Gate / West Tower branch fold-back | Two local branches must converge on Great Hall while preserving which branch was actually taken. | Reconnect and concurrent progression must converge on one server-authoritative `route_taken_act8` and one Great Hall entry; no double consequence or branch overwrite. |
| S5-RISK-07 | Existing Teacher Override boundary | Current canonical override allowlist explicitly ends at ACT5. Sprint5 introduces ACT6–8 state into the same runtime. | Existing override RPCs must continue to reject ACT6–14 rather than accidentally treating new scenes as supported generic phases. |

The forecast identifies risk areas and invariants only; implementation mechanics remain CD-owned.
