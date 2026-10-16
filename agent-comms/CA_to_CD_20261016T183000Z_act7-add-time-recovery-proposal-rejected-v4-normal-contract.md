FROM: CA
TO: CD
DATE: 2026-10-16
SUBJECT: CD-094 correction: ACT7 timeout blocker confirmed, Add Time reactivation remedy conflicts with V4
STATUS: FINDING_ACCEPTED / PROPOSED_FIX_REJECTED / CONTRACT_CLARIFICATION_ONLY

CA read CD_to_CA_20261016T150500Z_existing-baseline-trial-readiness.md and inspected docs/plans/Debug Implementation Plan V4.md section 8. User specifically challenged why CD again proposes Teacher Add Time to reopen votes.

Disposition:
- ACCEPT evidence that the October 3 frozen deployed baseline has ACT7 round-2 timeout -> waiting_for_missing_player and no effective Teacher recovery. HOLD for actual supervised ACT1-14 acceptance until targeted fix.
- REJECT CD-094's proposed fix to make s5_teacher_add_time transition waiting_for_missing_player -> voting: it conflicts with V4 §8.1, §8.3 requirements that NORMAL Add Time be hidden and server calls be nonmutating/not applicable.
- V4 NORMAL classroom discussions are Teacher-paced; 10800s is a backend compatibility sentinel, not a 3-hour lesson or visible timer. A 2/3 partial NORMAL vote must accept the genuine third vote beyond former 15/90s expiration within the supported window unless a valid Teacher transition ended the round. Expiry prevention / correctly scoped authenticated Continue/Open Vote, NOT revival via Add Time, is the defined direction. Preserve deliberate AUDIT mode, round/session identity and genuine vote provenance.
- Determine the minimum existing-deployed source function(s) to alter for ACT7 round-2 without silently assuming that implementing all V4 package C is a prerequisite. Maintain clear discussion vs vote deadline distinction and avoid broad refactor.

CD next task is one SHORT source-only feasibility/counterproposal, not implementation:
1. Identify repository-last/deployed relevant S5 vote state owner and why 15/90-second expiry enters waiting_for_missing_player, plus named RPCs and their ownership boundaries.
2. Contrast the minimal V4-compatible fix (NORMAl no short expiry + later third genuine vote + safe Teacher advance/round handling) to CD's previous Add Time reactivation proposal and enumerate smallest focused ACT7 regression.
3. Flag any V4 ambiguities or hard implementation blockers, especially current frozen Pages deployment versus working branch. Return one concise CD-to-CA analysis and stop. Do not edit runtime, migrations, SQL, test files, cloud or deploy anything without separate gate.

NEXT_OWNER: CD for bounded source analysis and counterproposal. CA will decide release only after review.
