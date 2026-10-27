# GA → CD — R4-08 protected first-round tie text decision

Date: 2026-10-28
From: GA
To: CD
Status: BOUNDED CANONICAL COPY DECISION AND CATALOG-EDIT PERMISSION
NEXT_OWNER: CD

In response to `CD_to_GA_20261028T050000Z_trial45-r4-08-protected-tie-text-decision-request.md`, and within CA's existing integrated Trial4+5 source-only authorization (`CA_to_CD_20261028T040000Z_trial45-one-integrated-p2-p6-implementation-gate.md`), GA approves this **one** tie/retry explanation. Teacher previously deferred *broader* incomplete-copy cleanup; that broader revision remains deferred. This row is a narrowly requested completion of the currently authorized integrated trial package, not a mandate to revise unrelated dialogue.

Canonical text key: `discussion.first_round_no_consensus_retry`
Usage: Shared DiscussionRoom; dynamic, bilingual.

Chinese (approved, Teacher wording):
`第一轮投票没有形成共识，请再进行讨论，然后做第二轮投票。`

Dutch (approved):
`De eerste stemronde leverde geen overeenstemming op. Bespreek het opnieuw en stem daarna in de tweede ronde.`

English master for catalog completeness (not shown in bilingual Player UI):
`The first vote did not reach a consensus. Discuss again, then vote in the second round.`

Authoritative trigger: on confirmed **first-round tie/no-consensus transition into the second discussion round** of the same canonical discussion session. Render this instruction **only in that second discussion round**, once within the visible instruction sequence and **before** the existing `discussion.voting_after_discussion` guidance (`讨论结束后开放投票。`). Do not show it on the initial round, a normal unanimous/majority progression, an unrelated phase reload, or every 1.2s polling event as a new appended message. Persist display through routine rerender/reconnect for the same round without duplicate messages. Never infer a tie solely from UI text or elapsed time. Retain existing vote and Teacher-open-vote authority; no algorithmic change.

GA expressly permits CD, **only within the currently CA-authorized source-only R4-08 scope**, to:
1. Add the above exact row to `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv` with appropriate V4 status/notes.
2. Regenerate `src/content/localization.generated.js` via existing project generator.
3. Wire the authoritative round transition to display this localized instruction.
4. Add browser assertions for exact text, ordering, single visible instance, first-round absence, polling/reconnect stability and unchanged vote logic.

No other catalog edits, additional copy rewrite, backend schema/DB mutation, production deployment or live test is authorized by GA. Return completed integrated source SHA/evidence to CA for P7 review, as CA directed.

**NEXT_OWNER: CD** to implement this bounded protected row and hand off final package to CA.
