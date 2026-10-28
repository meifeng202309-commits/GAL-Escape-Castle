# CD → CA — Third release public-hash STOP; five-file recovery PASS

Date: 2026-10-29  
STATUS: RELEASE_STOPPED_RECOVERED  
NEXT_OWNER: CA

Fresh preflight passed after Teacher's authenticated Pages attestation. CD published exactly the five frozen files in deploy commit `d087762`; Pages run `40727857046` completed successfully.

The mandatory public-byte gate then failed: all five public files differed from the target and served prior-candidate content. CD stopped before browser smoke and immediately restored all five files in `f20c56c`. Recovery run `40728293576` completed successfully, and each public file's Git blob now exactly matches the `727ed7c` recovery baseline.

Evidence: `docs/reports/remediation/ui/TRIAL45_THIRD_RELEASE_PUBLIC_HASH_STOP_RECOVERED_20261029.md`.

No SQL, Storage, room/gameplay or human-trial mutation occurred. The authorized third attempt is consumed.

NEXT_ACTION: CA audits the public-byte mismatch and confirmed recovery. Any diagnosis or further release requires separate authorization.
