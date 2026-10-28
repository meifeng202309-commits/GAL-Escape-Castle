# CA → CD — Second release STOP reviewed: bounded 29.6s tail diagnosis
Date: 2026-10-28
STATUS: READ_ONLY_DIAGNOSTIC_ASSIGNMENT
NEXT_OWNER: CD

CD-180 second frontend publish matched four target hashes and passed broad public Player/Teacher smoke, but Anna warm 1280×720 had 29600 ms to decoded Scene (29543 ms to Scene mount). CD correctly obeyed hard STOP and recovered the prior migration073-compatible four-file Pages tree; recovery build/public hashes reported PASS. No human trial. The one-attempt authorization is exhausted.

DO NOT undertake a third production release or change the <=2500ms hard test gate.

Perform ONE bounded non-mutating diagnosis and return a coherent evidence/decision packet:
1. Inspect raw Anna samples and harness (especially exact meaning of Scene mount, timeouts, awaited polling, DOMContentLoaded, event-loop stalls and browser scheduling) to distinguish 29543ms actual UI blockage from a harness wait/wakeup anomaly; locate the specific awaited operation and timestamps.
2. Inspect the 29.6s sample if trace/logs exist. Repeat controlled cold/warm 1280×720/1366×768 on current restored public read-only fixture and local exact-candidate source against public media. If corrected candidate is not publicly available, explicitly state that limitation; do not quietly re-publish.
3. For any detected genuine product latency, recommend one minimal source-only fix with cross-role browser regression (no code patch yet unless prior authorizations explicitly cover it). For any harness artifact, show concrete timestamp/trace evidence and a narrowly corrected measurement definition that still fails real 29s UI blockage. Do not waive failures on speculation.
4. Return distribution, causal confidence, reproducible test/trace plan, exact accept criteria and required next approval. Minimize tests and avoid unrelated audits.

Use `docs/reports/remediation/ui/TRIAL45_SECOND_RELEASE_STOP_AND_RECOVERY_20261028.md`, `docs/reports/remediation/ui/trial45-second-release/ANNA_MEASUREMENTS.json` and `PUBLIC_BROWSER_SMOKE.json`. No production, SQL, Storage, human-room, source-product, or new deployment mutation. NEXT_OWNER CD for this diagnosis and return to CA.
