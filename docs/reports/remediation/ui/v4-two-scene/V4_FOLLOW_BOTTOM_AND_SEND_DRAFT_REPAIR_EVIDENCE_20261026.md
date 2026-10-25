# V4 Follow-Bottom and Send-Draft Repair Evidence

## Trigger

`agent-comms/CA_to_CD_GA_20261025T113000Z_v4-human-retest-follow-bottom-and-clear-draft.md` reported two remaining ACT10 human-test failures after native Chinese messaging passed:

1. a reader near the bottom did not follow incoming messages;
2. successfully sent text was restored into the composer instead of remaining cleared.

## Root causes and bounded repair

The adapter previously captured transcript intent only on scroll events. Before replacing a projected transcript, it now captures the still-mounted old transcript first, preserving whether the reader was near-bottom or deliberately scrolled up. The replacement follows to its newest message only for the former state.

The production renderer clears the input after an acknowledged send, but the adapter still held the pre-send cached draft. The adapter now records a pending submit without clearing it, then clears its saved draft only after the next authoritative projection contains the same message under the current Player session identity. A failed RPC never produces that acknowledgement, so its draft remains. During composition, submit tracking remains disabled.

## Focused browser evidence

PASS:

```json
{
  "imeCompositionPolls": 3,
  "imeMessages": 1,
  "followBottom": 1,
  "scrolledUpAnchor": 1,
  "successfulSendClears": 1,
  "failedSendPreserves": 1,
  "teacherOpenVote": 1,
  "negativeTransitions": 1
}
```

The successful-send case waits for the sent message in the refreshed transcript, an empty composer, restored composer focus and caret `[0,0]`. The failed-send case injects HTTP 409 and verifies the draft remains unchanged.

Full V4 static/browser, native-IME simulation, ACT3, existing A1 Player polling, CA284 Teacher Open Vote, Sprint6 and Structural Package A regressions passed. No production source, Pages, database, Storage, backend, assets or real rooms changed.

## Human closure

Teacher should repeat the two scrollbar cases and success/failure composer behavior in the isolated ACT10 launcher. This repair remains an isolated pilot result and does not authorize production integration.
