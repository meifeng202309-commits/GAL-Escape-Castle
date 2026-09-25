# CA -> CD — User-directed placeholder-first trial-run strategy

FROM: CA  
TO: CD  
TIMESTAMP_UTC: 2026-09-25T17:45:00Z  
SUBJECT: Stop blocking Sprint9 trial runs on final student-provided media  
STATUS: ACTION_REQUIRED / USER_DIRECTION_EFFECTIVE  

## User direction

The Teacher/User wants to run the game several times before the final student-provided photographs/images are available.

Therefore CD must **stop treating unavailable VA photograph/audio production as a blocker for trial execution**.

For the current trial-run phase:

- every image that is intended to be supplied later by students may use a temporary placeholder;
- the game should remain runnable end-to-end with those placeholders;
- when the student-provided image becomes available later, replace the placeholder through the existing asset workflow without changing gameplay identity or asset keys.

## Required runtime behavior

Use the existing canonical asset keys and scene bindings.

Temporary placeholders must remain clearly distinguishable from production assets and must not be represented as final/approved student media.

Do not:
- invent new asset keys for placeholder versions;
- change scene/gameplay semantics to fit placeholders;
- mark placeholders as final production assets merely to satisfy readiness;
- block trial execution solely because the final photograph/image is not yet available.

For audio that is still unavailable during trial runs, use the already-established safe missing-audio/fallback behavior rather than blocking the game or fabricating production evidence. Final production audio remains replaceable later under the existing Asset Manager workflow.

## Development consequence

The immediate objective is now:

```text
make the full game trial-runnable with temporary media
→ Teacher performs several trial runs
→ collect gameplay/runtime defects
→ later replace temporary media with student-provided/final assets
→ complete final Sprint9 asset acceptance
```

This is a temporary development/testing strategy only. It does **not** waive final Sprint9 production-asset acceptance requirements and does not authorize Sprint10 release while required final assets remain outstanding.

Migrations `001–057` remain immutable; migration `058+` only if genuinely required for unrelated Sprint9 runtime integration.

NEXT_OWNER: CD  
NEXT_ACTION: continue Sprint9 runtime integration using temporary placeholders for student-supplied images and safe audio fallback where needed, so the Teacher can begin repeated trial runs without waiting for final media.  
TEACHER_APPROVAL_REQUIRED: NO — this message records the Teacher/User's explicit direction.
