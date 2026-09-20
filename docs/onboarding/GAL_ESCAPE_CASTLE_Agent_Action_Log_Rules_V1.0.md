# GAL ESCAPE CASTLE — Agent Action Log & Status Sync Rules V1.0

> Status: ACTIVE after project adoption broadcast  
> Scope: GA / CA / CD / VA  
> Purpose: durable cross-chat project memory with low reading overhead

---

## 1. Purpose and onboarding position

This rule reduces dependence on long chat history while preserving reliable continuity across GA, CA, CD and VA.

Newly started Agent chats must enter the project through:

`docs/onboarding/START_HERE.md`

This file is a mandatory governance module read during onboarding, but it is **not** the first project entry point.

The project uses four shared-memory layers:

### L1 — Canonical Specifications
Answers: **What are the project rules?**

Examples:
- Game Script V4.0
- Codex Development Specification V2.3
- Castle Visual V2.1
- Localization Catalog
- Asset Registry

### L2 — Governance / Collaboration Rules
Answers: **How do the Agents work together?**

Examples:
- Inter-Agent Talk Protocol
- New Member Guide
- this Action Log rule

### L3 — Project Status Snapshot
File:

`docs/onboarding/GAL_ESCAPE_CASTLE_CURRENT_STATUS.md`

Answers: **Where is the project overall right now?**

L3 is a compressed dashboard/checkpoint, not detailed history.

### L4 — Agent Action Logs

- `docs/logs/GA_ACTION_LOG.csv`
- `docs/logs/CA_ACTION_LOG.csv`
- `docs/logs/CD_ACTION_LOG.csv`
- `docs/logs/VA_ACTION_LOG.csv`

Answers: **What concrete project actions occurred after the last checkpoint?**

Agent chat history is temporary working memory, not shared project authority.

---

## 2. Persistent role identity

Agent identity is role-based, not chat-session-based.

Persistent roles are:

- GA
- CA
- CD
- VA

Replacing or restarting a chat session:

- does not create GA-II / CA-II / CD-II / VA-II;
- does not reset the role Action Log sequence;
- does not create a second project identity.

Only one chat session per role may be the **Active Writer** at a time.

When a replacement chat takes over, the previous chat is retired/read-only for project-writing purposes.

---

## 3. Core principle

- Canonical specs = project truth.
- Action Log = durable detailed operational memory.
- CURRENT STATUS = compressed shared memory.
- Agent chat = temporary working memory.

Therefore:

> Important project state must not exist only inside one chat.

---

## 4. Recordable Action

An Agent MUST create one Action Log record when any of the following occurs:

1. a repository file is created, modified, deleted, moved, or replaced;
2. a canonical specification is changed;
3. a new project decision changes future implementation, gameplay, visual production, audit, or collaboration;
4. an ACTION_REQUIRED message from another Agent is processed;
5. a formal inter-Agent message is sent;
6. an implementation unit is completed;
7. an audit or re-audit is completed;
8. a PASS / FAIL / READY / BLOCKED / NOT VERIFIED decision is issued;
9. a new project issue or blocker is discovered;
10. an existing issue or blocker is resolved;
11. a new asset candidate is produced or staged;
12. an asset is reviewed, approved, rejected, activated, or superseded;
13. responsibility for the next action changes from one Agent to another;
14. a required process checkpoint is performed.

Normal explanation, brainstorming, teaching, wording discussion, or minor questions do not require a log entry unless they cause one of the changes above.

Use objective project actions—not a vague concept such as “substantial conversation”.

---

## 5. Action IDs

Each Agent owns one monotonically increasing sequence:

- `GA-001`
- `CA-001`
- `CD-001`
- `VA-001`

Rules:

- never reuse an Action ID;
- each Agent increments only its own sequence;
- a replacement chat continues the same sequence;
- cross-Agent references use the full ID, e.g. `CD-042`, never bare `42`.

---

## 6. Log files and ownership

Paths:

- `docs/logs/GA_ACTION_LOG.csv`
- `docs/logs/CA_ACTION_LOG.csv`
- `docs/logs/CD_ACTION_LOG.csv`
- `docs/logs/VA_ACTION_LOG.csv`

Each Agent normally writes only to its own Action Log.

Do not rewrite another Agent's Action Log unless explicitly authorized for recovery.

---

## 7. Required CSV fields

Columns:

`action_id,timestamp_utc,triggered_by,action_brief,refers_to,outcome_brief,status,next_owner,follow_up,commit_ref`

Meanings:

- `action_id` — Agent-owned sequential ID
- `timestamp_utc` — time the record is created
- `triggered_by` — USER / GA / CA / CD / VA / PROCESS
- `action_brief` — concise action description
- `refers_to` — prior Action ID(s), message, issue, or blank
- `outcome_brief` — concise result
- `status` — action state
- `next_owner` — Agent expected to act next, or blank
- `follow_up` — remaining work / issue / blank
- `commit_ref` — relevant substantive Git commit SHA if applicable

---

## 8. Allowed values

### triggered_by

- USER
- GA
- CA
- CD
- VA
- PROCESS

Use PROCESS for governance-triggered actions such as checkpoint review or reconciliation recovery.

### status

- SETTLED
- OPEN
- PARTIALLY_SETTLED
- WAITING_EXTERNAL
- BLOCKED
- SUPERSEDED

Definitions:

- SETTLED — complete; no follow-up for this issue
- OPEN — unresolved
- PARTIALLY_SETTLED — partly resolved; more work remains
- WAITING_EXTERNAL — this Agent's part is done; waiting for another Agent/user/test/dependency
- BLOCKED — cannot safely continue until blocker is resolved
- SUPERSEDED — later action/canonical decision replaced it

---

## 9. Append-only history

Action Logs are append-only project history.

Do not edit an old row merely because its issue was later resolved.

Example:

`GA-018` = OPEN, Library fallback undefined.

Later:

`GA-021` = SETTLED, refers_to = GA-018, fallback canonicalized.

Do not rewrite GA-018 to SETTLED.

A later row closes or supersedes an earlier row.

---

## 10. Immediate logging — primary mechanism

After a Recordable Action is completed, the Agent SHOULD append its Action Log record immediately.

Preferred order:

1. complete the project action;
2. append the corresponding Action Log record;
3. continue the handoff / user reply.

Immediate logging is the primary protection against memory loss.

---

## 11. Commit-time log reconciliation — mandatory safety net

Before a **substantive GitHub write**, the Agent MUST:

1. read the last row of its own Action Log;
2. identify the current-chat interval after that logged action;
3. review only that interval;
4. ask:  
   **Did any Recordable Action occur after my last logged action that is not yet represented in my Action Log?**
5. if yes, append the missing rows in chronological order;
6. perform the intended substantive GitHub write;
7. append/log that substantive action if required.

This is a recovery check, not the normal logging method.

### Important recursion exception

A GitHub write whose only purpose is to append/update the Action Log itself does **not** trigger another Action Log entry merely for “logging the log”.

Likewise, a pure log-maintenance commit does not recursively require a second reconciliation cycle.

If tooling supports one atomic multi-file commit, the substantive change and its log row may be committed together.

If tooling does not support that, use:

`substantive commit → immediate log append`

and record the substantive commit SHA in `commit_ref`.

---

## 12. Reconciliation scope

Commit-time reconciliation is deliberately narrow.

Do NOT routinely rescan:

- the full conversation;
- the full Action Log;
- all agent-comms;
- all canonical files;
- archived files.

Review only:

> the current chat interval since this role's most recent logged Action.

The objective is missed-action detection, not historical reconstruction.

---

## 13. Forgotten entries

If reconciliation finds missed Recordable Actions:

1. add them in original chronological order;
2. assign the next available Action IDs;
3. use the actual logging time in `timestamp_utc`;
4. mention original timing in `action_brief` or `outcome_brief` if material;
5. do not falsify an earlier timestamp to make the log appear continuous.

---

## 14. Reliability limitation

The platform does not provide a guaranteed project-level hook such as:

- `on_turn_end → write log`
- `before_commit → enforce log`

Therefore “automatic” means a mandatory Agent work rule, not a 100% platform-enforced mechanism.

Reliability is layered:

1. Immediate logging
2. Commit-time reconciliation
3. 10-action checkpoint
4. Gate-event L3 update

---

## 15. 10-action checkpoint

Each Agent performs a checkpoint whenever its own Action ID reaches a multiple of 10:

- GA-010 / GA-020 / ...
- CA-010 / CA-020 / ...
- CD-010 / CD-020 / ...
- VA-010 / VA-020 / ...

At the checkpoint, review only the previous 10-action block and determine:

1. which items remain OPEN / PARTIALLY_SETTLED / WAITING_EXTERNAL / BLOCKED;
2. which actions changed overall project state;
3. whether L3 CURRENT STATUS needs updating;
4. whether any cross-Agent follow-up is missing.

This is compression / garbage collection, not full historical review.

---

## 16. Gate-event immediate L3 update

Do not wait for the next 10-action checkpoint when a major project gate changes.

Update `GAL_ESCAPE_CASTLE_CURRENT_STATUS.md` immediately after:

- Sprint PASS
- Sprint FAIL
- READY_FOR_IMPLEMENTATION
- BLOCKED
- major canonical version change
- major responsibility handoff
- major asset workflow milestone
- release/deployment gate change
- another event that clearly changes what another Agent should do next

L3 therefore updates by either:

- periodic trigger — each role's 10-action checkpoint;
- event trigger — major gate change.

---

## 17. CURRENT STATUS must stay short

CURRENT STATUS is not a log.

It should contain only a compressed snapshot such as:

- current Sprint;
- current gate;
- current owner;
- next required action;
- current canonical versions;
- latest completed Action Log checkpoint for each Agent;
- unresolved cross-Agent blockers;
- major verification status.

Do not accumulate historical narrative.

---

## 18. Checkpoint pointers

Recommended L3 fields:

- `GA_CHECKPOINT`
- `CA_CHECKPOINT`
- `CD_CHECKPOINT`
- `VA_CHECKPOINT`

Example:

- GA_CHECKPOINT = GA-040
- CA_CHECKPOINT = CA-030
- CD_CHECKPOINT = CD-070
- VA_CHECKPOINT = VA-050

A new Agent normally reads only Action Log entries **after** the relevant checkpoint plus unresolved items assigned to its role.

---

## 19. New Agent read pattern

A new chat session normally reads:

1. START_HERE
2. New Member Guide
3. CURRENT STATUS
4. this Action Log rule
5. role-specific canonical sources
6. own Action Log entries after checkpoint
7. unresolved items with `next_owner = own role`
8. newer relevant agent-comms

It does not read its entire Action Log by default.

---

## 20. Existing “old” Agent behavior

An already trained Agent may continue using its chat memory as working context.

However:

- chat memory is not project authority;
- Recordable Actions must still be externalized;
- important state cannot remain only in chat;
- canonical sources win over chat memory;
- newer shared project records win over stale chat memory.

---

## 21. Inter-Agent communication and logs

Sending or processing a formal inter-Agent message is Recordable.

The Action Log records the project consequence.

`agent-comms` retains the detailed message body.

Do not duplicate the full letter into the Action Log.

---

## 22. Canonical updates and logs

When a canonical source changes:

- canonical file = actual rule;
- Action Log = record that the rule changed;
- agent-comms = handoff if another Agent must act;
- CURRENT STATUS = changes only if checkpoint/gate criteria are met.

These surfaces have different purposes and should not duplicate one another unnecessarily.

---

## 23. commit_ref

If a Recordable Action produces a substantive GitHub commit, record that commit SHA in `commit_ref`.

If no substantive commit exists, leave it blank.

Do not use the Action Log maintenance commit itself as the substantive `commit_ref` merely to fill the field.

---

## 24. No logging of pure noise

Do not log:

- ordinary explanation;
- informal brainstorming with no adopted decision;
- repeated restatement of an existing rule;
- routine Q&A with no project change;
- praise / acknowledgment;
- minor wording discussion with no approved change;
- speculative ideas not adopted.

L4 is project continuity, not conversation transcription.

---

## 25. Relationship to the ~5% governance rule

The logging system must not become bureaucracy.

Do not add further checkpoints or validation layers for hypothetical sub-~5% risks unless a hard invariant is threatened.

Hard exceptions remain:

- secrets/security;
- destructive data loss;
- silent canonical/runtime identity corruption;
- overwrite of immutable history;
- silent security bypass.

Goal:

> enough durable memory to make chat replacement safe without recreating the burden of reading the entire project history.

---

## 26. Historical boundary

The Action Log system begins at adoption.

Do **not** retroactively reconstruct every past project conversation.

Earlier history remains represented by:

- current canonical specs;
- accepted reports;
- existing agent-comms;
- current repository state.

Historical chats are consulted only when current sources are insufficient, a bug requires tracing, or the user explicitly requests it.

---

## 27. Working model

```text
Canonical Specs (L1)
       ↓
Governance Rules (L2)
       ↓
CURRENT STATUS (L3)
       ↑
 checkpoint / gate updates
       ↑
GA / CA / CD / VA Action Logs (L4)
       ↑
Agent chats = temporary working memory
```

Operationally:

```text
Recordable Action
    ↓
Immediate L4 log
    ↓
Before substantive GitHub write:
reconcile since last own log
    ↓
GitHub write
    ↓
Immediate log append if needed
    ↓
Every 10 actions:
L3 checkpoint review

Major gate event:
immediate L3 update
```
