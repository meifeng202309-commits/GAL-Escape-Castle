FROM: CD
TO: CA
TIMESTAMP: 2026-10-08T02:42:19Z
SUBJECT: authority-prefreeze-deployed-evidence-complete
STATUS: READY_FOR_AUDIT

SOURCE FILES:

- `docs/audits/independent/runs/2026-10-07_authority_prefreeze_deployed_evidence/`
- `docs/plans/authority-field-audit-v2/AUTHORITY_PREFREEZE_READONLY_PROBES_V1.0.sql`
- `docs/plans/ROUND1_CANONICAL_AUTHORITY_REGISTRY_V0.3_FREEZE_CANDIDATE.md`

RELATED COMMIT:

- Evidence commit: `9f5b7eb91538560bb7555db416cecbed98ad884c`
- Branch: `remediation/sprint9-structural-v1`
- Repository comparison HEAD used during acquisition: `27faa786f634acbfb6ea6683a204513c92cf5b51`

DECISION:

The bounded deployed-state evidence acquisition authorized by `CA_to_CD_20261007T142500Z_bounded-deployed-authority-evidence-acquisition.md` is complete. Ownership returns to CA and GA. CD stops here and makes no Authority Registry, 432-field master, database, or remediation change.

OBJECTIVE RESULTS:

1. A2 returned all 11 inspected deployed routine identities. A3 returned 10 bodies; every body is `BODY_MATCH` against the repository-last definition under the documented literal-preserving, whitespace-insensitive comparison.
2. A4 confirms effective `EXECUTE` for both `anon` and `authenticated` on `s1_submit_private_choice(text,text,text,text)`.
3. B1/B2/B3: 22 registry/ACTIVE-candidate pairs are equal for each inspected field. Six audio keys have no ACTIVE candidate row and are classified `ROW_ABSENT`, never pair-equal/different:
   - `audio.gate_opening`
   - `audio.mechanism_clang`
   - `audio.old_alarm_bell`
   - `audio.snake_hiss_short`
   - `audio.snakes_approaching`
   - `audio.wet_scraping`
4. B4: all 531 catalog/group-item label pairs are equal.
5. B5: all 10 expected/deployed V4 item text-key pairs are equal.
6. B6: registry and candidate `scene_id`/`assigned_to` non-null counts are all zero.
7. B7/B7S: 577 ACTIVE runs were observed. 208 have no `s3_runtime_scene_state` row (`ROW_ABSENT`). The other 369 differ in at least one scene/phase/step mirror field (`PAIR_DIFFERENT`); none match on all three.
8. B8/B8S: all 23 completed runs have a finalization row. Twenty expose `integrity_verified=true`; three expose NULL/empty `integrity_verified`:
   - `f48fcc11-96a1-41a9-ae4d-a77c30a5aa1e`
   - `312bc91d-046f-449e-b326-f0a7887a6843`
   - `4d717b6a-906d-436a-9c2c-285fb78f3174`
9. C1/C2: six active deployed legacy choice rows remain present.

UNVERIFIED:

The fixed probes establish only direct-grant rows for the following routine identities. Their effective privilege remains `EFFECTIVE_PRIVILEGE_UNVERIFIED` because no `has_function_privilege` probe was authorized/executed for them:

- `asset_manager_activate_group(text,uuid[])`
- `asset_manager_import_candidate(text,jsonb)`
- `asset_manager_sync_registry(text,text,jsonb)`
- `asset_resolve(text)`
- `s5_get_teacher_discussion_state(text,text)`
- `s5_submit_vote(text,text,uuid,integer,uuid,text)`
- `s5_teacher_open_vote(text,text)`
- `s8_export_session(text,text)`
- `s8_export_session(text,text,uuid)`
- `s8_finalize(text,text,uuid,uuid)`

SAFETY CONFIRMATION:

**NO DATABASE MUTATION PERFORMED.**

**NO REMEDIATION PERFORMED.**

REQUESTED ACTION:

CA and GA should independently interpret the evidence for the remaining pre-freeze decisions. CD requests no implementation release and will not continue into repair without a new targeted authorization.

NEXT_OWNER: CA + GA

STOP.
