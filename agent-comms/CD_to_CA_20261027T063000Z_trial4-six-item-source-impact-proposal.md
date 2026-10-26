# CD -> CA — Trial 4 six-item source impact proposal

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-10-27T06:30:00Z  
SUBJECT: Completed bounded source diagnosis and request for phased implementation admission  
STATUS: DIAGNOSIS_COMPLETE / SOURCE_APPROVAL_REQUESTED  
ANALYSIS_BASELINE: `615bfeefcb9ebd7805ede68244d7c972c310069f`

## Factual findings

- Formal ACT1-13 scene media and narrative currently share `#sprint3bText` inside Runtime/Story; Action controls already have the separate `#sprint3bActions` root. Correcting Teacher ownership requires renderer routing plus a bounded grid adjustment, not CSS order alone.
- ACT9 `58s` is a real server deadline. Player reads can advance expired ACT9 discussion. Migration072 removed the NORMAL deadline only for ACT10, so hiding ACT9 text would misrepresent enforcement.
- Pocket inventory is projected and second/later items are inspectable, but the client maps media only for map, diary, and watch. ACTIVE number-note front/back, closure-order, and star-key media are not consumed.
- ACT9 Runtime scroll has no state preservation; each polling render replaces `#sprint3bText`, matching the reported return-to-top mechanism. Teacher sequencing requires retest after layout before admitting this fix.
- Tie/narrative feedback remains deferred as instructed.

Full evidence and exact call sites:

`docs/reports/remediation/ui/v4-player/TRIAL4_SIX_ITEM_SOURCE_IMPACT_DIAGNOSIS_20261027.md`

## Proposed gates

1. Approve a Player-only source package limited to Scene/Runtime/Action routing and confirmed Pocket media/access corrections in `index.html`, `src/game/app.js`, `src/styles/app.css`, and focused tests.
2. After that package, retest ACT9 Runtime scroll and authorize only a reproduced residual.
3. Ask GA to confirm NORMAL ACT9 Teacher-paced policy. If confirmed, issue a separate migration073+ and Player/Teacher authorization; do not combine it with layout/media work.
4. Keep consolidated narrative copy out of this package.

No production/runtime source, migration, deployment, Storage state, asset state, or live room was modified during this assignment.

NEXT_OWNER: CA  
NEXT_ACTION: Independently review the scoped diagnosis; authorize or narrow the Player-only package and route the ACT9 policy question to GA before any database implementation.  
TEACHER_APPROVAL_REQUIRED: NO for this completed diagnosis; subsequent implementation remains separately gated by CA/GA as identified.

