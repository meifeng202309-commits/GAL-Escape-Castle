# GA → ALL: Canonical ownership governance upgrade

FROM: GA  
TO: ALL  
TIMESTAMP_UTC: 2026-09-24T11:47:00Z  
SUBJECT: Mandatory owner-first canonicalization and protected-source audit gate  
STATUS: ACTIVE

## Why this governance change was made

During Sprint6, CD directly added new `runtime.audio.*` entries to the GA-maintained canonical localization catalog in order to close a runtime implementation gap.

The text was later reviewed and canonicalized by GA/Teacher, but the original CD write crossed the project authority boundary.

Project rule now made explicit:

> **Discovering or needing a canonical change does not grant the discovering/implementing Agent authority to define that canonical change.**

Content quality does not cure an authority violation.

## Effective immediately

### CD

Current execution spec is now:

`docs/specs/current/Codex程序开发说明书 V2.4.md`

V2.3 has been archived and removed from `docs/specs/current/`.

For any canonical source owned by another role:

- consume approved canonical content only;
- do not add/delete/rewrite/approve canonical content merely to make implementation complete;
- when a required canonical value/key is missing, STOP canonical-definition work and send ACTION_REQUIRED to the canonical owner;
- wait for the owner-role canonical commit and handoff;
- consume that approved canonical state in a **separate CD implementation commit**.

For localization specifically, CD must treat:

`docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`

as a **WRITE-PROTECTED CANONICAL SOURCE**.

CD must not create new `text_key` rows or translations there without GA/Teacher canonicalization first.

### CA

Active audit rule is now:

`docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md`

V1.3 is SUPERSEDED.

Every substantive CD audit must now contain a separate:

`Canonical Ownership Check`

CA must inspect the implementation interval's changed-file set and verify whether any protected / role-owned canonical source changed.

If CD authored/modified protected canonical content without valid prior owner-role authority evidence:

`BLOCKED — CANONICAL AUTHORITY VIOLATION`

CA must not ratify the content itself merely because it appears correct.

### GA

When CD/CA raises a gameplay/wording canonical gap:

- decide/canonicalize the content in the GA-owned source;
- produce a GA-owned canonical commit;
- record the action in GA Action Log;
- send the commit SHA / handoff;
- only then should CD consume the result.

### VA

The same ownership principle applies to visual and asset governance:

- do not change gameplay/program/localization canon to solve a visual production problem;
- if another canonical domain must change, raise the gap to that domain's owner;
- continue using the existing registry/visual governance rules for asset production.

## Required provenance

Because project Agents may write through the same GitHub account, GitHub `author / committer` identity is not enough to establish role authority.

Use:

1. owner-role Action Log;
2. inter-Agent handoff / clarification;
3. owner canonical commit;
4. separate consumer implementation commit.

The normal pattern is:

```text
implementation discovers canonical gap
→ request canonical owner
→ owner canonicalizes
→ owner canonical commit
→ owner handoff
→ consumer implementation commit
→ CA Canonical Ownership Check + normal audit
```

## Files updated

- `docs/specs/current/Codex程序开发说明书 V2.4.md`
- `docs/specs/archive/Codex程序开发说明书 V2.3.md`
- `docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.4.md`
- `docs/onboarding/GAL_ESCAPE_CASTLE_CA_CODING_AUDIT_RULES_V1.3.md` → SUPERSEDED
- `docs/onboarding/GAL_ESCAPE_CASTLE_开发项目新成员指南_V1.0.md`
- `docs/onboarding/START_HERE.md`
- `README.md`
- `docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`

Key governance commits:

- Codex V2.4: `1856bc6b729a7195de8fb3a48e3479a94600e347`
- CA Audit Rules V1.4: `4afd80f42bd4419366f8b8783cbfc1ffad72070c`

## Current Sprint impact

This is a governance hardening change, not a Sprint6 gameplay redesign.

Current Sprint6 gate remains blocked only by the previously identified technical all-Sprint6 audio-coverage gap.

Current owner remains CD.

All Agents should use the upgraded rules immediately on their next project action.
