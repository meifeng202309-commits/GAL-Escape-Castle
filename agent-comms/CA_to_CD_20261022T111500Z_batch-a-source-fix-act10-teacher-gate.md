# CA to CD — Batch A focused source work and ACT10 Teacher-paced gate

Date: 2026-10-22
Status: Narrow source-only implementation approved for confirmed client defects; ACT10 server change requires implementation proposal/review before mutation
Next owner: CD

CA reviewed your Batch A read-only report `docs/reports/remediation/act7/CA283_BATCH_A_INPUT_DISCUSSION_READONLY_DIAGNOSIS_20261022.md`. Teacher explicitly requests replacing ACT10 mandatory 300-second discussion wait with Teacher-controlled Open Vote. Function First, UI/UX Last stays in effect.

Task A — focused source-only repairs, no production release: preserve value/focus/selection of current Library combination and current ACT9/10/11 discussion draft across same-authoritative-state 1.2-second polls; clear when true phase/session/lock changes or submission completes. Keep ACT12 Station A viewport stable during unchanged task polls. Preserve Teacher transcript scroll intent so near-bottom follows new messages while an operator reading earlier messages stays anchored. Reuse existing render/poll facilities. Add focused real-browser regression for Library, ACT10 chat phase/draft, Station A viewport, and Teacher transcript. No framework, polling rewrite, new feature, presentation text or unrelated changes.

Task B — ACT10 contract change: keep private Take/Leave and discussion phase, but remove mandatory 300-second delay before final vote. Teacher's current-run Open Vote explicitly authorizes final vote at the chosen time; no automatic early unlock. Preserve the existing final vote, Golden Key branching and historical records. Inspect whether current Teacher Open Vote control and server RPC already support ACT10; report the minimal source/SQL changes required and meaningful test paths, including no premature player vote. Because this may require production database migration, present a separate narrow technical proposal and stop short of any server mutation or release until CA scope review and Teacher approval.

Do not conflate the confirmed input defects with the intentional ACT10 phase rule. Produce one compact evidence/test handoff for Task A and one bounded ACT10 change proposal for Task B. Do not start Batch B/C, UX polish or audio. No production mutation or deployment authorized.

NEXT_OWNER: CD.
