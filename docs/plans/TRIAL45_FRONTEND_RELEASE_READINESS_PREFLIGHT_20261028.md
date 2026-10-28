# Trial4+5 corrected frontend — read-only release-readiness preflight

Date: 2026-10-28  
Authority: `CA_to_CD_20261028T130000Z_trial45-p7-pass-readonly-release-preflight-and-display-v11.md`  
Disposition: **READY FOR CA RELEASE-AUTHORIZATION REVIEW; NO RELEASE AUTHORIZED HERE**

## Frozen target and deployed baseline

The P7-accepted product target is `8594f2e`. Product files have no drift between it and governance head `e929aadec68d512445dc39e36ff8658ac6d1c9d9`. Production Pages remains `deploy/trial4-player-act9-20261027@727ed7cd360c970b20874c7d5d0fc1b64826a92b`; public-byte readback still matches that older release.

| Runtime file | Target Git blob |
|---|---|
| `teacher.html` | `d07667b2fa3eac5d8d168d52136fa7db647ec697` |
| `src/game/app.js` | `692fc8a39a3151a888f52694d3e2aa059b44ae9a` |
| `src/styles/app.css` | `5b0a0fa18042b469084a59397088927fe259d65f` |
| `src/content/localization.generated.js` | `dc644f4a8fba6e583d4764f38f0cba44a55b575e` |

The canonical localization CSV is source provenance, not a browser-served dependency. `index.html` and `src/teacher/teacher-console.js` are unchanged. No database, migration, Storage object, asset publication or test fixture belongs in the release payload.

## Server authority and publication dependency

Read-only production Supabase checks for `qdcbdcjobzytzhnhfwyn` confirmed receipt `20261027151620_act9_normal_teacher_paced_vote_073`; all five effective migration073 signatures (open, refresh, guarded close, Player state, Teacher Open Vote); owner `postgres`; `SECURITY DEFINER`; expected ACLs; and required `s6_get_player_state_pre072(text,text)`.

The target therefore needs no SQL, schema, migration054+, RLS, Storage or room mutation. Pages is branch/root based; repository workflows are PostgreSQL gates rather than a Pages publisher. A later authorization must permit an exact candidate/selector update and require an authenticated Pages configuration/head read immediately before mutation.

## Impact and authorized-release sequence

Impact is frontend-only: Player Scene/media lifecycle, five-region layout, Pocket, ACT9 notice/scroll, localization, and Teacher shell layout. RPC authority and migration073 do not change.

1. Reconfirm target blobs, candidate SHA, authenticated Pages branch/root, migration073 envelope, recovery ref, public assets, and zero recent gameplay/open-discussion activity.
2. Publish only the exact frontend candidate. Run no SQL and mutate no Storage.
3. Require a successful Pages build and exact public-byte readback.
4. Run the public smoke below. No human trial before all smoke gates pass.
5. Return receipts to CA before Teacher trial handoff.

## Required public smoke

- Gitte, Anna and Linda at 1280×720 and 1366×768: all five regions, no overlap/clipping, 11pt bilingual presentation.
- Delayed resolution and repeated polling: each visible image decoded with positive `naturalWidth`/`naturalHeight`; map, diary, number note and star-key routes correct.
- Role-specific Pocket counts/visibility; Linda 3/3; inactive items non-interactive; reconnect/poll preserves active state.
- Teacher top/setup ordering, compact V4 geometry, Recovery/Maintenance default-collapsed, critical controls usable.
- ACT9 NORMAL Teacher-paced without client countdown authority; AUDIT timing retained; polling preserves scroll.
- Protected tie notice: exact NL/ZH copy once, only after authoritative round-1 `no_consensus` and before round-2 guidance; absent in round 1; stable through polling/reconnect.
- Candidate equivalence for HTML/JS/CSS/localization plus HTTP 200 and expected content type for referenced media.

## Recovery and STOP

The compatible Pages-only recovery target is current `727ed7cd360c970b20874c7d5d0fc1b64826a92b`, already verified with migration073. Do not select older pre-073 frontend `6278056` while migration073 remains active.

STOP on source/blob, selector, head or public-byte drift; missing/mixed migration073 functions/dependency/ACL; any DB/Storage/room repair need; recent gameplay/open discussion activity; asset/build/mixed-cache failure; any Player/Teacher smoke failure; unavailable exact recovery ref; or a human-trial request before smoke closure.

Conclusion: technically publishable as a Pages-only release against active migration073, but production remains on the older frontend. No production mutation occurred. `NEXT_OWNER: CA` for one release-authorization decision.

Validation on this documentation-only preflight: migration073 static and NORMAL/AUDIT policy tests PASS; `git diff --check` PASS. The already-accepted P7 browser evidence remains the browser gate; a redundant rerun on this checkout was unavailable because Playwright is not installed, and no dependency installation was authorized or needed for this read-only task.
