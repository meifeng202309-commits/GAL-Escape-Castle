# Teacher Trial Two-Phase Independent Audit

## Audit identity

- Audit owner: CA
- Trigger: `agent-comms/GA_to_CA_20260927T060500Z_teacher-trial-two-phase-independent-audit-request.md`
- Teacher evidence: original `GAL问题报告.pptx` + repository mirror
- Previous CA trial-release baseline: `6b8730f999a7de4aa58f0444d9a2f75f76377302`
- Current pinned repository baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`
- Remediation routing: HOLD pending Teacher/GA discussion
- Trial disposition: PAUSE repeated Teacher trials until startup/runtime findings are dispositioned

---

# Phase A — Post-CA-130 media / asset audit

## Audited interval

Primary interval:
`6b8730f999a7de4aa58f0444d9a2f75f76377302 .. bbf16f5e1abb4b84ae95bf84739d9ab86261c820`

Relevant work independently identified includes, among others:

- `0704af2f` — seven legacy WebP candidates made reachable
- `fbf5e734` — CD mechanical staging of seven recovered legacy visuals
- `2f7c177d` — six Sprint9 audio v001 candidates staged
- `aa8ec910` — mechanism clang v002
- `1179c435` / later transport repair chain — old alarm bell v002
- `3bcf4ee4` — snakes approaching v002
- `b3b498f4` — gate opening v002
- `3619bb21` — wet scraping + short hiss v001 review closure
- `05631561` — Portrait Hall pair + remaining image review closure
- `2662c18b` — Main Gate v002 canonicalization and mechanism-clang mismatch discovery
- `bbf16f5e` — mechanism clang v002 binary integrity repair

## Phase A disposition

### A-PASS-01 — Candidate-layer ownership / review separation: PASS

Observed pattern is consistent with the current authority model:

- VA performs production/recovery/staging/review metadata work.
- Teacher approval is recorded before APPROVED state.
- CD retains runtime publication / ACTIVE authority.
- Main Gate v002 mechanical canonicalization by CD occurred after an explicit VA handoff of exact approved source identity and mechanical staging parameters; no new visual semantics or approval were invented by CD.
- Portrait Hall base + overlay remain a paired candidate group with explicit anchor metadata.
- Mechanism clang transport corruption was detected by CD rather than silently accepted, then repaired by VA against the already approved identity.

Canonical Ownership Check for the reviewed candidate work: PASS.

### A-PASS-02 — Immutable version handling: PASS

The reviewed replacement assets use successor versions rather than overwriting historical approved/review candidates:

- Main Gate v001 corruption -> v002 repair
- selected replacement audios -> v002
- historical v001 candidates preserved

### A-MEDIA-001 — MEDIUM — Final candidate-set integration closure is incomplete

At pinned baseline `93bd15ca...`, the registry still has only one non-null runtime ACTIVE version:

- `shared.library active_version = 1`

All other runtime-required images/audio remain `active_version = null`, including newly approved Portrait Hall pair, Main Gate v002, and all six audio identities.

The final mechanism-clang repair commit returned ownership to CD for revalidation/publication, but there is no subsequent CD integration/publication baseline before the User-directed audit hold.

This is **not** a violation of the placeholder-first trial strategy and is **not** evidence that the candidate work is wrong. It is a readiness gap: recent media work is staged/reviewed but not yet a completed integrated runtime asset set.

Affected owner: CD for revalidation/publication; VA only if a candidate-level defect is later found.

Phase A overall:
`PASS candidate governance / BLOCKED final runtime integration completeness`.

---

# Phase B — Comprehensive independent current-product audit

## Evidence sources

- Current player root runtime source
- Current Teacher Console source
- current database migrations through 058
- prior CA closure history through CA-130
- post-CA-130 repository diff
- original Teacher PPT screenshots
- repository evidence mirror

The PPT was independently inspected. The screenshots show:

1. one joined player already sees `Scene 1 — Wake Up` and generic choices;
2. all roles show the same three legacy choices;
3. after all three submit, player UI shows all three choices;
4. Teacher Console shows `Run started: <run_id>` while the run badge still says `No active run`, followed by `Sprint 3B initialization failed: No active formal run.`

## B-001 — HIGH — Legacy Sprint1 gameplay is exposed as the production pre-run fallback

Current player code always requests both Sprint1 and formal-run state.

When `s2_get_player_state.active == false`, it executes:

`renderState(sprint1State)`

Room creation initializes Sprint1 room state immediately at Scene 1 / collecting. Therefore the first player who joins can see a playable-looking Scene 1 before the other two players join and before any formal run starts.

The legacy path:

- has no canonical ACT1 opening media binding;
- uses the generic legacy `src/content/scenes.js` scene;
- exposes interactive choices immediately.

This independently confirms Teacher observations 1 and 2.

Affected owner: CD/runtime.

## B-002 — HIGH — Legacy Sprint1 reveals private first choices player-to-player

The legacy Sprint1 database changes room phase to `revealed` after three legacy private choices.

`s1_get_player_state` then returns all three decisions to every player.

`renderState` renders:

`Choices revealed`

with every player's choice.

The formal ACT1 path is different and role-specific; the privacy failure belongs to the exposed legacy fallback, not to the canonical ACT1 implementation.

This violates the current ACT1 privacy requirement that first-action content remain private from other players.

Affected owner: CD/runtime.

## B-003 — HIGH — Formal startup is structurally non-atomic and can strand an active run without canonical flow

Teacher Console exposes two independent operations:

1. `s2_start_run`
2. `s3b_initialize_flow`

They are separate button actions and separate server transactions.

If step 1 succeeds and step 2 fails, the room can have an active formal run but no initialized ACT1-5 canonical state.

The player client then detects an active formal run and immediately expects `s3b_get_player_state` to be active with a scene. If it is not, the client throws:

`Formal game state is unavailable. Retry before taking another action.`

Thus the startup contract itself permits a stranded intermediate state.

This finding is independent of the exact cause of the Teacher's observed deployment failure.

Affected owner: CD/runtime architecture.

## B-004 — HIGH / LIVE-STATE DIVERGENCE — Teacher's observed "Run started" + "No active run" state contradicts the pinned static contract

Current source says:

- `s2_start_run` creates a `game_runs` row with `status='active'` after verifying all three joined;
- the function returns only after the insert;
- `loadDiscussionState` immediately calls `s2_get_teacher_state`;
- `s2_get_teacher_state` calls `s2_get_active_run`, which selects the newest active run.

Under one consistent deployed database/schema, the observed sequence:

`Run started: <run_id>`
then
`No active run`
then
`Sprint 3B initialization failed: No active formal run`

should not occur.

The Teacher screenshot is direct live evidence that the actual trial environment was not behaving according to the pinned static contract.

This audit does **not** assign an unverified root cause such as "wrong Supabase URL", stale deployment, schema drift, or race. Live/deployed-state reproduction is required to distinguish those possibilities.

Evidence status: LIVE OBSERVED, STATIC ROOT CAUSE UNRESOLVED.

Affected owner: CD/deployment/runtime integration.

## B-005 — MEDIUM — Obsolete Sprint1 controls remain live on the production Teacher Console and can mutate shadow state

The root Teacher Console still exposes legacy controls:

- `Advance scene` -> `s1_advance_scene`
- `Reset room` -> `s1_reset_room`
- legacy Sprint2 reusable DiscussionRoom controls

`s1_reset_room` resets only Sprint1 decisions/room state. It does not reset the formal run or canonical ACT1-14 state.

Therefore the live Teacher page can mutate a shadow legacy state independently of the formal game.

Even when this does not corrupt the formal run directly, it creates contradictory operator state and increases the probability of exactly the type of split-surface confusion seen in the Teacher trial.

Affected owner: CD/UI/runtime.

## B-PASS-01 — Formal ACT1 role-specific content is present in current canonical runtime

The canonical path contains separate role-specific choices:

- GAL-A: map/sound/number-note/search
- GAL-B: diary/door/phone/vent
- GAL-C: notice/watch/star-key/mirror

The database validates those choices by role.

Therefore "all three have the same options" is not a defect in the canonical ACT1 script. It is evidence that the wrong legacy runtime surface is being shown.

## B-PASS-02 — Formal ACT1 opening image/placeholder binding exists

The formal renderer binds:

- GAL-A -> `opening.gitte_room`
- GAL-B -> `opening.anna_room`
- GAL-C -> `opening.linda_study`

and uses the existing placeholder fallback when no ACTIVE asset exists.

The missing image in Teacher slide 1 is therefore also diagnostic of the legacy fallback surface.

## B-PASS-03 — Previously closed ACT2-ACT14 data-integrity findings remain closed in repository history

No post-CA-130 runtime/database change was found that reopens the previously independently closed:

- ACT1-5 Teacher Override allowlist/integrity findings;
- ACT6-13 integrity/evidence findings;
- ACT14 finalization/export findings;
- placeholder resolver telemetry closure.

The post-CA-130 substantive changes are media/staging/governance work, not a rewrite of those closed runtime contracts.

This does not replace a full live end-to-end replay; it means no repository delta was found that invalidates the prior closures.

## B-EVIDENCE-01 — MEDIUM — Current regression evidence did not protect the real pre-run startup surface

Prior automated/static evidence was strong around canonical-flow internals and asset fallback, but the Teacher's first manual run immediately reached a legacy path that those tests did not exclude.

This is an audit-coverage defect:

- tests proved the formal path;
- they did not prove that the root user-facing page cannot enter the obsolete path before formal start;
- they did not prove a single coherent startup sequence from room creation -> three joins -> formal run -> canonical ACT1.

Affected owner: CD for product-level E2E regression coverage; CA should verify independently on re-audit.

---

# Overall findings

| ID | Severity | Summary | Owner |
|---|---|---|---|
| A-MEDIA-001 | MEDIUM | Recent approved media are staged but final CD revalidation/publication/ACTIVE integration is incomplete | CD |
| B-001 | HIGH | Legacy Sprint1 gameplay exposed before formal run | CD |
| B-002 | HIGH | Legacy Sprint1 reveals private first choices to players | CD |
| B-003 | HIGH | Formal startup is two-step/non-atomic and can strand active run without canonical flow | CD |
| B-004 | HIGH | Teacher live environment contradicted static active-run contract; deployed-state cause unresolved | CD |
| B-005 | MEDIUM | Legacy Teacher controls mutate shadow Sprint1/Sprint2 state on production console | CD |
| B-EVIDENCE-01 | MEDIUM | Regression suite did not protect real room->join->formal-start root path | CD / later CA verification |

Canonical Ownership Check: PASS for audited recent media candidate work.

---

# Trial disposition

`PAUSE repeated Teacher trials`

Reason:

The issue is no longer media completeness. The placeholder-first asset strategy remains valid.

Trials should remain paused because the currently exposed startup path can:

- begin gameplay before all players are ready;
- expose the wrong role content;
- violate private-choice isolation;
- enter a stranded formal-run state;
- present contradictory Teacher run status.

Resume should follow Teacher/GA discussion and subsequent bounded remediation/re-audit.

---

# Remediation routing

Per User instruction:

- no remediation instructions are sent to CD/VA by this audit;
- report goes to GA only;
- likely owning roles are identified, but implementation design is intentionally not prescribed.
