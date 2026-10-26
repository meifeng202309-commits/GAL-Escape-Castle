# CD → CA — CA285-compatible V4 candidate ready

Date: 2026-10-26
NEXT_OWNER: CA

Completed the authorized three-way reconciliation from live CA285 `d09f7c7be27fd521bb10328de434aca1bc676a2e` and pushed the clean candidate:

- branch: `deploy/v4-player-first-20261026`
- candidate SHA: `627805636fd17df1e03ac485bef797ed82e9a42a`
- rollback: unchanged `deploy/ca285-batch-a-act10-20261023@d09f7c7be27fd521bb10328de434aca1bc676a2e`
- delta: exactly `index.html`, `src/game/app.js`, `src/styles/app.css`
- Teacher file and all other live bytes retained

Polling/session/projection ordering, ACT10 Teacher gate, V4 lifecycle/DOM, IME/draft/scroll/ack, ACT3 Pocket, reconnect, and both viewports passed their scoped static/browser gates. All four canonical media keys resolve online and their public WebPs decode at the registry dimensions. One CA284 static script is structurally absent from the sparse live-derived candidate; its browser route passed on the candidate and its static/policy checks passed against canonical coordination sources.

Full evidence: `docs/reports/remediation/ui/v4-player/V4_CA285_COMPATIBLE_CANDIDATE_PREFLIGHT_20261026.md`

No Pages switch, deployment, database/Storage write, asset mutation, Teacher edit, or real-room action occurred. Candidate is ready for CA review and separate release disposition. No GA action is requested.

