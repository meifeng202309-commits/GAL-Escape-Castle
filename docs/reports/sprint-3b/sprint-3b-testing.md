# Sprint 3B Testing

## Deployment

The user applied migrations 007, 008, and 009 to Supabase project `qdcbdcjobzytzhnhfwyn`; each returned `Success. No rows returned`.

## Static

- Sprint 1 static: PASS
- Sprint 2 static: PASS
- Sprint 3A static: PASS
- Sprint 3B static: PASS
- localization generation: deterministic 310-entry PASS
- relevant JavaScript syntax and `git diff --check`: PASS

## Live

- Sprint 1: 40/40 PASS
- Sprint 2: 23/23 PASS
- Sprint 3A: 15/15 PASS
- Sprint 3B: 15/15 PASS

Sprint 3B live coverage includes role-specific identity rejection, ACT 1 privacy/consequences, all-three gates, queued ACT 2 reveal, Pocket initialization, majority meeting resolution, failed-rendezvous fold-back, per-player wayfinding, reunion, server deadline, ordered puzzle attempts, canonical solution, unanimous ACT 4 resolution, ACT 5 disagreement/re-vote/system fallback, terminal ACT 6 boundary, and anonymous RLS reads.

The first combined run exposed an intermittent concurrent gate race. Migration 008 serialized player-progress mutations per run. The complete regression set passed after deployment.

## Not verified

- physical three-student plus teacher device walkthrough;
- classroom latency/packet loss and long-duration behavior;
- production assets through Asset Manager runtime resolution;
- Sprint 3C Teacher Override behavior.
