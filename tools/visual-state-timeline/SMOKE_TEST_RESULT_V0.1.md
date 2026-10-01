# Visual State Timeline + Action/Control Event Log — Smoke Test Result V0.1

Date: 2026-10-01  
Branch: `tooling/visual-state-timeline-v0.1`  
Target under test: standalone `examples/demo.html` only  
GAL Escape Castle runtime modified: **NO**

## Result

**PASS**

GitHub Actions run:

- workflow: `Visual State Timeline smoke`
- run id: `36810317359`
- tested head SHA: `fc3a81ab9dfe2348fc4c38c5ff225d2b81d0e85b`
- job id: `110203716792`
- evidence artifact: `visual-state-timeline-smoke`

The run installed Playwright Chromium, served the generic demo page, launched Chromium with CDP, attached the standalone observer, drove the same page through a separate Playwright controller, generated the static report, and uploaded the evidence bundle.

## Assertions verified

### 1. Initial state + visual-state inheritance

Initial state was `S0001`.

Visible counter action:

```text
A0001 increment
before S0001
after  S0002
```

The next no-op action inherited the prior after-state:

```text
A0002 noop
before S0002
after  S0002
```

This verifies the intended model:

```text
previous action.after == next action.before
```

when no intervening automatic state change occurs.

No duplicate screenshot was written for the no-op.

### 2. No-visible-change control

```text
A0002 noop
S0002 -> S0002
classification = NO_OBSERVABLE_CHANGE
```

The observer reused one state/screenshot rather than writing a duplicate "after" image.

### 3. Delayed automatic state

```text
A0003 delayed
S0002 -> S0003
```

The action first rendered an immediate waiting state.

After action finalization, the page changed asynchronously and the observer captured the later state independently.

This verifies that state transitions do not require a local click.

### 4. Successful network activity with no visual change

```text
A0004 network
S0004 -> S0004
classification = CORRELATED_NETWORK_OK_NO_VISIBLE_CHANGE
```

The observer correlated the successful `ping.txt` HTTP response without creating a duplicate visual state.

### 5. Browser/page error capture

```text
A0005 error
S0004 -> S0004
classification = ERROR_OBSERVED
```

The deliberate page error was captured in `errors.jsonl`.

### 6. Screenshot deduplication

Final smoke evidence:

- persisted states: 4
- PNG screenshots: 4
- actions: 5
- browser/page errors: 1 deliberate test error
- automatic state events: at least 1

The screenshot count equaled the persisted state count, not twice the action count.

### 7. Report generation

`render-report.mjs` completed successfully and generated:

`smoke-runs/VST-SMOKE/index.html`

The workflow uploaded the complete evidence bundle as an artifact.

## Additional hardening completed after the first smoke

### Near-action network correlation

The observer now records request start time and marks a request `near_action` only when it begins within the configurable network-correlation window.

Background/polling traffic remains `background` and does not contribute to the action's network-based classification.

This reduces false "functioning" evidence in continuously polling applications such as GAL.

### Deterministic attached-page binding

The first multi-participant smoke exposed a genuine tooling defect: CDP page-index ordering was not reliable across separate observer connections, so two observers could attach to the wrong participant pages.

This was corrected by adding:

`--page-url-contains <marker>`

The subsequent multi-participant smoke PASS verified deterministic binding.

### Multi-participant isolation PASS

Final smoke run verified two simultaneous observer processes under one run ID:

```text
PLAYER-A
  action: increment
  S0001 -> S0002
  classification: VISIBLE_CHANGE

PLAYER-B
  action: network
  S0001 -> S0001
  classification: CORRELATED_NETWORK_OK_NO_VISIBLE_CHANGE
```

Each observer wrote to its own participant folder with no action crossover.

## Current disposition

Standalone capture core: **PROVEN ON GENERIC DEMO**

Verified:

- state/screenshot inheritance and deduplication;
- actual click/action capture;
- automatic asynchronous state capture;
- no-visible-change actions;
- near-action network-success-without-visible-change;
- page/browser error capture;
- static visual report generation;
- simultaneous multi-participant observer isolation;
- deterministic page binding in an attached multi-page Chromium session.

Still NOT VERIFIED:

- actual blind-agent browser integration;
- real GAL continuous-polling behavior under a long session;
- classroom-sized evidence volume;
- E2-A protocol integration.

These remaining items should be addressed without modifying GAL runtime.
