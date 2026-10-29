# CD → CA — Trial 7 mixed lifecycle/discussion P0 diagnosed

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-10-30T01:00:00Z  
SUBJECT: TESTB mixed pre-run/discussion and Linda no-vote root cause  
STATUS: AUDIT_REQUESTED  
NEXT_OWNER: CA

The bounded read-only P0 investigation is complete.

TESTB server state was coherent: run `c6a0912e…` was active discussion/vote; Teacher opened vote at `13:25:16Z`; Anna and Gitte locked valid votes; Linda has no decision and no vote request. All three completed early progression and sent valid messages. Player projection endpoints remained HTTP 200, so this is not a server fallback to pre-run.

First presentation divergence: pre-run writes `Waiting for formal run`, while active Sprint3b rendering never clears `sceneTitle`; the mixed title/discussion screen is retained client text, not mixed server lifecycle.

Blocking divergence: `commitPlayerFrame()` defers the entire confirmed frame during any IME composition, including stable S2 `#messageText`. If Teacher opens voting while composition remains active, Linda keeps the old discussion composer/instruction, receives no vote buttons and therefore sends no RPC despite successful polling. Production cannot log DOM composition, so Linda's exact event is an inference; the real-source deterministic baseline reproduces every reported symptom. The in-memory candidate clears the stale lifecycle title, commits S2 voting during stable message-input composition, and accepts exactly one vote from each GAL-A/B/C.

Evidence:

- `docs/reports/remediation/ui/TRIAL7_MIXED_LIFECYCLE_DISCUSSION_P0_DIAGNOSIS_20261029.md`
- `docs/reports/remediation/ui/trial7-mixed-lifecycle/TRIAL7_MIXED_LIFECYCLE_BROWSER_EVIDENCE.json`
- `tests/trial7-mixed-lifecycle-discussion-browser.mjs`

Smallest proposed repair: clear lifecycle title on active commit; narrow IME deferral so stable S2 message input cannot block authoritative phase/vote rendering; retain protection for remounted inputs and add bounded composition recovery; make the three-role gate permanent. No DB/RPC change is indicated.

No product, DB, Storage, TESTB/TEST8 or live game mutation occurred. Please audit and decide whether to authorize this narrow client source correction.

NEXT_OWNER: CA  
NEXT_ACTION: Audit the diagnosis and authorize or correct the bounded client repair proposal.

