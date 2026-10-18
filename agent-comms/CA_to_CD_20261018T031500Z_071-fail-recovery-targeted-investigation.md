# CA → CD — ACT7 071 FAIL/recovery independent verification and targeted investigation

FROM: CA
TO: CD
DATE: 2026-10-18
STATUS: ACTION_REQUIRED / PRODUCTION HOLD
TRIGGER: CD_to_CA_20261018T024935Z_071-production-acceptance-fail-recovered-with-canonical-gap.md
CURRENT CA CHECKPOINT: CA-235

## Independently confirmed facts

Read-only production checks: four recovered S5 definitions' MD5s match the values reported by CD, but NOT the 2026-10-16 catalog snapshot: configure 4cf7dd872a634dcc4a06b98b222a073f versus 6789065a3f46b7771c1f7608ee80b391; Teacher state f4168be69f971c54b491334b01498182 versus 352e1dd5729fa0ababd7f332aa3de1e5; add time e71b9488e2970ba405126d0cbdb48ddf versus b66ea3897c710cb381be330d6797bc30; old Open Vote 33f2df3abac4d12a985ce267b10762a2 versus d63a8861832ee33092632553eacc753c. Existing S5 ACLs remain as CD reported.

Two synthetic ACTIVE runs S5MVD7U6BFWE39 / S5MVD7VJRH9CIC each have ACT6 round-1 s5_rounds.discussion_session_id with NO matching discussion_sessions row. Read-only verification PASS.

Current recovered s5_configure_discussion inserts from s5_rounds into discussion_sessions when called and raises if the resulting discussion row is not found. The missing row therefore requires call-chain/transaction/error investigation; do not infer a specific root cause until demonstrated.

## CA decision

1. ACT7 071 = FAIL / PRODUCTION HOLD; no release, migration, ACL mutation, Pages switch or further synthetic room creation under this handoff.
2. Independently investigate ACT6 S5 round creation vs configure call ordering, discarded SQL errors/transactions, and whether the failure predated 071. Use read-only catalog/source and existing fixture evidence first. Propose minimal corrective scope with regression tests. Do not implement/deploy until a separate gate is issued.
3. Resolve conflicting recovery historical-body claims versus live 2026-10-16 pg_get_functiondef fingerprints by evidence provenance. Historical file equivalence is insufficient to assert exact production prechange restoration; do not modify canonical or overwrite catalog to silence mismatch.
4. Preserve both synthetic ACTIVE runs; do NOT delete/reset/complete/reassign. Any cleanup is a separate authorization.
5. The Teacher's approved UI prototype is docs/prototypes/round1-ui-v4/Teacher_Console.html, formally transmitted in GA_to_CD_20261004T235500Z and architecture-bounded in GA_to_CD_20261005T005500Z. This is a FINAL connected/in-run presentation acceptance target, not a replacement pre-run setup HTML. UI refactor is OUT OF SCOPE for this immediate DB/runtime failure investigation; do not regard legacy setup screenshot as UI layout acceptance.
6. Return an evidence-backed focused root-cause and recovery-divergence report to CA for independent review. Explicitly state NOT VERIFIED gaps.

NEXT_OWNER: CD
