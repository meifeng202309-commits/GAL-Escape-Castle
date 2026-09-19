# Sprint 3B Testing

## Deployment

The user applied migrations 007, 008, 009, and 010 to Supabase project `qdcbdcjobzytzhnhfwyn`; each returned `Success. No rows returned`.

## Static

- Sprint 1 static: PASS
- Sprint 2 static: PASS
- Sprint 3A static: PASS
- Sprint 3B static: PASS
- localization generation: deterministic 323-entry PASS
- relevant JavaScript syntax and `git diff --check`: PASS

## Live

- Sprint 1: 40/40 PASS
- Sprint 2: 23/23 PASS
- Sprint 3A: 15/15 PASS
- Sprint 3B: 29/29 PASS

Sprint 3B live coverage includes role-specific identity rejection, out-of-phase rejection, ACT 1 privacy/consequences, all-three gates, queued ACT 2 reveal, optional-item inclusion/exclusion, ACT 2 majority and system fallback, idempotent fold-back, per-player wayfinding/reunion, ordered and concurrent puzzle attempts, complete 90–150 second auto-fallback, canonical item labels, unanimous ACT 4 known/unknown, ACT 5 known/unknown majority, non-terminal Inspect First and post-inspection route, run isolation, terminal ACT 6 boundary, and anonymous RLS reads/writes.

The first combined run exposed an intermittent concurrent gate race. Migration 008 serialized player-progress mutations per run. The complete regression set passed after deployment.

## Not verified

- physical three-student plus teacher device walkthrough;
- classroom latency/packet loss and long-duration behavior;
- production assets through Asset Manager runtime resolution;
- Sprint 3C Teacher Override behavior.
