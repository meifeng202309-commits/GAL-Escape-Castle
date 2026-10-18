# CA Audit Cadence — Two-Work-Packet Pilot
Date: 2026-10-18
Owner: CA
Status: ACTIVE PILOT — process scheduling only, not a new canonical or production permission

## Decision and basis
Teacher approved fewer interruptions after review of the recent 20 CA↔CD communications. CD generally obeys task boundaries and stop conditions; initial test coverage has sometimes required corrective iterations. CA Audit Rules V1.4 remains ACTIVE and takes precedence. This pilot reorganizes **when** audits happen, not **whether** mandatory gates apply.

## Pilot duration
Two consecutive self-contained CD work packets, beginning with the currently approved 071 release-document/evidence packet. Review pilot results after both; do not automatically edit governance V1.4.

## Cadence
1. LOW-RISK source-only tests, documentation and presentation-preserving changes: CD completes the entire defined packet, self-reviews against its acceptance matrix, runs local checks and sends one consolidated CA handoff. CA does not require interim reviews for each file or minor test correction. CD can fix issues within its authorized source-only scope without new CA exchanges.
2. MEDIUM-RISK multi-file frontend/module packets: one predeclared change-impact/authority boundary, then one consolidated functional + regression audit at packet completion. New authority semantics or scope changes remain gated.
3. HIGH-RISK SQL, DB authority, privileges, migrations, protected canonical modifications or public deployment: retain independent pre-execution approval, immediate operational preflight, and post-deployment/rollback verification. Never bundle production mutation into a source-only packet.
4. CD may continue autonomously within agreed files, behavior, acceptance criteria and explicit no-go boundaries. Escalate only a genuinely blocking ambiguity, material scope expansion, newly discovered high-impact risk, or failed required gate.
5. CD handoff includes concise requirements-to-evidence matrix, exact changed files/diff, test commands/results, NOT VERIFIED items, authority check, rollback path when relevant, and one explicit requested CA gate.

## Work packet 1 — 071 readiness documentation
CD owns a consolidated, source/document-only 071 readiness packet: corrected ACT5→ACT6 fixture sequence, NORMAL and AUDIT test coverage, planned read-only SQL vote/event invariants, LF/CRLF raw-vs-normalized fingerprints, exact frozen Pages two-file candidate, six-function ACL / service-role lock, rollback steps and open uncertainties. CD can repair tests/docs within this precise packet and run local checks without intermediate CA handoffs. CA audits **one complete packet**, rather than each component. Production migration 071, Pages/ACL writes, synthetic data cleanup and actual live tests are NOT AUTHORIZED.

## Work packet 2
Next CD packet should be defined jointly from verified post-packet-1 results, preferring a cohesive bounded debug implementation unit rather than arbitrary fragments. Before it starts, CA identifies the mandatory authority and risk gates. No preauthorization of unknown runtime/database scope.

## Pilot assessment
Compare number of CA↔CD handoffs, first-pass packet acceptance, significant omissions, regression evidence and elapsed lead time. Preserve independent falsification and canonical-ownership check. Revert to narrower cadence if HIGH/MEDIUM defects recur or CD misses required coverage at packet boundaries.
