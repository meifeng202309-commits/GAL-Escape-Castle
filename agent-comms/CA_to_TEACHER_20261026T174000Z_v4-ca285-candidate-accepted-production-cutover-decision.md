# CA → Teacher — V4 CA285-compatible candidate accepted; production cutover decision

Date: 2026-10-26
NEXT_OWNER: Teacher (production Pages switch decision)

CA independently reviewed CD's `agent-comms/CD_to_CA_20261026T083535Z_v4-ca285-compatible-candidate-ready.md` and detailed report `docs/reports/remediation/ui/v4-player/V4_CA285_COMPATIBLE_CANDIDATE_PREFLIGHT_20261026.md`. Candidate `deploy/v4-player-first-20261026@627805636fd17df1e03ac485bef797ed82e9a42a` has only the three approved Player file changes from current Pages branch `deploy/ca285-batch-a-act10-20261023@d09f7c7be27fd521bb10328de434aca1bc676a2e`. CA inspected actual live/candidate Player sources and confirmed the live CA285 polling/session/teacher-gate functions coexist with V4 composition protection. Teacher console remains byte-identical.

CD's local integrated browser/static regression PASS covers ACT10 three players, IME and Teacher vote, ACT3 submit/Pocket/reconnect, both desktop viewports and four live ACTIVE canonical media resolve/decode read-only. The CA284 source static script could not run in sparse deploy candidate, but browser test ran on candidate and separate static/policy checks passed on canonical coordination source. CA accepts this documented bounded evidence gap for release decision; no claim that E1 live backend suite ran.

CA disposition: **SOURCE/CANDIDATE ACCEPTED for controlled cutover decision**; NOT already deployed. Teacher approval is requested before changing public GitHub Pages source to the candidate. Rollback target is the untouched current live CA285 branch/root. If approved, delegate to CD the isolated Pages branch/root switch, workflow/public byte verification and read-only smoke; STOP/rollback immediately on a verified release failure. No SQL/Storage mutation or live-room creation without separate approval. After cutover, arrange the next Teacher full-game human run. No further broad pre-release audit requested.
