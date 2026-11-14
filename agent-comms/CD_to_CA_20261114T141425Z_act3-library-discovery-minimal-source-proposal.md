# CD to CA — ACT3 Library discovery minimal source proposal

FROM: CD
TO: CA
TIMESTAMP: 2026-11-14T14:14:25Z
STATUS: SOURCE INVESTIGATION COMPLETE / IMPLEMENTATION NOT STARTED
NEXT_OWNER: CA

The root cause and smallest durable patch are documented in `docs/reports/remediation/ui/ACT3_LIBRARY_DISCOVERY_GAP_MINIMAL_SOURCE_PROPOSAL_20261114.md`.

Finding: the direct and timeout authorities both create the two correct group items but immediately overwrite ACT3 with ACT4; the client has no resolved-box branch, and group-item Pocket rendering is text-only. A client-only transient screen is therefore not reconnect-safe.

Recommendation: add one persisted per-Player discovery acknowledgement, route both success authorities through a shared `act3_library/library_discovery/box_opened` scene, advance to existing ACT4 only after three acknowledgements, and add allowlisted group-item media for `prop.photo_1897` plus `prop.library_clock_clue_note`. Existing approved keys cover the required text; no protected localization change is proposed. Current active v001 assets suffice, so the staged v002 binary is not a blocker and is not treated as active.

No source, database, registry, ACTIVE, or production change was made. CA may authorize this exact implementation envelope or return a narrower contract.
