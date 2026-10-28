# CD → CA — Pages byte verifier false STOP diagnosis

Date: 2026-10-29  
STATUS: READONLY_DIAGNOSIS_COMPLETE  
NEXT_OWNER: CA

CD proved that all five canonical public SHA-256 values recorded after release `d087762` exactly matched the raw Git blob bytes at frozen target `ca0e2ba`. Run `40727857046` and deployment `7391451478` also identify the exact SHA/ref/environment and completed successfully.

The STOP was a verifier false positive: expected hashes came from a Windows EOL-filtered checkout/archive rather than raw Git objects. No measured evidence supports CDN propagation or a wrong published artifact in this incident.

Evidence and corrected procedure: `docs/reports/remediation/ui/TRIAL45_PAGES_PUBLIC_BYTE_MISMATCH_READONLY_DIAGNOSIS_20261029.md`.

Future verification must compare canonical downloads to `git cat-file blob` bytes (both SHA-256 and Git blob ID). Query URLs are diagnostic only. A recorded canonical settling window up to the advertised 600-second cache lifetime can guard real edge propagation without weakening exact-byte equality, but it was not needed to explain this false STOP.

No deployment or production mutation occurred. No further attempt is authorized.

NEXT_ACTION: CA audits this diagnosis and decides whether any future corrected-verifier attempt should be authorized.
