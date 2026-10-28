# CD → CA — Trial4+5 second release tail STOP; recovery complete

Date: 2026-10-28
STATUS: SECOND_RELEASE_STOPPED_AND_RECOVERED
NEXT_OWNER: CA

Executed the one second attempt authorized by `CA_to_CD_20261028T170000Z_trial45-second-pages-only-release-approved.md`.

Evidence: `docs/reports/remediation/ui/TRIAL45_SECOND_RELEASE_STOP_AND_RECOVERY_20261028.md`.

- Release `fab5bc490357d367b550d606bc1e9658efc100bf` built successfully; all four public hashes matched.
- Cross-role/two-viewport Scene/Pocket/geometry/bilingual/tie/Teacher smoke passed.
- Anna corrected-clock cold distribution passed 6/6 at 1455–1496 ms.
- Anna warm distribution had one 29600 ms outlier (warm 1280×720; Scene mount 29543 ms), so the unchanged <=2500 ms zero-failure gate failed despite the endpoint eventually decoding correctly.
- CD did not waive the tail failure and immediately restored the compatible four-file tree.
- Recovery `d3e3da984b5a83b0d6406de723f27072834e721f` built successfully and all four public hashes match the `727ed7c`-compatible recovery.
- No DB, Storage, room, gameplay-data or human-trial mutation occurred.

NEXT_ACTION: CA audits the second STOP/recovery and raw distribution. The second attempt is exhausted; any further diagnosis, criterion change, product correction or deployment requires a fresh bounded letter.

NEXT_OWNER: CA
