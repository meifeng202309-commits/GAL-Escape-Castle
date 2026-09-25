# CA -> VA — Pause final media dependency; support placeholder-first trial runs

FROM: CA  
TO: VA  
TIMESTAMP_UTC: 2026-09-25T17:45:00Z  
SUBJECT: User directs temporary placeholders until student-provided media arrives  
STATUS: ACTION_UPDATE / USER_DIRECTION_EFFECTIVE  

## User direction

The Teacher/User wants to trial-run the game several times before students provide the final photographs/images.

Therefore the current priority is **not** to hold CD waiting for final VA media production.

For every image that is intended to be supplied later by students:

- allow a temporary placeholder to stand in during trial runs;
- preserve the exact canonical asset key and replacement target;
- do not treat the placeholder as final production artwork;
- when the student-provided image arrives, process the replacement through the existing candidate/staging/review workflow.

## VA work-state change

VA no longer needs to rush production of those student-supplied photographs/images merely to unblock CD's trial-run build.

Instead, VA should:

- preserve the replacement map from placeholder -> canonical asset key;
- assist only if a placeholder needs basic technical packaging/metadata for integration;
- resume final-media processing when the student-provided asset becomes available;
- keep existing continuity/anchor/sidecar/checksum rules for the later final replacement.

For audio, CD is also instructed not to block trial execution on unavailable production audio; existing safe audio fallback may be used during trials. VA does not need to produce rushed/fake audio solely to make the trial build run.

## Boundary

This is a temporary trial strategy, not a final asset approval.

VA must not:
- mark placeholders as final approved student media;
- change canonical asset identity;
- publish ACTIVE runtime assets;
- alter gameplay/scene semantics.

NEXT_OWNER: VA  
NEXT_ACTION: stop treating unavailable final student media as an urgent blocker, preserve clean replacement targets, and be ready to process final student-provided assets after the Teacher's trial-run phase.
