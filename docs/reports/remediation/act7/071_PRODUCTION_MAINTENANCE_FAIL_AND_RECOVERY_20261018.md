# Migration 071 production maintenance — FAIL and recovery evidence

Timestamp: 2026-10-18T02:49:35Z  
Project: `qdcbdcjobzytzhnhfwyn` (`main / PRODUCTION`)  
Gate: CA-234 / Teacher-authorized narrow 071 maintenance  
Disposition: **FAIL — Pages restored; SQL semantically recovered; exact catalog-MD5 reconciliation blocked by canonical conflict**

## Released candidate and preflight

- Remediation baseline: `bfd9d5e124a5315b6ed0fca77d282e766ac60863`.
- Frozen Pages baseline: `891feffe558a4683ac3da67e1e6b15e902c7e592`.
- Minimal candidate branch/commit: `deploy/act7-071-20261017@6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`.
- Candidate changed exactly `teacher.html` and `src/teacher/teacher-console.js`.
- Fresh no-activity, Pages, six-function ACL/MD5, recovery-readiness and external-operator attestation gates passed before mutation. The 577 historical ACTIVE rows were not modified.
- The six-function admission ACL freeze was applied and verified before 071. Migration 071 was applied transactionally and its five expected function identities/ACLs were verified. Pages built the exact candidate commit; public bytes matched the candidate raw bytes.
- The admission ACL was then restored exactly before controlled acceptance. All six owner, SECURITY DEFINER, definition MD5 and effective ACL values matched the immediate pre-freeze snapshot.

## Controlled acceptance FAIL

The first NORMAL synthetic fixture stopped at a harness-only projection assertion before an ACT7 action. The recorded follow-up fixture then exposed the production failure before any S5 vote:

- room `S5MVD7VJRH9CIC`, run `e5161467-afe5-4c1c-839b-3c625a1e8f8b`;
- `s5_run_state`: `act6_vote`, round 1;
- `s5_rounds` contains discussion identity `82bcf805-f45b-4e62-8238-d21ff7ef7f19`;
- the matching `discussion_sessions` row is absent;
- Teacher projection returns `sprint5_active:true` with `discussion:null`;
- identity-bound Open Vote therefore cannot begin.

The earlier stopped fixture is room `S5MVD7U6BFWE39`, run `11fe60fc-ec56-4fa0-be6f-5d1a2de42003`, with the same ACT6 round-1 missing-canonical-discussion condition. No AUDIT fixture was created after the product failure. Both synthetic runs remain ACTIVE and were deliberately not deleted or reset: `071_RELEASE_PACKET.md` states recovery does not erase gameplay/events and requires separate disposition for synthetic rows.

## Recovery performed

Immediately after FAIL:

1. GitHub Pages source was restored to `deploy/manual-acceptance-20261003` and a legacy build was triggered.
2. Latest Pages build completed at commit `891feffe558a4683ac3da67e1e6b15e902c7e592`.
3. All five frozen public SHA-256 fingerprints match:
   - `index.html`: `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4`
   - `teacher.html`: `d2f7b8f0bfc07912fb484004d2aff8a87a20d3e8d99b0f98e25fd5a28b72950f`
   - `src/game/app.js`: `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa`
   - `src/teacher/teacher-console.js`: `ce8fb816caf2c362311772a6eb70944b1c645eff18a64aad8b221aaa2dce474d`
   - `src/styles/app.css`: `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c`
4. `071_RECOVERY.sql` was executed transactionally; the six-argument Open Vote overload is absent and the four pre-071 signatures, owners, SECURITY DEFINER flags and ACLs are restored.
5. The exact six admission-function ACL/definition baseline remains restored.

## Canonical recovery fingerprint conflict

The recovered definitions are byte-equivalent to the repository historical sources used by the reviewed recovery (`032`, `031`, `045`), but live `pg_get_functiondef` MD5 does not equal `071_PRECHANGE_CATALOG_20261016.md`:

| Function | Catalog expected | Live after reviewed recovery |
|---|---|---|
| `s5_configure_discussion(uuid,text)` | `6789065a3f46b7771c1f7608ee80b391` | `4cf7dd872a634dcc4a06b98b222a073f` |
| `s5_get_teacher_discussion_state(text,text)` | `352e1dd5729fa0ababd7f332aa3de1e5` | `f4168be69f971c54b491334b01498182` |
| `s5_teacher_add_time(text,text,integer)` | `b66ea3897c710cb381be330d6797bc30` | `e71b9488e2970ba405126d0cbdb48ddf` |
| `s5_teacher_open_vote(text,text)` | `d63a8861832ee33092632553eacc753c` | `33f2df3abac4d12a985ce267b10762a2` |

Replaying the exact LF-normalized historical function blocks from migrations 032/031/045 produced the same live recovery MD5 values, so this is not a CRLF artifact. The repository claims both that those historical bodies are the prechange bodies and that the different prechange MD5 values are required. CD cannot safely invent unknown function bytes or mutate protected recovery evidence to force hashes.

## Required CA disposition

Production client is back on the frozen Pages baseline and 071 behavior is removed. CA must independently disposition:

1. the acceptance failure/root cause and whether a new canonical additive correction is authorized;
2. the conflict between the prechange catalog MD5 record and the reviewed historical/recovery source;
3. the two synthetic ACTIVE runs (separate cleanup authority is required);
4. continued HOLD versus a new narrowly reviewed maintenance packet.

Do not redeploy 071, 069, 070, or the moving remediation tree under this handoff.
