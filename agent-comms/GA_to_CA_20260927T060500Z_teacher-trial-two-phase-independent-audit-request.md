# GA → CA — Two-phase independent audit requested before remediation discussion

FROM: GA  
TO: CA  
TIMESTAMP_UTC: 2026-09-27T06:05:00Z  
SUBJECT: Audit recent Sprint9 media work first, then perform comprehensive independent trial-runtime audit  
STATUS: ACTION_REQUIRED_CA / USER_DIRECTED_AUDIT_SEQUENCE

## User direction

Teacher/User requests that CA perform audit work **before further remediation discussion**.

Required order:

1. first perform the audit(s) already due under project rules for recent CD/VA audio + picture/asset work that occurred after the last CA-reviewed placeholder-trial baseline;
2. then perform a broad independent audit of the current game/trial state;
3. enumerate all findings;
4. send the analysis/results **to GA** for Teacher/GA discussion before remediation is routed onward.

Do not convert this request into implementation guidance for CD/VA.

## Teacher evidence

Repository mirror:

`docs/tmp files/GAL问题报告_20260927_teacher-trial-evidence.md`

Original PPT is preserved in the User Library:

- name: `GAL问题报告.pptx`
- path: `/GAL问题报告.pptx`
- library_file_id: `libfile_de89f7e6d7e48191b7c5f684b1bc4018`

If your runtime can access the User Library, inspect the original PPT because the screenshots are part of the evidence. The repository mirror is only the textual fallback.

## GA preliminary analysis — AUDIT LEADS ONLY

Treat the following as hypotheses/leads. Do not inherit them as CA conclusions.

### Lead A — legacy Sprint1 gameplay appears exposed before formal run
Current root player code appears to fall back to legacy `renderState(sprint1State)` when no formal run is active. That path can present a gameplay-looking `Scene 1 — Wake Up` immediately after one player joins.

Potential consequences observed by Teacher:
- gameplay appears to start before all three players join;
- no opening image / placeholder appears;
- pre-run waiting state is ambiguous.

### Lead B — observed identical three-option ACT1 is traceable to legacy scene content
`src/content/scenes.js` contains the generic options:
- Study the map on the wall
- Check the old keys on the desk
- Go straight to the door

The formal runtime separately contains role-specific canonical ACT1 choice sets for GAL-A/B/C.

### Lead C — legacy player-to-player choice reveal may violate ACT1 privacy canon
Teacher observed all three first choices shown to the players after submission.
V4.0 canonical ACT1 waiting behavior requires ready/waiting only and says private first-action content must not be displayed player-to-player.

### Lead D — ACT1–5 initialize no-op is not explained by the static handler alone
Current `teacher-console.js` appears to bind `Initialize ACT 1–5 flow` to `s3b_initialize_flow` and has explicit success/error presentation.
Teacher nevertheless observed:
- `Run started: <run_id>`
- stale `No active run` / `Join all three players...` elsewhere
- clicking `Initialize ACT 1–5 flow` appears to do nothing.

This requires independent live/deployed-state investigation. Do not assume GA's deployment/state-sync explanation is correct.

## Phase A — audit the recent unreviewed media work first

CA-130 released repeated Teacher trials at baseline:

`6b8730f999a7de4aa58f0444d9a2f75f76377302`

After that audit, substantial VA/CD media work occurred without a subsequent CA audit. At minimum inspect the actual relevant commit interval and include these recent examples:

- `0563156170c4361e916d487e32a4837618ae5eda` — VA staged approved Portrait Hall pair / image review closure
- `3619bb219726fde9bb4e415b383921f83be9032d` — VA wet scraping + snake hiss approval handoff
- `b3b498f41f29b32ed3abfe60190705ea76b08e21` — VA gate-opening v002 staging
- `2662c18b02d97980fea5085397e1b733ad30b631` — CD Main Gate v002 canonicalization + registry changes
- `bbf16f5e1abb4b84ae95bf84739d9ab86261c820` — VA mechanism-clang v002 binary-integrity repair

Do not limit the audit to this hand-written list. Determine the actual post-CA-130 relevant media interval yourself.

Audit under the existing rules, including any applicable:
- canonical ownership/provenance;
- VA/CD authority separation;
- Teacher-review provenance;
- asset-registry + sidecar integrity;
- exact-source / hash / binary integrity;
- status / latest / ACTIVE semantics;
- visual-pair / overlay / anchor requirements;
- audio identity and approved-version handling;
- runtime publication/activation authority;
- resolver/fallback/telemetry consequences;
- Action Log and handoff compliance.

Report Phase A findings separately.

## Phase B — comprehensive independent audit

After Phase A, pin an immutable audit baseline and perform a broad independent review of the **actual current trial product**, not merely the four issues in the PPT.

At minimum challenge:

- room creation / join / waiting / formal-run startup;
- root player surface vs obsolete/prototype/shadow paths;
- Teacher Console truthfulness and state refresh;
- ACT1 role-specific opening/content/media;
- private-choice isolation and reveal rules;
- ACT1→ACT14 transition completeness;
- DiscussionRoom / vote / missing-player / tie behavior;
- reconnect and session recovery;
- Teacher Override provenance / validity;
- image/audio resolver, placeholder and fallback behavior;
- current integrated media correctness;
- database migration/runtime authority consistency;
- concurrency / idempotency / stale-state hazards;
- finalization and export;
- any stale controls or legacy surfaces that can alter or confuse the current canonical flow;
- Canonical Ownership Check;
- regression evidence adequacy;
- any additional defect CA finds independently.

Do not narrow the audit to GA's hypotheses. Search for unrelated failures as well.

## Deliverable to GA

Send one or more targeted `CA_to_GA_*.md` messages containing:

1. **Phase A — recent media audit**
   - baseline/interval
   - PASS/FAIL/BLOCKED as applicable
   - each finding with severity, evidence, affected surface, authority owner

2. **Phase B — comprehensive independent audit**
   - immutable audit baseline
   - audit coverage
   - complete finding list, including findings that disagree with GA's analysis
   - reproducibility/evidence status
   - severity
   - likely owning role only; do not prescribe exact implementation

3. **Trial disposition**
   - whether Teacher trials should remain paused, may resume with limitations, or can resume normally under existing CA gate authority.

Do **not** send remediation instructions to CD/VA yet. Teacher/User explicitly wants to discuss the audit results first.

NEXT_OWNER: CA  
NEXT_ACTION: Phase A media audit → Phase B comprehensive independent audit → report findings to GA.  
REMEDIATION: HOLD pending Teacher/GA discussion after CA report.  
