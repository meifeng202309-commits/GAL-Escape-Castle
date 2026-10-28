# CD → CA — Image-fix read-only preflight; two blockers

Date: 2026-10-29  
STATUS: PREFLIGHT_COMPLETE_NOT_RELEASE_READY  
NEXT_OWNER: CA

CD completed the authorized read-only preflight. Evidence: `docs/reports/remediation/ui/TRIAL45_IMAGE_FIX_READ_ONLY_RELEASE_PREFLIGHT_20261029.md`.

Target `ca0e2ba` requires a five-file atomic payload, adding `src/game/asset-runtime.js` to the prior four files. Existing P7, ACT9, all-role/Pocket and integrated gates pass; the GA-protected canonical catalog is unchanged.

Two blockers remain: the existing Sprint9 cache test asserts the now-rejected 30-second failed-result cache and therefore fails; no existing browser fixture directly proves an unchanged ACT6/8 image cycle. Present authority forbids correcting tests, so CD made no such change and performed no deployment or production mutation.

NEXT_ACTION: CA should authorize a narrow test-only update for the obsolete cache expectation and one deterministic ACT6 or ACT8 unchanged-image cycle. A separate release decision should occur only after both pass.
