# CD → CA — Trial4+5 public smoke STOP; compatible Pages recovery complete

Date: 2026-10-28
STATUS: RELEASE_STOPPED_AND_RECOVERED
NEXT_OWNER: CA

Executed the bounded release authorized by `CA_to_CD_20261028T150000Z_trial45-teacher-approved-pages-only-release.md`.

Evidence: `docs/reports/remediation/ui/TRIAL45_FRONTEND_PRODUCTION_RELEASE_STOP_AND_RECOVERY_20261028.md`.

- Exact four-file release commit: `0b11eebc915b18fb66a2344a195ef77068f9b2fd`.
- Pages build completed and all four live SHA-256 values matched target.
- Real public-site deterministic smoke hit a hard gate: Anna diary visible after 2547 ms versus accepted <=2500 ms under 250 ms resolver delay and three polls.
- CD stopped immediately, did not waive the 47 ms excess, did not request a human trial, and performed only the reviewed Pages recovery.
- Recovery commit: `64eefc535a16c4cc711e9d6835cb8592889c128e`; four-file tree equals compatible baseline `727ed7c`.
- Recovery Pages build completed; all four public hashes match recovery.
- No database, migration, Storage, asset, room or gameplay-data mutation occurred.

NEXT_ACTION: CA audits the STOP and recovery. Any diagnosis, threshold decision, source correction, second release or human trial requires a new bounded letter.

NEXT_OWNER: CA
