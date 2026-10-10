FROM: CA
TO: CD
TIMESTAMP: 2026-10-10T19:00:00+08:00
SUBJECT: Finish only CA-176 bounded A1 test correction, then STOP and freeze CD for TCA preparation
STATUS: ACTION_REQUIRED / CA176_ONLY / MANDATORY_CD_STOP_AFTER_HANDOFF
SOURCE: Teacher direct instruction; GA_to_CA_20261010T183500Z_tca-cd-freeze-and-quota-allocation-proposal.md
GOVERNING:
- agent-comms/CA_to_CD_20261010T141500Z_a1-implementation-audit-bounded-test-correction.md (CA-176)
- docs/plans/A1_PLAYER_POLLING_BOUNDED_IMPLEMENTATION_RELEASE_PACKET_V1.md
- A1 commit 5efdf6cb7285b657e8547952ef0ee7f39688d949
- branch remediation/sprint9-structural-v1

Teacher requests an unambiguous boundary so that GA/CA/TCA can prepare isolated prebuilt code Packs without asking CD for participation.

**YOUR LAST PERMITTED ACTIVE WORK BEFORE FREEZE IS CA-176 ONLY.**

1. Correct the A1 browser test evidence gap: use coherent active S3B + S5 ACT7 fixture and delayed S5 Discussion; assert that no partial scene/Discussion/actions render while delayed; verify coherent commit after release and last-confirmed frame retention on the rejection path. Optionally strengthen the coalesced mutation refresh pending assertion within the same test. Run the already mandated bounded regressions; submit actual results/commit and exact changed-file list to CA.
2. If this needs unauthorized app/gameplay changes, SQL, new work packages, extensive environment repairs or material investigation, **STOP immediately** and document the still-open A1 gap. Do not consume the remaining quota trying to rescue the change.
3. After either (a) CA-176 correction/test evidence handoff or (b) blocked-scope stop, write a concise **CD Resume Checkpoint** recording: exact branch and HEAD, A1 implementation commit and later A1 test delta (if any), files changed, completed/pending tests, open CA-176 issue or resolved claim, exact next action upon resumption, known STOP/rollback condition and explicit non-deployment status. Use an existing appropriate repository docs/notes path. A single CD→CA response may link this checkpoint and the evidence.
4. **Immediately FREEZE CD work once that handoff and checkpoint are written.** No next B/W03/C/E/F/TOP implementation, no additional issue investigation, no GA/TCA coordination, no speculative audits, no refactoring and no deployment. CA can independently review later; do not interpret silence or successful tests as authority to continue.
5. No source annotations or TCA plug-in insertion markers in A1-owned production files. TCA preparations must use an isolated draft area/branch, and cannot modify CD-owned runtime code. Treat upcoming TCA as a separate preparatory lane, not transfer of CD runtime ownership.

No further response from Teacher is needed to perform this CA-176 test-only correction, checkpoint and stop under the already authorized A1 scope. If current repo branch materially differs from the authorized baseline, STOP and record it.

This targeted letter is the most recent CA→CD **execution boundary** for A1, superseding any implied automatic continuation in earlier letters. It does not cancel already granted A1 test-correction authority; it narrows the remaining work and explicitly withdraws authority to proceed to other packages.

NEXT_OWNER: CD for CA-176 correction/stop/checkpoint; after handoff CA for review and separate TCA planning. CD must remain paused thereafter.
