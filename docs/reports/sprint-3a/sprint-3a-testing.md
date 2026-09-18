# Sprint 3A Testing

## Static

- Sprint 1 static: PASS
- Sprint 2 static: PASS
- Sprint 3A static: PASS
- localization generation: 310 entries, deterministic PASS
- JavaScript syntax and `git diff --check`: PASS

## Deployment

The user applied `database/005_sprint3a_scene_pocket_knowledge_foundation.sql` to Supabase project `qdcbdcjobzytzhnhfwyn` and reported `Success. No rows returned`.

## Live results

- Sprint 1: 40/40 PASS
- Sprint 2: 23/23 PASS
- Sprint 3A: 10/10 PASS

Sprint 3A verifies NORMAL fixture rejection, owner-only inventory, private/idempotent observation, distinct knowledge provenance, group visibility, valid and invalid photo sharing, ownership preservation, no implicit knowledge transfer, reconnect, Teacher privacy counts, run isolation, and direct anonymous read/write RLS protection.

## Not verified

- physical three-student plus teacher device walkthrough;
- classroom latency/packet loss;
- production ACT scene and Pocket UI, which remain later Sprint 3 work.
