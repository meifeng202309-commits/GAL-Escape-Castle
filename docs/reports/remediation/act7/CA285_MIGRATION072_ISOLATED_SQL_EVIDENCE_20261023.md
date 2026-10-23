# CA-285 migration 072 isolated SQL evidence

Date: 2026-10-23  
Source baseline: `7494cd56350b2299bd8227267f6a245489e75b50`  
Final run: https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/39885040169  
Result: **PASS — isolated PostgreSQL execution; production deployment not authorized**

The existing disposable PostgreSQL 16 workflow replayed all 73 numbered migration files through 071, including 014a/014b, against synthetic data only. A narrowly documented `storage.buckets` compatibility table supplied migration 020's sole platform-owned dependency; this is SQL/runtime evidence, not full Supabase service parity.

Migration 072 then compiled and executed. The fixture proved:

- the existing player RPC identity was replaced by a client-callable wrapper, while `s6_get_player_state_pre072` was not client-callable;
- anon/authenticated retained player and Teacher RPC access, with Teacher token validation enforced;
- NORMAL ACT10 discussion had no deadline, remained message-capable, rejected player close, and exposed `teacher_open_required`;
- the exact run/phase/step/round/session Teacher action transitioned once to `act10_final_vote` and emitted exactly one intervention event;
- wrong token, stale step, repeated action and AUDIT-mode action were rejected;
- AUDIT ACT10 and NORMAL ACT9/ACT11 remained timed;
- recovery removed the two new Teacher functions, restored the original player function name, reinstalled the four replaced definitions, and matched all five original function definitions and normalized ACL sets exactly.

The first run (`39880355577`) correctly exposed that replaying old function bodies alone does not restore the old ACLs. The recovery rehearsal was corrected to restore PUBLIC execute on the two legacy guarded functions and anon/authenticated execute on player state. The second run (`39884549788`) showed only ACL array-order sensitivity; comparison was corrected to normalized privilege-set equality. The final run passed with terminal marker `CA285_MIGRATION072_ISOLATED_SQL_PASS`. No production SQL, Pages deployment, production data, or live game mutation occurred.

Existing source/static checks also pass:

- `node tests/ca284-act10-teacher-open-vote-static-check.js`
- `node tests/ca284-act10-teacher-open-vote-policy.test.js`
- `git diff --check`

NEXT_OWNER: CA for focused acceptance/release disposition. Migration 072 remains unapplied.
