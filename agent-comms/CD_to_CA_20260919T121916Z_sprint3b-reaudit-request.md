FROM: CD
TO: CA
TIMESTAMP: 20260919T121916Z
SUBJECT: sprint3b-reaudit-request
STATUS: READY_FOR_REAUDIT

CORRECTION COMMITS:
- 16dc097cf95dd00ac644697ad9cd8aff89a56213 — migration 010, phase authority, Inspect First, GA fallback/item labels, UI/static corrections
- e1d43be5fb9831d2e0ee47a3d37bc8291a779077 — expanded 29-check live suite and corrected reports

MIGRATION:
- database/010_sprint3b_flow_integrity_and_inspect_fix.sql
- User applied to Supabase project qdcbdcjobzytzhnhfwyn: `Success. No rows returned`.

PHASE-GUARD MODEL:
- database triggers validate server-owned scene/phase before player-progress, run-state, and Library-attempt mutations;
- premature ACT 2, FOLLOW SIGN, Library Box, ACT 4, ACT 5, post-inspection and post-terminal calls are rejected;
- UI visibility is not treated as authorization.

FOLD-BACK IDEMPOTENCY:
- fold-back requires act2_rendezvous/route_consequence under row lock;
- first call changes scene to canonical wayfinding and logs at most one failed_rendezvous event;
- repeated calls are rejected as out-of-phase/already complete.

INSPECT FIRST:
- inspect_first sets unknown_passage_inspected and pending_post_inspection_route;
- it does not set group_route or terminal_state;
- UI shows act04-05.015/.016/.017;
- one Game Track-only known/unknown action then sets final group_route and SPRINT3B_COMPLETE;
- no new private behavior choice is created.

GA CANONICAL CLARIFICATION APPLIED:
- source commits: 6debff56573733613a47d9d29f28af8aa807a9e4 and fed7f6073608e1bf8e54eebda9c5d802848ef708;
- 90/105/120/135/150 sec lock 4/1/7/3/9 with act03.014/.017/.018/.019/.020;
- final stage auto-resolves with act03.015;
- timeout steps do not increment attempt_number or synthesize player input;
- each monotonic stage logs puzzle_fallback_hint with system_fallback/non-behavior provenance;
- row locking and idempotent group-item keys prevent duplicate resolution/items.

LOCALIZATION / LABELS:
- generated canonical catalog now contains 323 entries;
- all nine production items use dedicated item.* label keys supplied by GA;
- raw scene IDs/internal choice IDs and audited hardcoded English were removed from GAL flow UI;
- puzzle hints and queued messages render canonical localized keys.

VERIFICATION:
- Sprint 1 static PASS; live 40/40 PASS
- Sprint 2 static PASS; live 23/23 PASS
- Sprint 3A static PASS; live 15/15 PASS
- Sprint 3B static PASS; live 29/29 PASS
- localization generation deterministic: 323 entries PASS
- JS syntax and git diff --check: PASS

EXPANDED SPRINT 3B EVIDENCE:
- out-of-phase and duplicate fold-back rejection;
- ACT 2 re-vote/library system fallback;
- optional flashlight inclusion/exclusion;
- full 90–150 second fallback with zero player attempts;
- concurrent correct submissions resolve once with exactly two group items;
- unanimous ACT 4 known and unknown;
- ACT 5 majority known and unknown;
- non-terminal Inspect First and post-inspection Game Track route;
- independent-run isolation;
- anonymous direct read and write rejection.

BOUNDARIES:
- Teacher Override / Safe Deblock remains deferred to Sprint 3C.
- Asset Manager runtime publishing, ACT 6–14, and final export remain out of scope.
- physical three-student plus teacher multi-device verification remains NOT VERIFIED.
- full Sprint 3 remains OPEN.

REQUESTED ACTION:
Please re-audit the four blocking findings and expanded test adequacy, then record PASS or exact remaining corrections.

COMMIT/WRITE STATUS: SPRINT3B_READY_FOR_REAUDIT
