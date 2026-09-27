# GAL Escape Castle — Trial Agent Rules V0.1

Status: **DRAFT / EXPERIMENTAL — NOT YET AN ACTIVE CA AUDIT RULE**  
Owner: GA / Teacher for experiment design; CA remains the authority for technical audit disposition.

## 1. Purpose

Trial Agents provide a **blind black-box player-experience test surface** that is intentionally different from CA's source/spec/state-oriented independent audit.

The objective is not to determine whether the implementation matches the code/spec from the inside. The objective is to answer:

> Can a first-time player, using only what the rendered game tells them, understand and complete the game?

Trial Agent evidence is symptom-level evidence. It does not replace CA diagnosis, severity assignment, canonical interpretation, or release authority.

---

## 2. Core roles

Minimum player trial:

- **Trial-G** — acts only as Gitte / GAL-A.
- **Trial-A** — acts only as Anna / GAL-B.
- **Trial-L** — acts only as Linda / GAL-C.

Optional full black-box trial:

- **Trial-T** — acts only as Teacher through the Teacher Console.

Trial-T is recommended when the test target includes room creation, run startup, Teacher controls, observation, recovery, or export. If Trial-T is absent, a human/runner may perform only the minimum Teacher setup required to make the player trial possible and must not tell players what the game is supposed to do.

---

## 3. Blindness requirement

Before a trial starts, Trial-G/A/L/T must **not** read or receive:

- game scripts/specifications;
- source code;
- database schema/migrations;
- CA audit reports or findings;
- GA/CD/VA/ISA communications;
- expected ACT sequence;
- expected choices or correct answers;
- asset registry;
- bug lists;
- prior trial logs;
- implementation architecture.

A Trial Agent may be told only:

1. its role identity;
2. the game URL or Teacher Console URL;
3. room/join credentials needed to enter the assigned role;
4. the goal: **use the page as presented and try to play the game to completion**.

The agent must not be told what page/state should come next.

---

## 4. Isolation requirement

Each player Trial Agent must run in an independent execution context:

- separate browser profile/context;
- separate localStorage/sessionStorage/cookies;
- separate Agent conversation/memory;
- no shared hidden scratchpad;
- no cross-Agent orchestration messages containing observations or expected actions.

Trial-G/A/L may communicate with one another **only through communication mechanisms exposed by the game itself**.

The runner may synchronize infrastructure such as launching browsers, but must not coordinate gameplay choices on the players' behalf.

---

## 5. Allowed information and actions

A Trial Agent may use only what a normal player can perceive or do through the rendered UI:

- read visible text;
- view rendered images/animations;
- hear available audio;
- inspect visible button labels and form fields;
- scroll;
- click/tap visible controls;
- type into visible inputs;
- wait;
- use normal browser refresh/back only when a reasonable player might do so.

If refreshing/back is used as a recovery attempt, the Agent must first record that it was stuck or confused.

The Agent may reason from visible page information, but must not infer hidden implementation state.

---

## 6. Prohibited self-rescue

Trial Agents must not:

- open Developer Tools;
- inspect DOM/source/hidden fields;
- inspect network requests;
- execute JavaScript manually;
- query Supabase/database/API directly;
- inspect GitHub/repository files;
- inspect logs;
- search the web for game instructions;
- ask GA/CA/CD/VA/ISA what should happen next;
- ask another Trial Agent outside the game;
- use prior project memory;
- continue by guessing a hidden route that the page does not communicate.

If the page does not provide enough information to proceed, that is evidence. The Agent should report **STUCK / UNCLEAR**, not repair the experience itself.

---

## 7. Neutral first-round behavior

The first blind trial uses neutral players.

Trial-G/A/L should:

- read the page normally;
- make a reasonable choice when a choice is offered;
- not intentionally sabotage the game;
- not intentionally hunt for edge cases;
- not imitate a scripted personality;
- not coordinate a pre-planned route.

This first round tests ordinary first-use actionability.

Stress/persona trials come later.

---

## 8. Asynchronous execution

The three players must not be forced into artificial turn-taking such as:

`G → A → L → G → A → L`.

They should operate independently with natural timing variation.

Recommended neutral timing:
- ordinary reading/choice delay: variable, roughly 2–20 seconds;
- one player may naturally be slower than the others;
- no player is told to wait merely to preserve a deterministic order.

This is intended to expose:
- waiting-state clarity;
- stale polling/state;
- concurrency defects;
- late-player behavior;
- timing assumptions;
- discussion/vote synchronization.

---

## 9. Player-experience invariants

Trial Agents observe, but do not technically diagnose, the following player-facing properties.

### P1 — Actionability
For every nonterminal state:
- is there a clear next action;
- or, if the player must wait, is it clear **that** they must wait and **why**?

### P2 — Responsiveness
After a visible action:
- does the page visibly acknowledge the action;
- does it change state or explain why it cannot?

### P3 — Visual availability
Record what is actually visible:
- meaningful scene image;
- explicit temporary placeholder;
- broken image;
- blank/empty visual region;
- text-only state.

Do not infer that an image is required from the hidden spec.

### P4 — Audio availability
When audio is presented or obviously triggered:
- was sound heard;
- was fallback/status visible if not;
- did playback create an unexplained stall or repeat?

### P5 — Information boundary
Record any information about other players that becomes visible:
- choices;
- private text;
- readiness;
- votes;
- role information.

Do not decide whether disclosure is canonical; CA evaluates that later.

### P6 — State consistency
Record contradictory visible states, e.g.:
- started vs not started;
- waiting vs action enabled;
- completed vs still actionable;
- one panel disagreeing with another.

### P7 — Identity/session continuity
Record whether the player:
- remains the same role after refresh/reconnect;
- loses progress;
- sees another role/session;
- cannot resume.

### P8 — Comprehension
Record confusing terms, unexplained controls, unclear labels, or cases where the Agent cannot determine what the page is asking.

### P9 — Completion
Record whether the player can reach the game's natural ending without outside instructions.

---

## 10. STUCK rule

A Trial Agent declares `STUCK` when any of the following occurs:

- no visible next action and no clear waiting instruction;
- a reasonable visible action produces no observable response after an appropriate wait;
- the page enters a contradictory state that gives no safe way forward;
- the Agent has made up to three reasonable UI-level recovery attempts and still cannot proceed.

Recommended default wait before declaring an unresponsive action:
- ordinary local UI action: 5–10 seconds;
- multiplayer synchronization: up to 30 seconds unless the UI communicates a longer timer;
- explicit countdown: wait according to the countdown.

The Agent must not invent a hidden next step after declaring STUCK.

---

## 11. Logging format

Each Trial Agent maintains its own append-only Player Experience Log.

Minimum fields:

| Field | Meaning |
|---|---|
| timestamp | local trial time |
| role | Trial-G / A / L / T |
| visible state | page title / key visible text / visual/audio state |
| action taken | click/type/wait/refresh |
| reason | why this action seemed reasonable from the page |
| response | what visibly changed |
| next_action_clear | YES / NO / WAITING-CLEAR |
| issue_tag | optional symptom tag |
| note | concise observation |

Recommended symptom tags:

- `NO_CLEAR_NEXT_ACTION`
- `ACTION_NO_VISIBLE_RESPONSE`
- `BROKEN_OR_MISSING_VISUAL`
- `AUDIO_NOT_HEARD_OR_UNCLEAR`
- `CONTRADICTORY_STATE`
- `UNEXPECTED_PEER_INFORMATION`
- `WAITING_REASON_UNCLEAR`
- `SESSION_OR_RECONNECT_PROBLEM`
- `CONTROL_LABEL_UNCLEAR`
- `LAYOUT_OR_VISIBILITY_PROBLEM`
- `STUCK`

Agents report **symptoms**, not root causes.

---

## 12. Trial output and technical handoff

After the run:

1. preserve the three/four independent logs;
2. create a merged timestamped timeline without altering the original logs;
3. preserve screenshots for each issue when possible;
4. assign a Trial Finding ID such as `TA-001`, `TA-002`;
5. send the symptom evidence to CA.

CA then:
- reproduces where possible;
- compares against canonical requirements;
- determines whether it is a defect, usability issue, expected behavior, or NOT VERIFIED;
- assigns severity;
- identifies owning role;
- links related CA findings when appropriate.

Trial Agents must never declare:
- PASS;
- audit closure;
- canonical violation;
- release readiness;
- root cause.

---

## 13. Trial rounds

### Round 1 — Neutral first-use path
Goal: can three first-time players understand and finish the game using only the UI?

No deliberate edge-case behavior.

### Round 2 — Timing variation
Introduce natural fast/slow players and delayed responses.

Goal: waiting/concurrency/state clarity.

### Round 3 — Recovery
One player refreshes/reconnects at selected natural points after first recording the pre-refresh state.

Goal: continuity and recovery.

### Round 4 — Disagreement / voting stress
Players independently choose different reasonable options.

Goal: discussion, vote, tie/revote, and missing-player actionability.

Additional rounds should be added only when a concrete risk warrants them.

---

## 14. Fresh-eyes rule

Trial Agents are disposable.

After a completed run:
- do not reuse their conversation memory for the next neutral first-use run;
- start new Trial-G/A/L/T instances;
- use a new room/run;
- do not provide previous findings to the new agents.

This preserves the value of genuinely fresh observation.

---

## 15. Relationship to CA Methods 1–9

This draft does **not** replace or weaken CA's Methods1–9.

It covers a different failure surface:

```text
Methods1–9:
inside-out / source / state / authority / evidence correctness

Blind Trial Agents:
outside-in / rendered experience / actionability / actual interaction
```

A future governance decision may designate this as a supplemental **Method10 — Blind Player Black-box Trial**, but V0.1 remains experimental until Teacher/GA and CA evaluate its added value on a real run.
