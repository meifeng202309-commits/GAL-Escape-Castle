# RECURRING_PATTERN_AND_CANONICAL_OWNERSHIP_CHECK

Baseline: `2acfe324d05c8bea2fb96d7132ba29f894270b38`

## Canonical Ownership Check — CA Rules V1.4

**Result: PASS for the frozen current baseline.**

### Localization

Protected source:

`docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`

Known Sprint6 ownership incident:
- CD initially authored four `runtime.audio.*` rows while closing an implementation gap.
- CA blocked canonical ratification.
- GA/Teacher subsequently reviewed and revised the strings.
- GA Action Log `GA-009/GA-010` records owner action/handoff.
- GA canonical commit: `13e89a09ae80a3cadd2b930275896a9ae558600f`.
- separate CD consumer implementation: `2acfe324d05c8bea2fb96d7132ba29f894270b38`.
- CD consumer commit does not rewrite the protected CSV.

Therefore the current baseline has valid owner-first provenance.

The historical unauthorized write remains audit history but is not an unresolved current-baseline canonical authority violation.

### Governance sources

Current:
- Codex V2.4;
- CA Rules V1.4.

They supersede V2.3 / CA V1.3 and are correctly referenced by current onboarding/status.

### Asset / visual canon

No current Level3 finding was opened for unauthorized Asset Registry / Castle Visual modification.

Actual ACTIVE production audio versions remain absent and are explicitly NOT VERIFIED until Sprint9; that is an asset-integration state, not a canonical ownership violation.

## Consolidated Patterns A–F

| Pattern | Result | Evidence |
|---|---|---|
| A — local correctness / cross-module handoff | **FAIL** | IDA-001: generic DiscussionRoom resolver vs Sprint6 owner; IDA-004: individually correct Sprint blocks do not automatically hand off ACT5→6 / ACT8→9 |
| B — happy path / distributed failure | **FAIL** | IDA-001 appears only at NORMAL deadline/poll; IDA-002 appears on reload/reconnect while same audio state persists |
| C — UI rule vs server rule | **FINDING / NOT VERIFIED** | governed Station B RPC is server-safe, but IDA-003 leaves direct-table protection unverified because authoritative progress table lacks RLS |
| D — current state vs historical evidence | **FAIL** | IDA-005: later Sprint phase/cinematic/audio history is partially overwritten rather than fully append-only |
| E — authority accretion | **FAIL** | IDA-001 is a shared-table multi-owner authority conflict; current protected-canonical ownership itself passes |
| F — self-confirming tests | **FAIL** | Sprint6 E2E uses AUDIT direct-close and manual Teacher initialization; static tests do not test reconnect audio or Station B direct-table privileges |

## Canonical ownership disposition

No additional canonical-authority finding is required.

## Overall consolidated disposition

Current Level3 baseline has:
- 3 HIGH CONFIRMED findings: IDA-001, IDA-004, IDA-005;
- 1 HIGH NOT_VERIFIED security boundary: IDA-003;
- 1 MEDIUM CONFIRMED finding: IDA-002.

Sprint7 cannot be released.
