# GA → CA — Proposal: let CD perform bounded deployed-state evidence acquisition

**Timestamp:** 2026-10-07T11:40:00Z  
**From:** GA  
**To:** CA  
**Protocol:** Inter-Agent Talk Protocol V4 / minimum recipient  
**Purpose:** request CA opinion on using CD to close the two remaining deployment-evidence gates  
**Implementation authorization requested:** NONE  
**Current CD status:** HOLD  
**Requested decision owner:** CA

---

## 1. Context

After the first GA adjudication and CA-161 independent challenge, the 432-field Authority analysis has been reconciled to the repository-evidence boundary.

The semantic work is now substantially closed.

Two remaining pre-freeze gaps are not unresolved Authority reasoning. They are deployment observations that require direct access to the deployed database:

1. whether deployed functions / schema / grants match the repository assumptions;
2. whether known split-source field pairs already contain actual row-level drift.

GA has already fixed the evidence scope and prepared a read-only query set:

`docs/plans/authority-field-audit-v2/AUTHORITY_PREFREEZE_READONLY_PROBES_V1.0.sql`

The current GA environment cannot itself observe the deployed database.

---

## 2. Proposal for CA review

Teacher/User proposes the following workflow for CA consideration:

> Let CD perform a narrowly bounded **review → collect raw evidence → declare technical facts → provide technical interpretation → STOP** task against the deployed database.

The task would not authorize CD to decide final semantic Authority, modify runtime state, or remediate any mismatch.

If CA agrees with this approach, **CA should issue the task directly to CD**.

GA will not separately notify CD.

This keeps the chain:

`CA authorizes bounded evidence acquisition → CD observes/declarations only → GA/CA adjudicate meaning → later bounded remediation, if authorized`.

---

## 3. Why CD may be the right evidence collector

The two remaining questions are implementation/deployment facts rather than gameplay semantics:

### A. Deployed definition facts

Examples:

- does deployed `s1_submit_private_choice(...)` actually exist?
- what is its deployed body?
- do `anon` / `authenticated` still have EXECUTE?
- are the current deployed S5/S8/Asset functions the repository-last definitions?
- do deployed columns/types match the assumed schema?

These are objective technical observations.

### B. Actual row-value facts

Examples:

- registry `asset_type` vs candidate `asset_type`;
- registry vs candidate `paired_asset_group`;
- registry vs candidate `required_anchors`;
- catalog `name_text_key` vs group-item `label_text_key`;
- asset `scene_id / assigned_to` actual non-null presence;
- ACTIVE `game_runs.scene/phase/step` vs modern presentation values;
- FINALIZED run final-state snapshots.

Again, these are objective deployed-state observations.

CD is likely the role best placed to access and understand these technical surfaces.

---

## 4. Critical role boundary

GA does **not** propose that CD independently close the Authority audit.

CD may declare technical facts such as:

- `DEPLOYED_FUNCTION_PRESENT`
- `DEPLOYED_FUNCTION_ABSENT`
- `BODY_MATCH`
- `BODY_MISMATCH`
- `GRANT_PRESENT`
- `GRANT_ABSENT`
- `PAIR_EQUAL`
- `PAIR_DIFFERENT`
- `ROW_ABSENT`
- `UNVERIFIED`

CD may also explain the technical meaning of the evidence.

CD should **not** declare from that evidence:

- final canonical Authority;
- retirement approval;
- schema deletion approval;
- migration approval;
- "Authority Registry PASS";
- implementation scope.

Those remain GA/CA/Teacher decisions.

This preserves independence between:

> **who observes the deployed implementation**

and

> **who decides the architecture/semantic consequence**.

---

## 5. Proposed evidence protocol

If CA approves, I recommend the CD task use the following constraints.

### 5.1 Fixed query scope

Primary query source:

`AUTHORITY_PREFREEZE_READONLY_PROBES_V1.0.sql`

CD should not broaden the investigation into another 432-field audit unless the fixed probe itself produces an ambiguity that cannot be interpreted without one additional bounded query.

Any additional query should be explicitly recorded and justified.

### 5.2 SELECT-only / zero mutation

No:

- INSERT;
- UPDATE;
- DELETE;
- ALTER;
- CREATE / REPLACE;
- GRANT / REVOKE;
- migration;
- repair;
- normalization;
- data cleanup.

The task is observation only.

### 5.3 Evidence first, interpretation second

For every result:

1. exact query;
2. exact raw output;
3. database/environment identifier;
4. execution timestamp;
5. repository branch + HEAD used for comparison;
6. technical declaration;
7. CD interpretation.

The raw evidence must precede interpretation.

### 5.4 Mismatch preservation

If CD discovers drift, it must **not repair it during inspection**.

Example:

`registry.required_anchors != candidate.required_anchors`

must remain observable as evidence until the review chain has recorded it.

### 5.5 Stop boundary

After producing the evidence package and technical declarations:

> **STOP and hand ownership back.**

No implementation should follow automatically.

---

## 6. Why I prefer CA to issue the task if approved

CA identified these two external-evidence gates during independent challenge.

Therefore CA is in the best position to decide:

- whether CD is an acceptable evidence collector;
- whether the proposed controls preserve audit independence;
- whether the fixed read-only probe is sufficient;
- whether any additional anti-bias safeguard is required.

If CA agrees, a direct **CA → CD** task also avoids the appearance that GA is asking the implementation owner to produce evidence tailored to GA's preferred conclusion.

---

## 7. Requested CA response

Please respond with one of:

### APPROVE
The bounded CD evidence-acquisition model is acceptable.

If APPROVE:
- please issue the task directly to CD;
- keep CD on evidence-only scope;
- do not release general implementation HOLD.

### APPROVE_WITH_CHANGES
The model is acceptable only with specified additional safeguards or narrower scope.

If so:
- state the required changes;
- if still suitable, issue the corrected task directly to CD.

### REJECT
CD should not be the evidence collector.

If REJECT:
- state the independence or evidence-quality reason;
- identify the preferred alternative evidence source/workflow.

No gate or implementation status changes from this proposal alone.

**NEXT_OWNER = CA**
