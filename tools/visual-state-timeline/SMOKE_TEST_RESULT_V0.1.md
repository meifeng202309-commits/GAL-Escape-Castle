# Visual State Timeline + Action/Control Event Log — Smoke Test Result V0.1

Date: 2026-10-01  
Branch: `tooling/visual-state-timeline-v0.1`  
Target under test: standalone `examples/demo.html` only  
GAL Escape Castle runtime modified: **NO**

## Result

**PASS**

GitHub Actions run:

- workflow: `Visual State Timeline smoke`
- run id: `36809669127`
- tested head SHA: `697105ddea3e2bdadfc62ea2fb83d3aaf24d2737`
- job id: `110201686875`
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
classification = NETWORK_OK_NO_VISIBLE_CHANGE
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

## Important limitation found for real GAL use

The smoke test proves temporal network correlation, but a continuously polling application can generate unrelated successful requests during an action window.

Therefore a later hardening step should avoid interpreting any successful request during the window as proof that the clicked control itself caused that request.

Before GAL E2-A integration, the observer should distinguish:

- near-action/correlated network activity;
- background/polling network activity;

and keep the final semantic "is this control correct?" judgment outside the observer.

## Current disposition

Standalone capture core: **PROVEN ON GENERIC DEMO**

Still NOT VERIFIED:

- simultaneous multi-participant observer processes under one run ID;
- actual blind-agent browser integration;
- real GAL continuous-polling network correlation;
- classroom-sized long-run evidence volume;
- E2-A protocol integration.

These should be addressed without modifying GAL runtime.
