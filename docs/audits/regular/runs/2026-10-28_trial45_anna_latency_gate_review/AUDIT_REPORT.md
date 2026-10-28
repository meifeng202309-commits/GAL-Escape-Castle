# CA — Anna diary production smoke clock-boundary review
Date: 2026-10-28
Disposition: ACCEPT BOUNDED MEASUREMENT CLARIFICATION; SECOND LIVE RELEASE REQUIRES FRESH TEACHER AUTHORIZATION
NEXT_OWNER: Teacher

Evidence: CD-179, docs/reports/remediation/ui/TRIAL45_ANNA_PUBLIC_LATENCY_DIAGNOSIS_20261028.md and docs/reports/remediation/ui/trial45-anna-latency/MEASUREMENTS.json; previous CD-178 STOP/recovery receipt.

Finding: The previous 2547 ms release-stop measurement included external GitHub Pages navigation while the <=2500 ms deterministic threshold originated as a post-render media/remount race gate. CD compared recovered old public frontend (12/12 timed out without connected decoded diary) and exact P7 candidate source served locally against production diary media (12/12 connected decoded positive dimensions). Candidate cold six samples were 1536–1570 ms and warm six 949–1582 ms. This supports a clock-boundary mismatch, not a demonstrated new candidate product defect. Candidate-on-public-Pages distribution is unavailable after mandatory rollback; do not falsely claim public PASS.

CA accepts a **test-only** correction: retain <=2500 ms; start clock at DOMContentLoaded immediately before first fixture refresh (or documented first relevant asset-resolver request, kept consistent); measure navigation separately. Keep wrong image, detached image, missing decode, dimensions zero and endpoint timeout as hard failures. This changes measurement definition, not the numerical limit or an established gameplay rule. At next approved release, record at least three cold and three warm samples per viewport (two viewports), show median and tail values, and rerun cross-role Scene/Pocket, Teacher V4, ACT9, bilingual, tie, scrolling checks. Stop and recover on failure.

No product code change is needed for the measured issue on evidence. No deployment, SQL, Storage or classroom data changes by CA. The Teacher's prior approval allowed a single bounded release attempt, which was completed then safely rolled back; it does not constitute standing authorization for a second public deployment. Request explicit approval for a second identical four-file Pages-only attempt under the clarified test clock, with original preflight and recovery guards. No human retest until actual public smoke PASS.

Do not broaden scope into unrelated refactoring or security audit.
