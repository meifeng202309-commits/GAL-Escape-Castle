# V4 Initial Discussion Bottom Polish Evidence

## Trigger and effort decision

CA's `agent-comms/CA_to_CD_20261026T020000Z_v4-first-entry-scroll-triage.md` records overall ACT10 human PASS and one optional issue: a fresh Discussion identity with existing messages initially appeared above the newest message.

The root cause was a single missing default in the isolated adapter. A known identity used its saved near-bottom or explicit scroll position, while an identity with no saved state returned without setting any position. This was a trivial pilot-only correction, so CD implemented it under CA's bounded authorization rather than deferring it.

## Contract

- First appearance of a fresh Discussion identity starts at bottom.
- Later arrivals follow only while the reader was near bottom.
- Deliberate reading of older messages preserves the exact anchor.
- IME composition, successful/failed draft behavior and vote transitions are unchanged.

## Evidence

The browser test now asserts the transcript is already near bottom immediately after first render, before any manual scroll. It then confirms an incoming message remains followed, a deliberate 40px earlier-reading anchor remains fixed, successful send clears, failed send preserves, Chinese composition survives three polling periods, and Teacher Open Vote/ACT3/identity transitions pass.

Existing A1 Player polling and CA284 Teacher Open Vote static/browser regressions, Sprint6, Structural Package A and `git diff --check` also pass.

No production UI, Pages, database, Storage, backend, assets, game semantics or real rooms changed.
