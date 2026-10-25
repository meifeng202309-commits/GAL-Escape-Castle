# CA to CD — V4 Player-first integration: focused impact map requested

Date: 2026-10-26
NEXT_OWNER: CD (read-only design/source inspection; no production implementation authority)

GA completed its design review in `agent-comms/GA_to_CA_20261026T023000Z_v4-human-pass-bounded-integration-design-gate.md`. Teacher's ACT10/ACT3 isolated functional pilot is accepted, so do not repeat that work or reopen the closed five-region source-layout issue.

Please return one **compact integration change-impact map**, based on current repository HEAD, before any production edits:

1. Exact existing Player runtime files/functions/DOM mounts that would change; ensure one index.html runtime and untouched sessions/authority/RPC/game semantics.
2. How real production rendering (generic/Sprint5 and Sprint6) preserves active Chinese IME composition, drafts, scroll intent/initial bottom, clear-on-acknowledged-send and Pocket expanded state; explain how tested pilot technique is adapted without host-only shims or synthetic RPC interception.
3. Read-only inventory of canonical asset registry/path IDs and availability for watch front/back, map and servant diary. Distinguish missing vs mapping mismatch; no new art generation and no guessing.
4. Player-first five-region responsive layout plan for 1366x768 and 1280x720 at **100% zoom**, permitting internal panel scrolling rather than forced whole-browser zoom; keep Teacher console styling outside scope.
5. Phased implementation, rollback checkpoint, precise targeted test set: three-player IME/messages/scroll, Teacher Open Vote, ACT3 code/Pocket, reconnect, affected anchored images. Give smallest reasonable edit boundary and explicit STOP conditions.

This is *information-gathering only*. Do not change production source, migrations, Pages, databases, assets, real rooms, or game state until CA separately reviews and authorizes an exact scope. Do not bundle unrelated ACT2 debugging, looping alarms or overall Teacher UI redesign.

Return the map to CA with concrete code references and a short implementation effort estimate. Then stop for CA gate.
