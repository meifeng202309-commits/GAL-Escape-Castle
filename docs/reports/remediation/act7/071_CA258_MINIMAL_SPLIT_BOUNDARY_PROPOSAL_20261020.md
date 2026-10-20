# CA-258 minimal split-boundary proposal

Timestamp: 2026-10-20T08:05:00Z
Status: **PLANNING ONLY / PRODUCTION HOLD**

## Boundary contract

One operation ID binds every artifact, connector query/result, Node proof and Teacher acknowledgement. A single networked Node process starts before the first mutation, performs the pre-mutation Supabase HTTP probe, remains alive while external SQL/Pages stages occur, then performs candidate byte proof, second Supabase probe and fixture. It does not claim that Supabase connector SQL ran in its process; it accepts only durable, verified cross-boundary receipts.

| Stage | Existing tool / owner | Required durable receipt | Gate before next stage | STOP / recovery |
|---|---|---|---|---|
| 0. Authorization and paths | CA/Teacher + CD; existing env/artifact paths | exact authorization reference, operation ID, source commit; absolute paths for prefreeze, network, candidate, rollback and SQL receipts | all paths unused/writable; flags and exact commits pinned; Teacher sends exact readiness token | any absence: STOP before mutation |
| 1. Node preflight | persistent external-network Node / CD | process fingerprint and HTTP Supabase response artifact; exact GitHub candidate/rollback ref reads | same Node PID/context retained; Supabase returns an HTTP response; refs match | Node/network loss: STOP before mutation |
| 2. Catalog snapshot | Supabase `execute_sql` connector / CD | verbatim six-row JSON including operation ID, query SHA-256, owner/definer/search path/body hashes/raw ACL/effective privileges; local artifact digest and immediate identical connector re-read | both connector reads identical; artifact re-read/digest valid; saved matrix equals approved envelope | mismatch/tool loss: STOP before mutation |
| 3. Admission freeze | Supabase connector / CD | exact freeze SQL SHA, connector completion response, and post-freeze six-row effective-deny read; receipt digest | all six effective admission grants denied exactly; Node validates receipt operation/stage/query/result digests | failure/ambiguity: keep admission closed if possible; incident path |
| 4. Migration 071 | Supabase connector / CD | pinned migration SHA, completion response, exact post-migration signature/catalog and required invariant reads; receipt digest | migration identities and read-only invariants match reviewed packet | failure: Node STOP; Teacher keeps/returns rollback Pages; connector runs pinned recovery then ACL restore and exact catalog compare |
| 5. Candidate Pages | human Teacher using existing GitHub Pages UI | exact `PAGES_CANDIDATE_SAVED` acknowledgement with operation ID/time, followed by live Actions run identity | persistent Node independently verifies candidate branch/commit, successful workflow and all five HTTP 200 SHA-256 bytes; writes candidate proof | Teacher unavailable/timeout or any proof failure: explicit rollback instruction; do not restore ACL |
| 6. ACL restoration | Supabase connector / CD | exact restore SQL SHA, completion response, six-row catalog/effective privilege result and digest | result must equal durable prefreeze matrix byte-for-byte after normalization; candidate proof must already exist | mismatch/tool loss: incident; keep/return Pages rollback; do not run fixture |
| 7. Pre-fixture gate | same persistent Node / CD | second network artifact plus re-read of prefreeze, SQL-stage and candidate artifacts | same visible process fingerprint; Supabase HTTP reachable; every receipt shares operation ID and ordered timestamp | Node/network loss: rollback Pages; connector recovery SQL + ACL restore + catalog compare |
| 8. Controlled fixture | same persistent Node / CD with Teacher evidence pauses | existing fixture evidence plus Q0/Q1–Q4 records | only the reviewed coordinated fixture entrypoint; no direct CLI | any failure: rollback Pages, pinned recovery SQL, exact ACL restore/catalog compare; retain synthetic evidence pending disposition |
| 9. Close | Node + connector + Teacher | rollback-or-candidate final Pages proof, final catalog/invariants/Q0 and incident/closure record | CA receives exact baseline and complete artifact digests | missing evidence means NOT VERIFIED, never PASS |

## Trusting SQL across the process boundary

Connector output is treated as evidence, not as an in-process return value. Each SQL stage must use the exact reviewed SQL or read-only query and produce one append-only receipt containing: schema version, operation ID, stage, UTC timestamps, exact SQL/query SHA-256, connector result JSON, pre/post catalog rows where applicable, previous-receipt SHA-256 and receipt SHA-256. The result is copied verbatim from the connected tool response, persisted atomically, re-read, and for mutation stages corroborated by a separate deterministic read-only connector query. The persistent Node process validates the receipt chain and expected values before proceeding; it does not attest connector process identity.

## Candidate gate and recovery invariant

ACL restoration is forbidden until the same persistent Node has resolved the exact candidate Actions identity and all five public hashes. A Teacher acknowledgement alone is never sufficient. At any later failure, Pages rollback proof precedes recovery SQL and ACL restoration; final catalog must equal the prefreeze snapshot.

If the SQL connector becomes unavailable after freeze, no other tool is allowed to guess completion or restore admission. Teacher restores/keeps rollback Pages, admission remains closed, the operation becomes an incident, and CA/Teacher must restore the approved SQL channel before database recovery can continue.

## Minimum additional mechanism

Existing candidate/network/catalog artifacts and exact Teacher tokens are almost sufficient, but the current adapter cannot consume an external connector result. The minimum additional mechanism is **one small receipt schema plus a resume validator in the existing gate module**—not an event bus, daemon or new deployment framework. It would validate the append-only SQL receipt chain, exact SQL hashes, operation ID, stage order and corroborating read results before allowing the persistent Node state machine to resume. This proposal does not authorize implementing it.

No SQL, ACL, Pages, fixture, credentials or production flags were changed. One prior attempt remains consumed.

NEXT_OWNER: CA / Teacher — accept, revise or reject this cross-boundary receipt contract and decide whether the minimal resume validator may be implemented. Production remains HOLD.
