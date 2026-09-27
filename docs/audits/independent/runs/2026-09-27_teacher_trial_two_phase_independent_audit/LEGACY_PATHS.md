# DEAD / LEGACY PATH AUDIT

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

| Path / object | Classification | Reason |
|---|---|---|
| root `renderState` + `submitChoice` + `src/content/scenes.js` | **DANGEROUSLY-REACHABLE** | root player invokes it whenever no formal run exists |
| `s1_room_state`, `s1_player_decisions`, `s1_submit_private_choice` | **LEGACY-BUT-REQUIRED for regression, DANGEROUSLY-REACHABLE through root** | canonical spec retains Sprint1 regression semantics but formal runtime should not use them |
| root Teacher `Advance scene` → `s1_advance_scene` | **DANGEROUSLY-REACHABLE operator shadow control** | mutates legacy state on production Teacher page |
| root Teacher `Reset room` → `s1_reset_room` | **DANGEROUSLY-REACHABLE operator shadow control** | only legacy reset; formal run/evidence unaffected, creating split truth |
| root Teacher generic Sprint2 DiscussionRoom | **LEGACY-BUT-REQUIRED / guarded** | migration013 rejects creation once canonical flow exists; still usable in pre-init formal-run gap |
| renamed `*_pre011/pre013`, old Teacher Override versions, old Sprint6 guarded APIs | INTERNAL / DEAD TO BROWSER | explicit revoke chains |
| temporary deadline verification helpers migrations040/041 | DEAD | dropped in migration042 |
| `02_player_v2.html`, `03_teacher_v2.html` | LEGACY-BUT-REQUIRED prototype / externally URL-reachable | separate `game_choices` prototype surface; not current formal authority and not root-linked |
| old ACT15/16 future concepts | DEAD FROM ACTIVE STATE | canonical V4.0 ends at ACT14 |

## Findings

### Root legacy player path

This is the primary legacy defect. The problem is not existence of Sprint1 regression code; it is that current root orchestration selects it as production gameplay before formal start. **IDA-001 / IDA-002**.

### Teacher legacy controls

The production Teacher page still presents legacy state mutations beside formal controls. They cannot reset the formal run, but that is exactly why they create an operator split-brain risk. **IDA-005**.

### V2 pages

The V2 pages use an older direct `game_choices` table and hard-coded Supabase publishable key. No evidence links that table to current formal state. They are therefore not classified as the Teacher's current defect, but their continued public reachability should remain explicit in project inventory.
