# Sprint 3A Testing

## Static

- Sprint 1 static: PASS
- Sprint 2 static: PASS
- Sprint 3A static: PASS
- localization generation: 310 entries, deterministic PASS
- JavaScript syntax and `git diff --check`: PASS

## Deployment

The user applied both Sprint 3A migrations to Supabase project `qdcbdcjobzytzhnhfwyn` and reported `Success. No rows returned` for each:

- `database/005_sprint3a_scene_pocket_knowledge_foundation.sql`
- `database/006_sprint3a_provenance_view_integrity_fix.sql`

## Live results

- Sprint 1: 40/40 PASS
- Sprint 2: 23/23 PASS
- Sprint 3A: 15/15 PASS

Sprint 3A verifies NORMAL fixture rejection, owner-only inventory, private/idempotent observation, distinct knowledge provenance, group visibility, server-authoritative current-view photo sharing, rejection of a back-view share before FLIP, ownership preservation, recipient re-share rejection, no implicit knowledge transfer, reconnect restoration, Teacher privacy counts, run isolation, and direct anonymous read/write RLS protection.

The correction suite also rejects five factually invalid provenance cases: an outside holder, an unowned pocket item, a missing shared-photo copy, an absent group item, and a cross-room source player.

## Not verified

- physical three-student plus teacher device walkthrough (NOT VERIFIED);
- classroom latency/packet loss;
- production ACT scene and Pocket UI, which remain later Sprint 3 work.
