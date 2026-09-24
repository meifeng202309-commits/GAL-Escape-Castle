# LEGACY_PATHS — ACT1–13 post-Sprint6

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

## H1/H2. Legacy and replaced-object classification

| Surface | Classification | Current reachability / risk |
|---|---|---|
| Sprint1 `s1_room_state`, `s1_advance_scene`, prototype choice flow | LEGACY-BUT-REQUIRED | retained for verified prototype compatibility; formal Castle state does not depend on prototype completion |
| Sprint1 room/join/session/release | ACTIVE | still authoritative access/session layer |
| generic Sprint2 run/discussion infrastructure | ACTIVE / SHARED FOUNDATION | formal ACT1–5 and later discussions reuse tables; exact message/vote APIs still needed |
| generic `s2_open_discussion` | LEGACY FOR CANONICAL GAMEPLAY / GUARDED | canonical wrapper rejects once formal scene exists |
| generic `s2_get_player_state → s2_refresh_discussion` | **DANGEROUSLY REACHABLE** | normal player refresh invokes it during Sprint6; incompatible resolution ownership causes IDA-001 |
| generic `s2_open_vote` / `s2_add_time` | ACTIVE Teacher utility | Teacher-token gated; open-vote rejects no-vote Sprint6 discussion; add-time can extend latest discussion |
| Sprint3 historical pre013/pre014 wrappers | INTERNAL / RETIRED | revoked from browser roles after remediation |
| Sprint3 AUDIT probes | TEST/AUDIT-ONLY | Teacher token + AUDIT mode guards |
| Sprint5 pre029/pre031 functions | INTERNAL / RETIRED | renamed/revoked; current wrappers own browser surface |
| completed Sprint5 state while Sprint6 active | LEGACY-BUT-REQUIRED HISTORY | player renderer prioritizes Sprint6; Teacher aggregate handling is future Sprint7 scope |
| Sprint6 first-generation unguarded functions | RETIRED | browser execution revoked in migration035 |
| Sprint6 guarded functions | INTERNAL | browser execution revoked in migration036 |
| Sprint6 v2 functions | ACTIVE | current player mutation authority |
| `s5_initialize` / `s6_initialize` Teacher buttons | **DANGEROUSLY REQUIRED HANDOFF** | not stale code; currently required out-of-band progression, causing IDA-004 |
| Asset Manager pre024 / direct transition helpers | INTERNAL / RETIRED | reviewer/service-role wrapper model owns current lifecycle |
| V2.3 spec / CA Rules V1.3 | SUPERSEDED GOVERNANCE | current V2.4 / CA V1.4 must govern; not runtime code |

## H3. Dangerous reachability conclusions

### Generic discussion refresher

The generic Sprint2 reader remains in every player refresh and can mutate later Sprint-owned rows. This is the most important legacy-accumulation defect and is already IDA-001.

### Manual cross-Sprint initializer

Teacher initialization is current code, not dead code, but it acts like development scaffolding that became a required production transition. This is IDA-004.

### Other legacy surfaces

No other retired helper was found both:
- browser reachable; and
- able to bypass current formal authority.

## Method 7 disposition

Supported findings:
- IDA-001 HIGH
- IDA-004 HIGH

No new issue ID.
