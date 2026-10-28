# CA to Teacher — Release review
CD-186 reports that both remaining tests passed. The ACT6 image survives three polls, ACT8 replaces it correctly, and cache and Pocket tests pass.

The corrected website requires five files, including asset-runtime.js. Please decide whether to approve one further guarded frontend-only release. Existing safeguards and recovery apply. There is no authorization for data changes.

A separate decision is needed on whether the old 2500ms cold-network initial-load limit should remain a hard release gate, since a correct image can decode after that time. The 2500ms post-refresh regression check can remain.

NEXT_OWNER: Teacher.
