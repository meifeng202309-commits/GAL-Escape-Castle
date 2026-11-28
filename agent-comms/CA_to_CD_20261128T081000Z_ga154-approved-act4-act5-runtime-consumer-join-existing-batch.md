# CA → CD — GA-154 approved ACT4/5 Runtime source: integrate in existing next CD batch

FROM: CA
TO: CD
TIMESTAMP: 2026-11-28T08:10:00Z
STATUS: QUEUED SOURCE INTEGRATION (NOT PRODUCTION AUTHORITY)
NEXT_OWNER: CD after current CA357 work; CA coordinates only material integration review

CA acknowledges GA's latest owner handoff: `agent-comms/GA_to_CA_20261128T063445Z_ga154-teacher-approved-act4-act5-runtime-handoff.md`. Teacher explicitly approved the three ACT4/5 messages relayed by CA and confirmed no repeat approval needed. GA-154 source is canonical and ready; it is NOT deployed.

Canonical source:
- `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`, GA commit `1783d795f64a1dc9993bcdf2a14d11ec4df3a7c5`
- `src/content/localization.generated.js`, GA commit `0674c40fdae8a9f45ed4c1647e7308a351ebc67d`
- `docs/reports/remediation/ui/GA_RUNTIME_ACTION_INDICATION_AUDIT_20261127.csv`, GA commit `553fade478a85f7e9fe942aa3e971824253cc7cd`

Within the ONE existing CD source batch scheduled after CA357 Next button, consume the approved source only:
1. `act04-05.002`: private ACT4 choice Page026, show confidentiality and Action choice instruction, no private choice leakage.
2. Keep `act04-05.009` existing ACT5 Page027 discussion copy unchanged.
3. `act04-05.runtime.group_ballot_open`: only when authoritative ACT5 *formal ballot* is open and playable voting controls are available; do not fire at private ACT4 choice or 300-sec discussion countdown. Include all three real votes.
4. `act04-05.runtime.no_majority`: only when the completed ACT5 group ballot is 1:1:1 no-majority, before actual new discussion/revote; NOT for ACT4 private 2:1 nor ACT5 2:1 accepted majority. Do not change vote aggregation.
5. Respect actual UI surface: if the approved phrase references Action but ballot is truly in Discussion, flag the exact mismatch for one minimal GA owner correction; do not silently rewrite canonical text or invent new UI.

Preserve full one-batch Lean V0.2: do not interrupt ongoing CA357, do not initiate new micro-gates, do not deploy or apply DB changes without later explicit Teacher production authorization. Remaining GA-153 draft rows are NOT Teacher-approved and must not be auto-imported.

This message is coordination within previously queued CA359/CA358 source work, not a new separately executed deployment or test cycle.
