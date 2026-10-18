# Migration 071 integrated read-only predecision batch

Status: `READY_FOR_CA_FINAL_GATE_REVIEW / PRODUCTION_HOLD`

Owner: CD

Observation time: 2026-10-18T10:31:38.599461Z (database snapshot); Pages/GitHub checks followed in the same preparation session.

Authority: CA-243. No SQL/ACL/Pages/RPC/fixture/record mutation or cleanup was performed. These snapshots are predecision evidence only and do not replace the mandatory immediate preflight after any future Teacher authorization.

## 1. Source and Pages verification

- CA-242 source baseline resolves: `02fcac9f603b4245bfc8a688e9bdd2a2de45776c`.
- Pages candidate resolves: `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`.
- Frozen rollback resolves: `891feffe558a4683ac3da67e1e6b15e902c7e592`.
- Remote deploy refs point exactly to the candidate and frozen commits.
- Git diff from frozen to candidate contains only `teacher.html` and `src/teacher/teacher-console.js`.

Candidate hashes:

| Path | SHA-256 |
|---|---|
| `index.html` | `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4` |
| `teacher.html` | `628bb101a23e312d5f69d992d0c1212665350a130f1c124af04460b1afdb6cf3` |
| `src/game/app.js` | `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa` |
| `src/teacher/teacher-console.js` | `4dd355ede45e5e29619da93becb5c0e47d2e9f93c9cf544edc20e876181df1ad` |
| `src/styles/app.css` | `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c` |

All five public Pages requests returned HTTP 200 and matched frozen `891feffe…` bytes exactly; production has not switched to the candidate.

## 2. Production catalog and ACL snapshot

The four pre-071 functions remain recovered at the reviewed LF bodies:

| Signature | Raw definition MD5 | ACL summary |
|---|---|---|
| `s5_configure_discussion(uuid,text)` | `4cf7dd872a634dcc4a06b98b222a073f` | postgres/service_role; no PUBLIC/anon/authenticated |
| `s5_teacher_open_vote(text,text)` | `33f2df3abac4d12a985ce267b10762a2` | postgres/anon/authenticated/service_role; no PUBLIC |
| `s5_teacher_add_time(text,text,integer)` | `e71b9488e2970ba405126d0cbdb48ddf` | postgres/anon/authenticated/service_role; no PUBLIC |
| `s5_get_teacher_discussion_state(text,text)` | `f4168be69f971c54b491334b01498182` | postgres/anon/authenticated/service_role; no PUBLIC |

All are owned by postgres, SECURITY DEFINER and `search_path=public`. Only the legacy two-argument Open Vote exists; the 071 six-argument overload is absent.

The six admission/start signatures remain owned by postgres, SECURITY DEFINER, `search_path=public`, with the exact reviewed raw MD5s and privilege matrix:

| Signature | Raw MD5 | anon/auth/service/PUBLIC execute |
|---|---|---|
| `s1_create_room(text,text,text,text,text)` | `ddd2dc46a66b4003e4c9b1e41277c6d4` | yes / yes / yes / no |
| `s1_join_player(text,text)` | `efc37a06b7b594e6aa3a4d81e90b4c3d` | yes / yes / yes / no |
| `s9_start_formal_game(text,text,text)` | `04ebbe1608095b171540da4c5b08f5ed` | yes / yes / yes / no |
| `s1_reset_room(text,text)` | `2a72387597fea5092584934334106082` | yes / yes / yes / no |
| `s3b_initialize_flow(text,text)` | `c6170e560fc256736ce2209c528538b5` | yes / yes / yes / yes |
| `s2_start_run(text,text,text)` | `6927cc457cf7a1df5cb0bbbc28dd00a4` | no / no / yes / no |

No catalog/ACL drift was observed. This is not a freeze and must be recaptured immediately before any future write.

## 3. ACTIVE preservation and activity snapshot

- ACTIVE total: 579; excluding retained fixtures: 577; retained fixtures: 2.
- Modes: 369 AUDIT / 210 NORMAL.
- Ordered ACTIVE run/room identity digest: `32b2dded3d01c8821d8a539411840aea`.
- All monitored activity categories were zero in the preceding 15 minutes.
- The preceding 24 hours were not empty: the known 2026-10-18 controlled attempt/recovery left 96 runtime events, 8 S1 game events, 2 ACT6–13 ledger events and 6 Player last-seen updates. Their latest timestamps were approximately 02:39Z. Dialogue, S6 receipts and Teacher overrides were zero in 24 hours.
- Other non-idle client backends: 0; non-idle service_role: 0; non-idle authenticator: 0.
- `pg_cron` is absent; Supabase Edge Functions list is empty.
- GitHub Actions queued: 0; in progress: 0.

This point-in-time evidence is consistent with no recent 15-minute gameplay but cannot prove absence of open browsers, Realtime subscriptions, unlogged API attempts or external service-role holders/jobs.

## 4. Operator evidence and checklist artifacts

- Full Q0-Q4 capture and explicit missing/failed observation template: `071_OPERATOR_EVIDENCE_RECORD_TEMPLATE_20261018.md`.
- One-page execution/STOP/rollback checklist with roles and both 61-second waits: `071_OPERATOR_EXECUTION_STOP_CHECKLIST_20261018.md`.
- Governing authorization envelope: `071_PRODUCTION_REAUTHORIZATION_DECISION_PACKET_20261018.md`.

Templates deliberately use `CAPTURED_PENDING_CA`, `MISSING`, `FAILED` and `NOT_REACHED`; the operator cannot self-assign PASS.

## 5. Residual service-role and operational gaps

Blocking until a fresh Teacher decision and immediate preflight:

1. Technical tools cannot enumerate every external Supabase service-role key holder, local script, CI secret consumer or privileged human operator.
2. Four repository scripts can consume `SUPABASE_SERVICE_ROLE_KEY`: `import-asset-candidate.mjs`, `publish-asset-candidate.mjs`, `wp-r4a-post-smoke-verify.mjs`, and `wp-r4a-publish-activate-images.mjs`. Their inactivity now does not prove that all external copies/jobs are paused for a future window.
3. No new time-bounded owner attestation currently identifies all service-role users/jobs and promises quiescence for the entire freeze→deploy→accept/recover→ACL-restore interval.
4. No currently recorded uninterrupted coordinator commitment covers that future interval.
5. API gateway/Realtime visibility remains unavailable; the previously accepted residual cannot be silently carried into a new authorization and must be explicitly dispositioned again.

Therefore service-role quiescence and exclusive-window control remain `NOT_VERIFIED`; this batch does not satisfy the production start gate.

## 6. Disposition

The read-only preparation requested by CA-243 is complete. Source, Pages, catalog, ACL, ACTIVE preservation and activity snapshots are internally consistent, and operator artifacts are ready. Production remains HOLD because a new Teacher authorization and the residual attestations above are missing; after they are recorded, every time-sensitive check must run again immediately before any mutation.

NEXT_OWNER: CA — audit this combined batch and decide whether the exact Teacher reauthorization request may be issued. No production execution is requested from this handoff.
