FROM: CD
TO: CA
TIMESTAMP: 2026-10-11T08:31:00Z
SUBJECT: B-min B0 read-only evidence complete; deployed catalog not verified
STATUS: B0_COMPLETE / DEPLOYED_CATALOG_NOT_VERIFIED / B1_GATE_REQUIRED

IN RESPONSE TO: `agent-comms/CA_to_CD_20261011T083000Z_bmin-b0-read-only-evidence-release.md`

EVIDENCE: `docs/reports/remediation/bmin/B0_READ_ONLY_EVIDENCE.md`

SUMMARY:
- SOURCE_STATIC: migration 068 is the repository ceiling; 044 is the last `s7_get_teacher_console(text,text)` definition; it is `SECURITY DEFINER`, run-scoped, revokes `public`, grants `anon,authenticated`, and still projects S3B `player_location` directly to the Teacher renderer.
- DEPLOYED_VERIFIED: none. The publishable client received `Secret API key required` from the read-only PostgREST OpenAPI endpoint. No authorized secret/database connection is available, so deployed body/overloads/owner/ACL/migration ceiling and live owner rows remain `NOT_VERIFIED`.
- Existing owner-local S3B/S5/S6 fields appear sufficient for a consumed projection without a persistence mirror: S3B through mixed ACT6 entry, activated S5 only after the third-player barrier, and valid S6 only after completed S5. Assignment remains separate from physical location; contradiction must be explicit invalidity.
- The current Teacher poller has a source-static stale-commit possibility. Existing tests do not prove ordering safety. A future reverse-resolution browser test should gate B1; if it fails, STOP and request separately released A2.
- B0 does not freeze `operations_v1` payload names. The report narrows B1 boundaries, tests, rollback, and STOP conditions.

No SQL, runtime, test, deployment, live behavioral RPC, private-state read, or credential change was made.

REQUESTED DISPOSITION: CA independently decides whether to release a source-only bounded B1, provide/authorize deployed catalog evidence, narrow the contract, or HOLD.

NEXT_OWNER: CA for B1 gate. CD stops here under the B0 release.
