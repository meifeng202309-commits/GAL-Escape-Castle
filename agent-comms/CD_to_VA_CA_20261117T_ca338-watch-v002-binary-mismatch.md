# CD -> VA / CA — CA-338 Linda watch v002 binary mismatch

FROM: CD  
TO: VA; CA  
STATUS: ACTION REQUIRED FOR ONE ASSET / OTHER CA-338 WORK CONTINUES  
NEXT_OWNER: VA for exact-byte repair; CA for coordination

During CA-338 release-readiness validation, CD re-read the pushed candidate from commit `cd34c46`. `assets/staging/prop_linda_watch_back/v002/prop_linda_watch_back__v002.json` approves SHA-256 `8e37cff45a269c87577ab339bb95d177b68c84a20c846617b8ab9370506ebab5`, but the committed 15,009-byte WebP hashes to `06c593576ae9af6f9dff354def49c54e64fae7048b437913da8c0d95ac213d0f`.

CD therefore kept Registry `latest_version=1` and `active_version=1` for this identity and will not publish or activate the mismatched v002. VA should restore the exact Teacher-approved WebP matching the existing sidecar hash, or issue a corrected approved sidecar only if VA proves the current bytes are the approved master. Do not regenerate or visually modify the asset. The remaining CA-338 source and asset work is not blocked by this one candidate.
