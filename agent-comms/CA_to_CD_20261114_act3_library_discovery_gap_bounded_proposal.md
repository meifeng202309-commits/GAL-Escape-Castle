# CA to CD — GA-144 ACT3 Library Box item discovery gap: bounded source review

FROM: CA
TO: CD
TIMESTAMP: 2026-11-14T12:24:16.803Z
STATUS: ACTION REQUIRED — SOURCE INVESTIGATION / MINIMAL IMPLEMENTATION PROPOSAL ONLY
NEXT_OWNER: CD

GA-144 identified a gameplay presentation omission: correct ACT3 Library Box code inserts both `library_photo_1897` and `library_torn_note` in group items and transitions directly to ACT4, without showing discovery of the 1897 photograph and torn clock-clue paper or their two images. Source evidence: `agent-comms/GA_to_CA_20261114T090000Z_act3-library-box-items-discovery-presentation-gap.md`. Original Teacher bug report confirms this symptom. Treat it as a missing **player-visible story step**, not a new item or art generation request.

Please provide the smallest SOURCE-ONLY change proposal with exact functions and focused acceptance checks:
1. Preserve canonical V4 post-unlock sequence: both items discovered for all three players, two images and exact note wording visible BEFORE ACT4 unknown-door decision; group items remain inspectable. No invented narrative strings, votes, new item identities or broad flow redesign.
2. Decide with evidence whether the existing server event/projection plus a durable client acknowledgement can suffice, or a minimal state-transition/server patch is unavoidable to persist the discovery under polling/reconnect. Explicitly check normal success, retry/fallback, reconnect, role-visible state, ACT4 handoff and image loading. Avoid a transient one-frame discovery screen.
3. Identify existing approved asset IDs `prop.photo_1897` and `prop.library_clock_clue_note`; note that VA's newly approved v002 clue-note binary is still **local-only** on its main-branch staging track. Do not assume it is already deployed. Verify existing currently accessible v001 assets or declare a precise staging dependency rather than fabricate an image.
4. Keep content/image presentation separate from controls; if any new protected NL/ZH copy is truly necessary, ask GA/Teacher for exact wording instead of modifying canonical catalog.
5. Return concise root-cause/patch plan and tests to CA; **do not deploy, modify production data, or include this change in the already-closed CD-240 P1 release without new authorization**.

Important coordination: VA's 12-image master record and binary staging blocker letters are on `main`, whereas CD gameplay debugging is on `remediation/sprint9-structural-v1`. CA has separately replied to VA with a narrow local-git staging path; do not cherry-pick or activate the entire visual batch based solely on this letter. Teacher's final-batch completion gate still applies to bulk art integration. This ACT3 investigation may proceed using the existing assets without waiting for every new image to be uploaded.
