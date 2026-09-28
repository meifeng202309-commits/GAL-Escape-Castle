# Package A — CA-A Final Bounded Recheck

## Audit identity

- Audit owner: CA
- Branch: `remediation/sprint9-structural-v1`
- CD final implementation SHA: `99d2eeafcd0f38c827c7616c92efccea9c35fb0e`
- CD handoff HEAD: `33378aa6e1d574524cefc779fbc2b688659763c0`
- Deployed additive migrations: 059–064
- Decision: **SOURCE/DB CLOSURE PASS; CA-A RELEASE STILL BLOCKED BY INCOMPLETE E0 BROWSER COVERAGE**
- Packages B/C/D: **remain blocked**

## Source / database closure

### A-CA-001

`FIXED_VERIFIED`

- browser execution of `s2_start_run` is revoked from `anon/authenticated`;
- `s9_start_formal_game` remains the supported atomic browser start authority;
- live correction E2E confirms the split-start primitive is denied.

### A-CA-002

`FIXED_VERIFIED`

- ACT5 handoff observation is per-player;
- ACT6 entry is per-player;
- one player's entry does not advance peers;
- entry writes that player's `player_location='portrait_hall'`;
- client visibility is gated by each player's own entry state.

### A-CA-002-R1

`FIXED_VERIFIED`

Effective migration061+ behavior:

```text
ACT5 terminal
→ prepare s5_run_state + s5_round identity only
→ NO canonical discussion row / NO timer
→ each player independently observes ACT5 consequence
→ each player independently enters Portrait Hall
→ game_runs row serializes entry
→ third player completes all-player entry barrier
→ s5_configure_discussion('act6_vote')
→ canonical DiscussionRoom is created/configured
→ started_at = now()
→ phase_deadline = now() + 90 sec
→ shared ACT6 scene becomes current
```

This aligns ACT6 behavior-time ownership with the visible ACT5→ACT6 completion boundary.

Live correction E2E additionally reports 85–90 seconds remaining immediately after the third serialized entry.

### Forward migration discipline

Migrations062–064 correct deployed-schema assumptions additively:
- no rewrite of 001–061;
- prepared event avoids premature discussion-session FK;
- player-entry/handoff functions stop writing nonexistent `s3b_player_progress.updated_at`.

This is consistent with the frozen migration policy.

---

## Remediated E0 evidence

CD supplied a real Playwright browser run against:
- Supabase project `qdcbdcjobzytzhnhfwyn`;
- corrected remediation-branch frontend;
- migrations059–064.

The run proves:
- three isolated browser contexts;
- no legacy pre-run gameplay;
- no split-start boundary;
- atomic start via visible Teacher control;
- distinct role-private ACT1 surfaces.

Those results are accepted.

However, the frozen execution plan §7 states that E0 must be capable of detecting at least:

1. legacy pre-run gameplay;
2. split startup;
3. **completed-run root dispatch cannot reach canonical ACT14 reveal**.

The current `tests/remediation-e0-browser.mjs` implements only items 1–2 plus ACT1 role-private verification.

It contains no:
- ACT14 finalization browser path;
- completed-run final-reveal assertion;
- completed-run reconnect assertion.

Therefore the current E0 does **not** satisfy the minimum browser-harness contract adopted before Package A.

This is an evidence/test-scope gap, not a new Package A source defect.

### CA procedural note

CA previously treated "E0 exists" and startup coverage as sufficient during earlier narrow checks. The final plan-consistency review now corrects that interpretation: the explicit §7 minimum assertion set controls.

---

## Additional observation

The remediated E0 report records one generic browser console error:

`Failed to load resource: the server responded with a status of 404 (File not found)`

The report does not record the URL for this console-only error.

CA does not classify it as a blocker without evidence that it affects the game runtime. When E0 is extended, CD should either:
- capture the resource URL; or
- demonstrate it is an irrelevant static resource such as favicon.

Do not mask relevant application errors.

---

## CA-A disposition

```text
PACKAGE A SOURCE/DB = PASS
A-CA-001 = FIXED_VERIFIED
A-CA-002 = FIXED_VERIFIED
A-CA-002-R1 = FIXED_VERIFIED
LIVE BOUNDED RPC EVIDENCE = PASS

E0 STARTUP BROWSER EVIDENCE = PASS
E0 ACT14 COMPLETED-RUN BROWSER CAPABILITY = MISSING

CA-A = NOT YET PASS
Packages B/C/D = NOT RELEASED
NEXT_OWNER = CD
```

## Required closure action

Do **not** change Package A runtime/database source unless the browser evidence exposes a new defect.

Extend E0 only enough to satisfy the frozen §7 minimum:
- prove the browser harness can detect/guard the completed-run ACT14 dispatch defect class;
- run the remediated assertion against the corrected environment;
- preserve root-page/browser-level evidence rather than substituting direct RPC assertions;
- record exact tested implementation SHA and browser evidence.

Then return ownership to CA for a final evidence-only CA-A closure check.

No B/C/D work is authorized before CA-A PASS.
