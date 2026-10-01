# Visual State Timeline + Action/Control Event Log — Design V0.1

## 1. Objective

Build a generic sidecar observer that can reconstruct what a browser participant actually experienced without changing the observed application.

The primary questions are:

1. What distinct rendered states did the participant see?
2. What controls did the participant activate?
3. Did each activation produce observable browser/network behavior?
4. Which state existed immediately before and after each action?
5. Which state changes happened automatically without that participant acting?
6. Can several participant timelines later be aligned by timestamp?

The observer is evidence infrastructure. It is not a gameplay oracle.

## 2. Hard boundary: target application remains untouched

V0.1 must not require any target-app change.

Forbidden dependencies include:

- importing target-app JavaScript;
- importing target-app tests;
- calling target-app RPCs directly;
- querying the target database;
- adding target-app debug hooks;
- adding target-app test-only selectors;
- changing target-app rendering/state transitions.

The observer may use only browser-visible or browser-network evidence available through Playwright.

## 3. Core state-inheritance model

Screenshots belong to states, not actions.

```text
S0001
  |
 A0001
  |
S0002
  |
 A0002
  |
S0003
```

Relations:

```text
A0001.before_state_id = S0001
A0001.after_state_id  = S0002

A0002.before_state_id = S0002
A0002.after_state_id  = S0003
```

Therefore the image for S0002 is stored once.

If A0001 produces no meaningful visible change:

```text
A0001.before_state_id = S0001
A0001.after_state_id  = S0001
```

No second screenshot is written.

## 4. Automatic transitions are first-class evidence

A multi-user application may change while one participant does nothing.

Examples:

- another participant completes a choice;
- a vote resolves;
- polling retrieves a new authoritative state;
- a deadline changes phase;
- a reconnect completes;
- a server-triggered transition renders.

The observer therefore captures meaningful state changes independently of click events.

```text
S0010 waiting for peer
   |
   | automatic server/poll update
   v
S0011 reveal
```

This is recorded even though no local action exists between the states.

## 5. Capture architecture

One observer process monitors one browser participant.

```text
External controller / human / agent
             |
             v
        Browser page
             |
       target web app

Observer sidecar:
- DOM event probe
- MutationObserver
- screenshot capture
- network response listener
- failed-request listener
- console/page error listener
- state/action correlation
- evidence writer
```

For a four-role experiment, run four independent observer processes.

## 6. Browser instrumentation

The observer injects a generic browser probe through Playwright.

It observes:

- actual DOM click events on interactive controls;
- form submissions not already represented by a click;
- pointer attempts that do not lead to a click;
- debounced DOM mutations;
- History API changes;
- popstate/hashchange.

It does not read or record form input values into textual logs.

## 7. Meaningful-state detection

Naively capturing every DOM mutation is unusable because:

- countdown timers can change every second;
- polling can re-render equivalent content;
- animations can create transient mutations.

V0.1 uses a two-stage filter.

### Stage A — semantic projection

The observer derives a generic projection containing:

- URL path;
- title;
- body text;
- visible interactive controls and their states;
- visible landmarks/dialogs/alerts/status regions;
- visible image sources/alt text;
- viewport/document dimensions.

Timer-like strings are normalized so ordinary countdown ticks do not normally create a new semantic state.

### Stage B — screenshot hash

When the semantic state differs, capture a full-page PNG.

If the PNG is byte-identical to the current screenshot, reuse the current state.

This keeps the persisted state timeline compact while preserving actual rendered evidence.

## 8. Action/control evidence

For each actual click/form activation:

```text
action_id
started_at
finished_at
participant label
event type
target metadata
before_state_id
after_state_id
network evidence
browser errors
observer classification
```

Target metadata intentionally excludes typed values.

Useful metadata:

- tag;
- id;
- name;
- input type;
- role;
- visible text;
- aria-label;
- title;
- disabled state;
- checked state.

## 9. Functioning classification

"Functioning" is split from "semantically correct".

V0.1 may classify observable behavior as:

### VISIBLE_CHANGE_NETWORK_OK

The action correlated with successful network activity and a new rendered state.

### VISIBLE_CHANGE

The rendered state changed without correlated network evidence.

This may be a local UI operation.

### NETWORK_OK_NO_VISIBLE_CHANGE

The browser observed successful network activity but the participant-visible state did not change.

This is particularly useful for finding missing acknowledgement/feedback.

### ERROR_OBSERVED

A correlated HTTP/request/browser error occurred.

### NO_OBSERVABLE_CHANGE

No rendered change, successful network response, or recorded browser error was observed in the correlation window.

This does not prove the control is defective. It flags the event for review.

The observer must not emit "correct/incorrect gameplay behavior".

## 10. Action correlation window

Actions can trigger asynchronous effects.

V0.1:

- captures/debounces post-action state;
- keeps an action correlation window open for network/error evidence;
- finalizes the action after the configured window or immediately before the next action.

If later automatic state changes occur after action finalization, they remain visible as independent state transitions rather than being falsely attributed to the prior click.

## 11. Evidence outputs

Per participant:

- `manifest.json`
- `states.jsonl`
- `events.jsonl`
- `actions.jsonl`
- `actions.csv`
- `network.jsonl`
- `errors.jsonl`
- `snapshots/*.png`

At run level, `render-report.mjs` can create an `index.html` containing:

- merged chronological index;
- participant action/control table;
- participant visual state cards with screenshots.

## 12. Operating modes

### Launch mode

Observer owns a new Chromium process.

Pros:
- strongest control over browser context isolation;
- simplest reproducibility.

Limitation:
- the external agent/controller must be able to operate that browser window.

### Attach mode

Observer attaches through Chrome DevTools Protocol.

Pros:
- can monitor a browser owned by another controller.

Limitation:
- the external browser must expose CDP;
- managed/cloud browsers may not.

## 13. E2 integration issue that remains separate from observer design

The observer itself is now independent of GAL.

A separate integration question remains:

> How will each blind agent obtain operational control of the same browser session being observed?

Possible solutions depend on the actual agent/browser environment:

- agent directly controls an observer-launched local browser;
- observer attaches to an agent-controlled Chromium through CDP;
- a later generic control adapter exposes browser actions to the blind agent.

This integration must not be solved by modifying GAL.

## 14. V0.1 acceptance criteria

The standalone tool is ready for first trial when it can demonstrate on any small web page:

1. initial state captured as S0001;
2. clicking a control creates one action record;
3. action references the existing before-state, not a duplicate before screenshot;
4. a changed resulting page creates one new screenshot/state;
5. unchanged result reuses the same state ID;
6. automatic asynchronous change creates a state without an action;
7. successful network-with-no-visible-change can be distinguished;
8. browser errors are logged;
9. query strings/form values are not written into textual logs by default;
10. two separate observer processes can write different participant folders under one run ID;
11. static HTML report renders stored screenshots and action lineage.

## 15. Deferred capabilities

Not required for V0.1:

- semantic expected-outcome assertions;
- application-specific adapters;
- video capture;
- OCR;
- AI defect diagnosis;
- automatic screenshot annotation;
- strict synchronization of multiple browser clocks beyond UTC timestamps;
- distributed agent control;
- database mutation/recovery;
- automatic E2 PASS/FAIL decision.
