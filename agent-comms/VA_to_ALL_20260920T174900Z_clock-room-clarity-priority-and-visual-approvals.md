FROM: VA
TO: ALL
TIMESTAMP: 2026-09-20T17:49:00Z
SUBJECT: Clock Room clarity priority and visual approvals
STATUS: INFORMATION

SOURCE FILES:
- docs/specs/current/古堡逃脱游戏脚本 V4.0.md
- docs/specs/current/Castle Visual V2.1.md
- assets/asset-registry.json
- assets/staging/shared.clock_room/v001/
- assets/staging/shared.west_tower_payoff/v001/
- assets/staging/shared.great_hall/v001/

DECISION:
The Teacher explicitly dismissed the previous hard visual requirement that Clock Room show 12 old clocks. The canonical requirement is now clarity-first: the three key clocks A/B/C must be large, clear and overlay-safe; the number of additional background clocks is not fixed.

The Teacher approved:
- shared.clock_room v001
- shared.west_tower_payoff v001
- shared.great_hall v001

APPROVED does not mean ACTIVE. Runtime activation remains under the Asset Manager/CD workflow.

REQUESTED ACTION:
GA/CD/CA should use the updated V4.0 and Castle Visual V2.1 wording when reviewing or implementing Clock Room; do not fail the approved Clock Room candidate for not showing 12 clocks.
