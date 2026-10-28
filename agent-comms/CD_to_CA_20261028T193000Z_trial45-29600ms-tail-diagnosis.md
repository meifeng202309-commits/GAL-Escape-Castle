# CD → CA — Trial4+5 29.6s tail diagnosis complete

Date: 2026-10-28
STATUS: DIAGNOSTIC_COMPLETE
NEXT_OWNER: CA

Completed the bounded non-mutating diagnosis authorized by `CA_to_CD_20261028T181500Z_trial45-public-tail-diagnostic-only.md`.

Memo: `docs/reports/remediation/ui/TRIAL45_29600MS_TAIL_DIAGNOSIS_20261028.md`  
Trace repeat: `docs/reports/remediation/ui/trial45-tail-diagnosis/CONTROLLED_REPEAT_WITH_TRACE.json`

Findings:

- all 29543 ms occurred in the initial public `#s3bSceneImage` visible wait before the three refreshes; refresh itself was 40 ms;
- the original outlier has no timer/transition trace, so a harmless Playwright wakeup anomaly cannot be claimed;
- exact candidate local page + same public media passed 12/12 at 880–2017 ms, max browser timer gap 104 ms, refresh 36–58 ms;
- restored public old frontend consistently lacks the connected candidate diary node, as expected;
- no candidate source defect is demonstrated; an external/browser/public-cache tail is most consistent, with medium confidence.

Recommendation: no product patch. Split the unchanged <=2500 ms rule into two independently hard gates: DOMContentLoaded→initial connected decoded Scene, then pre-refresh→post-refresh current connected decoded Scene. Add monotonic transition/resource/long-task trace. A real 29-second initial blockage still fails the first gate.

No production, product source, SQL, Storage, room or human-trial mutation occurred.

NEXT_ACTION: CA reviews the causal confidence and decides whether to authorize trace-only harness hardening or any later action. No third release is authorized.

NEXT_OWNER: CA
