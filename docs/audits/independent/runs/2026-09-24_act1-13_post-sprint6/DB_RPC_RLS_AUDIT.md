# DB_RPC_RLS_AUDIT — ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

## E1. Effective function-definition model

The final migration chain is additive through 036. Effective authority is derived from the last CREATE OR REPLACE / renamed wrapper in migration order.

Key supersession chains:

- Sprint2 generic DiscussionRoom: migration002 base → migration013 exact message/vote + canonical-flow wrapper.
- Sprint3B: 007 base → 008–014b integrity/remediation wrappers.
- Teacher Override: 015 base → 016 narrow correction → 017 ACT2-entry correction.
- Asset Manager: 018 base → 019–026 authority/lifecycle/group-state corrections.
- Sprint5: 027 base → 029 canonical discussion → 030 exact message → 031 focused corrections → 032 discussion creation restore.
- Sprint6: 033 base → 034 hardening → 035 guarded identities/evidence → 036 v2 request serialization + Station B progress/cinematic correction.

No migration after 036 changes the database at the frozen product baseline.

## E2. Source-level effective privileges

### General pattern

Internal SECURITY DEFINER helpers are explicitly revoked from browser roles. Browser-facing functions are granted to `anon/authenticated` but authenticate in-body using player session, Teacher token, reviewer token, or AUDIT mode as appropriate.

Notable source-level closures:
- Sprint3 historical pre013/internal resolution functions revoked;
- Sprint6 base unguarded writes revoked in 035;
- Sprint6 guarded layer revoked in 036; v2 layer granted;
- Sprint6 helper/request lock/tick/open discussion not browser callable;
- Asset import/sync/group activation/rollback service-role restricted;
- Asset internal group-transition helper revoked from service_role and invoked through wrappers.

### Live legacy/generic surfaces

Some generic Sprint2 functions intentionally remain executable:
- `s2_get_player_state`;
- `s2_open_vote`;
- `s2_add_time`;
- exact-id generic message/vote functions.

Their continued presence is not itself a defect. The defect is where generic `s2_get_player_state → s2_refresh_discussion` mutates a Sprint6-owned discussion under incompatible transition semantics (IDA-001).

### Deployment-effective ACL

The actual production `pg_proc.proacl`, table grants/default privileges and PostgREST-visible privileges were not independently queried in this run.

Result: **NOT VERIFIED** beyond source migration reconstruction.

## E3. RLS inventory

Every formal table created in migrations 001–035 is paired with `ENABLE ROW LEVEL SECURITY` in its creation migration, including:

- Sprint1 room/player/prototype tables;
- formal run/discussion/event tables;
- Sprint3 Pocket/knowledge/scene/runtime tables;
- Sprint3B state/evidence tables;
- Teacher Override tables;
- Asset Manager registry/candidate/event/reviewer tables;
- Sprint5 state/vote/round/private-choice tables;
- Sprint6 state/clue/choice/allocation/engagement/action-receipt/allocation-attempt/station-task tables.

Exception:

`public.s6_station_b_progress`

created in migration036 has no RLS enable statement and no explicit table-level revoke in that migration.

Because deployed default table privileges are unavailable to CA, direct anon/authenticated exposure is **NOT VERIFIED** rather than asserted. See IDA-003.

## E4. Constraints / business invariants

Material database protections include:

- one active formal run per room;
- immutable run identity/mode/eligibility trigger;
- discussion session unique identity;
- per-run/scene/phase/step/round/player decision uniqueness;
- one physical-item owner row per run/player/item;
- distinct shared-photo provenance rows;
- one ACT8 private choice per player;
- Sprint5 round identity + client request identity;
- Sprint6 per-player/action request receipts;
- branch role allowlists;
- Station B progress constrained to `lever_held|indicator_center`;
- ACT14 boundary separated from finalization.

Most gameplay invariants are enforced in guarded RPC code rather than CHECK constraints because they depend on current phase/branch/actor.

## E5. SECURITY DEFINER review

Inspected current authority-bearing functions use `SET search_path=public` and generally:
- resolve actor/session inside the function;
- resolve active run server-side;
- avoid caller-supplied player identity;
- bind Teacher operations to Teacher token;
- bind AUDIT helpers to run mode;
- bind asset reviewer operations to reviewer-token authority.

No dynamic SQL / caller-selected object identifier path was found in the reviewed core authority functions.

Primary cross-layer exception remains semantic ownership, not authentication: generic `s2_refresh_discussion` is authorized to mutate the shared discussion row but is not the correct owner of a Sprint6 transition (IDA-001).

## E6. Duplicate truths / multiple state layers

Intentional coexistence:
- `s1_room_state` = legacy prototype;
- `game_runs + s3_runtime_scene_state + sprint-specific state` = formal Castle runtime.

Current formal rendering prioritizes later Sprint state, but the generic Sprint2 reader remains in the refresh chain.

Potential ambiguity surfaces:
1. generic DiscussionRoom state vs Sprint5/Sprint6 discussion owners;
2. canonical scene projection vs sprint-specific current phase;
3. completed Sprint5 row remains present while Sprint6 is active;
4. legacy Sprint1 teacher controls remain visible but do not own formal runtime.

Only item 1 is confirmed as a current state-corrupting conflict (IDA-001). Items 2–4 are architectural complexity to monitor in Sprint7, not separate current findings.

## E7. Clean-schema / deployed proof

Source migration chain 001–036 is internally reconstructable.

Not independently verified:
- production catalog ACL;
- production RLS enable state after all deployment actions;
- clean-db migration replay;
- actual REST direct-access behavior for `s6_station_b_progress`.

These limitations are material specifically to IDA-003.

## Method 4 disposition

Confirmed:
- IDA-001 HIGH remains supported.

New security boundary:
- IDA-003 HIGH / NOT_VERIFIED.

No additional DB/RPC finding opened.
