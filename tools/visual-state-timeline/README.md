# Visual State Timeline + Action/Control Event Log

A standalone browser-observation tool for usability and playability experiments.

## Design goal

Observe a web application **from outside the application**.

The observer must not require:

- application source imports;
- application-specific RPCs;
- application database access;
- changes to the application's state machine;
- test-only hooks in the target application.

It attaches to or launches Chromium through Playwright, observes rendered browser behavior, and writes an evidence bundle.

The tool is intentionally generic. It contains no GAL Escape Castle gameplay rules, ACT knowledge, route knowledge, puzzle answers, or expected outcomes.

## Evidence model

The core model is:

```text
State S0001
   ↓
Event E0001 / Action A0001
   ↓
State S0002
   ↓
Event E0002 / Action A0002
   ↓
State S0003
```

A screenshot is stored once per distinct captured state.

Therefore:

```text
A0001.before = S0001
A0001.after  = S0002

A0002.before = S0002
A0002.after  = S0003
```

The previous action's `after` state is normally the next action's `before` state. The image is not duplicated.

If a click produces no visible change:

```text
A0001.before = S0001
A0001.after  = S0001
```

No duplicate screenshot is written.

Automatic page changes can create states without a player action:

```text
S0005 waiting
   ↓ peer / timer / poll / server update
S0006 reveal
```

This is important for multi-user applications.

## What the observer records

### Visual states

For each persisted state:

- state ID;
- timestamp;
- trigger;
- page URL without query/hash by default;
- viewport;
- full-page PNG screenshot;
- screenshot SHA-256;
- semantic browser-state signature.

### Player/control actions

For actual DOM clicks:

- action ID;
- timestamp;
- participant label;
- target tag/id/name/type;
- visible target text;
- ARIA label/title;
- disabled/checked state where applicable;
- before-state ID;
- after-state ID;
- correlated network responses;
- correlated browser/page errors;
- observer-level outcome classification.

The observer does **not** decide whether a game choice was semantically correct.

It reports observable functioning such as:

- `VISIBLE_CHANGE_NETWORK_OK`
- `VISIBLE_CHANGE`
- `NETWORK_OK_NO_VISIBLE_CHANGE`
- `ERROR_OBSERVED`
- `NO_OBSERVABLE_CHANGE`

These are evidence classifications, not gameplay verdicts.

### Technical evidence

- HTTP/RPC-like responses, with query strings stripped;
- failed requests;
- page errors;
- console errors;
- navigation events.

## Meaningful-state capture rather than duplicate before/after images

The observer maintains one current state.

On a click:

1. ensure the current visible state is captured;
2. set that state as `before_state_id`;
3. observe DOM/network/error activity;
4. capture the resulting stable state if visually/semantically different;
5. set that state as `after_state_id`.

Mutation-driven automatic state changes are debounced. Timer-like text changes are normalized in the semantic signature so that a countdown does not normally create one screenshot per second.

## Standalone architecture

The tool lives in this repository only for project governance and versioning. It does not import or modify GAL runtime code.

It can be copied to another repository and used against another web application.

Two operating modes are planned:

### Launch mode

The observer launches a Chromium window and opens the supplied URL.

Useful when a human or external agent can operate that window.

### Attach mode

The observer connects to an already-running Chromium instance through a CDP endpoint.

Useful when another controller owns the browser session.

Attach mode requires that the browser expose a CDP endpoint; not every managed/cloud browser does.

## One observer process per participant

For multi-user tests, prefer one observer process per participant:

```text
observer --label GAL-A ...
observer --label GAL-B ...
observer --label GAL-C ...
observer --label Teacher ...
```

Each process writes to:

```text
<output>/<run-id>/<label>/
```

This keeps browser/session evidence isolated. Timelines can later be merged by UTC timestamp.

## Output structure

```text
runs/<run-id>/
  GAL-A/
    manifest.json
    states.jsonl
    events.jsonl
    actions.jsonl
    actions.csv
    network.jsonl
    errors.jsonl
    snapshots/
      S0001_....png
      S0002_....png
  GAL-B/
  GAL-C/
  Teacher/
```

A static visual report generator is included. It creates a merged chronological index plus participant action tables and screenshot timelines.

## Privacy / evidence warning

Screenshots may contain room codes, join codes, names, chat content, or other test data.

Treat a run directory as audit evidence. Do not publish it automatically.

By default the observer does not record form-field values into textual logs. Screenshots still show whatever the participant actually saw.

## Installation

From this tool directory:

```powershell
npm install
npx playwright install chromium
```

If system Chrome is already installed, Playwright may be configured to use it instead.

## Example — launch mode

```powershell
node src/observer.mjs --url "http://127.0.0.1:4173/" --label "GAL-A" --run-id "E2A-20261001-01" --output "./runs"
```

The browser is headful by default.

Stop with Ctrl+C. The observer flushes the current action and writes a final manifest.

## Example — attach mode

Start Chromium with remote debugging enabled, then:

```powershell
node src/observer.mjs --cdp "http://127.0.0.1:9222" --label "GAL-A" --run-id "E2A-20261001-01" --output "./runs"
```

## Generate a visual report

After one or more participant observers have written into the same run directory:

```powershell
npm run report -- --run-dir "./runs/E2A-20261001-01"
```

Open the generated `index.html` locally. The report links every stored screenshot and shows action before/after state IDs.

## Generic demo page

`examples/demo.html` contains no GAL code. It provides:

- a visible counter change;
- a no-op button;
- a delayed automatic state change;
- a deliberate page error.

It is intended for the first observer smoke test before any E2 use.

## Non-goals for V0.1

V0.1 intentionally does not:

- know target-app expected behavior;
- determine whether a puzzle answer is correct;
- mutate application state;
- call application RPCs directly;
- repair a blocked run;
- replace a blind player's own reasoning;
- automatically classify a usability defect as a code defect;
- automatically infer semantic correctness from the merged report.

Those belong to later analysis layers.
