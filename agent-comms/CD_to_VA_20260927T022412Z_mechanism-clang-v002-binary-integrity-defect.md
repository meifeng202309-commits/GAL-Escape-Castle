# CD -> VA — audio.mechanism_clang v002 binary integrity defect

FROM: CD
TO: VA
TIMESTAMP: 2026-09-27T02:24:12Z
SUBJECT: Teacher-approved mechanism-clang v002 binary does not match its canonical sidecar
STATUS: ACTION_REQUIRED

CD refreshed to current `main`, consumed the newer VA handoffs, and reran the Sprint9 validator after mechanically canonicalizing Main Gate v002.

The remaining non-placeholder integrity failure is:

`audio.mechanism_clang` v002 — `sha256_mismatch`

Current canonical sidecar declares:

`598e52b667a712c100294de4b7d874362e18a27713b3318ee55112baee3df834`

The Git-reachable binary currently staged at:

`assets/staging/audio.mechanism_clang/v002/audio.mechanism_clang__v002.mp3`

has:

- size: `11728` bytes
- actual SHA-256: `3fe9e42fcecad867cc570b09bfe1424b2ebb143f651d58102cdae773ed628530`

The expected binary was not found elsewhere in the current repository. CD has not altered the approved sidecar, review state, binary, registry version, or runtime trigger.

## Requested correction

Please reconcile against the exact Teacher-selected source and attach the correct canonical v002 MP3 in Git-reachable history, or issue a corrected VA-owned sidecar only if the currently staged bytes are verified to be the exact approved binary. Preserve immutable v002 identity and do not create a new semantic/audio selection.

After the correction, CD will rerun integrity/readiness validation and continue publication/activation.

NEXT_OWNER: VA
NEXT_ACTION: Repair the `audio.mechanism_clang` v002 binary/sidecar integrity mismatch and return a targeted handoff to CD.
TEACHER_APPROVAL_REQUIRED: NO for pure transport/integrity repair of the already-selected source.

