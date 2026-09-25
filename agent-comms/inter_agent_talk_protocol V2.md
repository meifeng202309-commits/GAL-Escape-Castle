# Inter-Agent Talk Protocol V2

Project: GAL Escape Castle  
Protocol version: V2  
Status: SUPERSEDED BY V3  
Supersedes: Inter-Agent Talk Protocol V1  
Applies to: CA, VA, GA, CD, ISA

---

# 1. Purpose

This protocol defines how the five project Agents communicate through the shared GitHub repository without requiring the user to manually copy messages between conversations.

Shared communication directory:

```text
agent-comms/
```

The protocol covers:

- Agent names and aliases;
- Agent responsibilities;
- message naming;
- message discovery;
- sender / receiver rules;
- attachment naming;
- versioning of this protocol;
- communication safety.

This protocol does not replace the game script, Castle Visual, Codex development specification, Asset Registry, or any runtime specification.

---

# 2. Agent Names and Aliases

The following names and aliases are canonical.

| Alias | Full Name | Primary Responsibility |
|---|---|---|
| CA | Coding Audit Agent | Audit Codex implementation for bugs, logic gaps, runtime reliability, and compliance with the current game script/specifications |
| VA | Visual Agent | Produce and review game visuals according to Castle Visual, visual continuity rules, canonical asset identity, and approved asset workflow |
| GA | Game Design Agent | Maintain and refine game narrative, interaction logic, behavior-analysis design, scene requirements, and game-script consistency |
| CD | Codex | Implement the game code, database changes, runtime systems, tests, deployment-related code changes, and technical fixes within approved scope |
| ISA | Implementation Support Agent | Implement bounded support/mechanical work inside CA-assigned ownership envelopes and CD-owned frozen semantic/interface contracts; no independent architecture, migration, canonical, audit, or release authority |

These aliases must be used in inter-Agent filenames and message headers.

Do not invent alternate aliases.

Canonical mapping:

```text
Coding Audit Agent = CA
Visual Agent       = VA
Game Design Agent  = GA
Codex              = CD
Implementation Support Agent = ISA
```

---

# 3. Coding Audit Agent Role

The previous "Coding Manager" role is renamed:

```text
Coding Audit Agent
Alias: CA
```

CA's primary responsibility is not to act as the main implementation developer.

CA audits CD's work.

CA should check whether Codex implementation:

1. contains coding bugs or unsafe logic;
2. can run reliably under the intended multiplayer/runtime conditions;
3. matches the current canonical game script;
4. matches the current Codex development specification;
5. preserves previously verified functionality;
6. introduces regressions;
7. violates state-machine rules;
8. mishandles database identity, concurrency, reconnect, voting, timers, assets, or export semantics;
9. creates security/privacy risks;
10. leaves implementation gaps that can cause the game to fail in real classroom use.

Typical CA outputs:

```text
PASS
FAIL
BLOCKED
NOT VERIFIED
```

CA must distinguish:

- code review;
- deployment verification;
- live E2E verification.

CA must not claim a runtime path is verified merely because code appears correct.

---

# 4. Responsibility Boundaries

## CA — Coding Audit Agent

Owns:

- Codex code audit;
- implementation/spec compliance review;
- regression-risk review;
- database/runtime logic review;
- test adequacy review;
- deployment/live verification when tools allow;
- identification of unresolved engineering risks.

CA may propose fixes, but CD remains the default implementation Agent unless the user explicitly assigns implementation to CA.

## VA — Visual Agent

Owns:

- visual production;
- Castle Visual compliance;
- continuity;
- recurring-prop consistency;
- canonical visual asset workflow;
- production-image staging;
- paired visual review;
- UI-safe composition.

VA must not silently alter gameplay logic.

## GA — Game Design Agent

Owns:

- game script;
- scene logic;
- narrative consistency;
- player interaction design;
- behavioral-observation logic;
- puzzle and branch logic;
- definition of what the game must do.

GA must not silently redefine implementation constraints already locked by current engineering specifications without flagging the conflict.

## CD — Codex

Owns:

- implementation;
- source-code changes;
- database migrations;
- runtime modules;
- tests;
- technical fixes;
- approved deployment changes.

CD must implement the current canonical specifications and must report conflicts rather than silently redesigning them.

## ISA — Implementation Support Agent

Owns only bounded work explicitly assigned under:

`docs/onboarding/GAL_ESCAPE_CASTLE_CD_ISA_COOPERATION_RULES_V1.0.md`

ISA may implement low-authority/support work inside a frozen semantic/interface contract.

ISA must not independently own or redefine:
- architecture or server-authoritative semantics;
- migration numbering/creation/deployment;
- persistence/security/lifecycle authority;
- canonical gameplay/localization/visual meaning;
- audit dispositions or release status.

CD remains final integration/accountability owner for ISA artifacts entering the audit baseline; CA remains independent auditor and work-allocation/governance owner under the cooperation rules.

---

# 5. Shared Communication Directory

All inter-Agent messages are stored under:

```text
agent-comms/
```

This directory is a persistent shared communication surface.

Do not use `agent-comms/` for production game assets.

Production asset staging belongs under the dedicated asset workflow, for example:

```text
assets/staging/
```

Binary communication tests may use:

```text
agent-comms/_binary-test/
```

---

# 6. Message Filename Rule

Every one-to-one Agent message must use:

```text
<sender>_to_<receiver>_<YYYYMMDDTHHmmssZ>_<subject>.md
```

Where:

- `sender` = CA / VA / GA / CD / ISA
- `receiver` = CA / VA / GA / CD / ISA
- timestamp = UTC
- format = `YYYYMMDDTHHmmssZ`
- subject = short lowercase kebab-case description

Examples:

```text
CA_to_VA_20260918T071800Z_asset-workflow-review.md
VA_to_CD_20260918T072145Z_clock-room-assets.md
CD_to_CA_20260918T073012Z_sprint2-implementation-ready.md
GA_to_CA_20260918T074201Z_script-logic-update.md
```

Do not use ROUND numbers for normal long-term communication.

---

# 7. Broadcast Message Rule

A message intended for all five Agents uses:

```text
<sender>_to_ALL_<YYYYMMDDTHHmmssZ>_<subject>.md
```

Example:

```text
CA_to_ALL_20260918T080000Z_visual-asset-workflow-report.md
```

Receiver alias:

```text
ALL
```

means:

- CA
- VA
- GA
- CD
- ISA

---

# 8. How a Receiver Finds the Latest Message

When the user or another Agent says:

```text
Check the latest message from CA.
```

the receiver must:

1. open `agent-comms/`;
2. determine its own alias;
3. find files matching:

```text
CA_to_<receiver>_*
```

4. also check relevant:

```text
CA_to_ALL_*
```

5. parse timestamps from matching filenames;
6. select the newest relevant timestamp;
7. read that file directly from GitHub;
8. do not rely on chat memory if a newer GitHub message exists.

Example for VA:

```text
CA_to_VA_*
CA_to_ALL_*
```

The latest matching timestamp is authoritative for "latest message."

---

# 9. Message Body Format

Every normal inter-Agent message should begin with:

```text
FROM: <alias>
TO: <alias or ALL>
TIMESTAMP: <UTC timestamp>
SUBJECT: <short subject>
STATUS: <message status>
```

Recommended statuses include:

```text
FOR_REVIEW
ACTION_REQUIRED
READY_FOR_IMPLEMENTATION
READY_FOR_AUDIT
INFORMATION
BLOCKED
RESOLVED
```

Then include the actual content.

When relevant, include:

```text
SOURCE FILES:
RELATED COMMIT:
DECISION:
OPEN ISSUES:
REQUESTED ACTION:
ACCEPTANCE CONDITION:
```

Not every field is mandatory; use only relevant fields.

---

# 10. Reply Rule

A reply must create a new file.

Never overwrite the sender's message.

Example:

```text
CA_to_CD_20260918T090000Z_sprint2-audit.md
```

CD replies with:

```text
CD_to_CA_20260918T091500Z_sprint2-audit-response.md
```

This preserves audit history and avoids write conflicts.

---

# 11. Attachment Rule

Communication attachments should use the same sender/receiver/timestamp identity when practical.

Example:

```text
VA_to_CA_20260918T100500Z_clock-room-preview.webp
VA_to_CA_20260918T100500Z_clock-room-preview.json
VA_to_CA_20260918T100500Z_clock-room-review.md
```

These are communication artifacts only.

Production game assets must follow the separate canonical asset naming/versioning rules.

---

# 12. Protocol Versioning

This protocol itself uses simple sequential versions:

```text
inter_agent_talk_protocol V1.md
inter_agent_talk_protocol V2.md
inter_agent_talk_protocol V3.md
...
```

Do not overwrite a previous protocol version.

When the protocol changes:

1. create the next integer version;
2. preserve earlier versions;
3. mark the new version as ACTIVE;
4. state which previous version it supersedes;
5. all five Agents should use the highest ACTIVE version.

Protocol versioning does not use timestamps because protocol revisions are infrequent and sequential version numbers are easier to read.

---

# 13. Latest Protocol Rule

Before performing an inter-Agent communication workflow, an Agent should check for:

```text
agent-comms/inter_agent_talk_protocol V*.md
```

and use the highest ACTIVE version.

If two files appear to claim ACTIVE status unexpectedly, stop and report:

```text
PROTOCOL VERSION CONFLICT
```

Do not guess which protocol governs.

---

# 14. Source-of-Truth Rule

Inter-Agent messages may discuss or propose changes, but they do not automatically replace canonical project specifications.

Examples of canonical project sources include:

- current game script;
- current Codex development specification;
- current Castle Visual;
- canonical Asset Registry once established;
- verified database migrations;
- approved runtime configuration.

If an Agent message conflicts with a canonical specification:

1. report the conflict;
2. do not silently choose one;
3. request or record an explicit resolution;
4. update the canonical source if a change is approved.

---

# 15. Communication Safety Rules

All Agents must follow these rules:

1. Do not overwrite another Agent's message.
2. Do not rewrite communication history to make a later result appear earlier.
3. Do not claim a file was written unless GitHub confirms it.
4. Re-read critical handoff files after writing when practical.
5. Do not claim binary upload success without verifying path/blob/non-zero size.
6. Do not place secrets, service-role keys, passwords, private tokens, or credentials in agent-comms.
7. Do not use agent-comms as production runtime storage.
8. Do not modify unrelated project files during a communication-only task.
9. Do not treat a proposal in agent-comms as implemented until the responsible Agent actually implements it.
10. Preserve commit references when a message depends on a specific code state.

---

# 16. Recommended Communication Patterns

## GA → CD

Use when:

- a scene requirement changes;
- new interaction logic is defined;
- implementation requirements need clarification.

## CD → CA

Use when:

- implementation is complete;
- a migration is ready;
- a bug fix needs audit;
- test results need independent review.

## CA → CD

Use when:

- code audit finds defects;
- implementation deviates from script;
- runtime verification fails;
- a regression risk is identified.

## VA → GA

Use when:

- visual constraints conflict with game logic;
- a required visual cannot satisfy the current scene design;
- continuity requires a game-design clarification.

## GA → VA

Use when:

- a visual requirement changes;
- a scene needs a new visual;
- a paired setup/payoff relationship is changed.

## VA → CA / CD

Use when:

- asset identity/path/version affects implementation;
- visual asset staging is ready for technical integration;
- an image/overlay technical issue may break runtime behavior.

## CA → ALL

Use for:

- cross-system audit reports;
- shared workflow rules;
- integration risks affecting multiple Agents.

## CA → ISA

Use when:
- allocating an ISA ownership envelope/work package;
- reclassifying ISA scope;
- reporting an ISA cooperation/authority process issue.

## CD → ISA

Use when:
- providing the CD-authored frozen interface/contract;
- instantiating an ISA micro-task inside a standing CA envelope;
- requesting bounded support implementation.

## ISA → CD

Use when:
- returning `IMPLEMENTATION_READY_FOR_CD_REVIEW`;
- reporting `BLOCKED_NEEDS_CD_DECISION`;
- documenting changed files, tests, assumptions and authority/canonical state.

## ISA → CA

Use only when required by the cooperation rules, including:
- a material allocation/authority conflict;
- an unresolved scope violation;
- a cooperation-governance handoff.

Routine ISA implementation handoff normally goes to CD.

---

# 17. No Autonomous Background Loop

GitHub provides a durable shared communication channel, but Agents do not continuously run in the background.

A receiving Agent must still be invoked in its own conversation or execution context.

Once invoked, the Agent can be instructed simply:

```text
Check the latest message from <sender>.
```

The Agent should then discover the correct file using this protocol without requiring the user to copy the message contents manually.

---

# 18. V2 Activation

This file extends the long-term inter-Agent communication protocol to the active ISA role and supersedes V1.

Effective aliases:

```text
CA  = Coding Audit Agent
VA  = Visual Agent
GA  = Game Design Agent
CD  = Codex
ISA = Implementation Support Agent
```

Effective directory:

```text
agent-comms/
```

Effective one-to-one filename rule:

```text
<sender>_to_<receiver>_<YYYYMMDDTHHmmssZ>_<subject>.md
```

Effective broadcast filename rule:

```text
<sender>_to_ALL_<YYYYMMDDTHHmmssZ>_<subject>.md
```

Effective protocol version rule:

```text
V1 → V2 → V3 → ...
```

This protocol supersedes the earlier ROUND-based test convention for normal future Agent communication.
