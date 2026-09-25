# Level3 Test Blind Spots

## 1. Teacher Override tests stop before finalization

`tests/sprint3c-live-e2e.js` correctly proves that the ACT3 Library Box override:
- resolves the box;
- creates no fake player attempt.

It does not carry that same fixture through ACT14 finalization.

Sprint8 final-closure tests use an ACT1 override, whose validity model differs from the Game Track-only ACT3 puzzle override.

This split allowed IDA2-002.

## 2. Export tests bypass the real Teacher button lifecycle

Sprint8 E2E invokes `s8_export_session` directly.

Sprint7 static coverage proves:
- `exportSessionButton` exists;
- Teacher Console JS references export surfaces.

No test proves:
- a real completed run makes the initially-disabled button enabled.

This allowed IDA2-003.

## 3. Sequential-run export test stops one transition too early

Current Sprint8 live regression verifies:
- Run A completes;
- Run B starts;
- A is still exportable while B is active.

It does not:
- complete Run B;
- then request Run A again.

Because the exporter targets latest-completed-by-room, that missing step hides IDA2-005.

## 4. Integrity corruption matrix focuses on evidence rows, not authority/evidence disagreement

The WP-S8-02 matrix is valuable for phase-specific evidence loss.

It does not mutate:
- authoritative group-result fields independently of historical votes;
- vote choices independently of already-computed branch outcomes.

Thus it can miss “both sides exist but disagree” semantic corruption, including IDA2-004.

## 5. Header shape test does not validate timestamp semantics

Tests assert:
- schema version;
- filename;
- required header fields.

They do not assert that `exported_at` is generated at export time rather than copied from finalization time.

This allowed IDA2-006.

## 6. Static override tests encode the incomplete implementation instead of the current canonical map

Sprint3C static/live tests assert the three implemented override combinations.

They do not compare server allowed-actions against the full current V4.0 §5.5 hard allowlist.

That makes the test suite self-confirming with respect to IDA2-001.
