# V4 ACT3 Visible Submit Receipt Evidence

## Trigger

CA's `agent-comms/CA_to_CD_20261026T041000Z_v4-act3-human-code-submit-no-feedback.md` records that Teacher entered `739` after fixed prefix `41`, but saw no visible response after clicking submit.

## Diagnosis

The isolated driver received `s3b_submit_library_code` and returned success, while its synthetic projection intentionally remained the same unresolved ACT3 scene. The unchanged production renderer ignores the RPC response body and therefore had no visible state to render. Other Player windows were not expected to change because this fixture had no synthetic group-resolution transition. Absence of visible change was therefore an unverified outcome, not proof of RPC failure.

## Minimal pilot-only correction

The synthetic driver now records an exact receipt and dispatches a pilot-only browser event after fulfilling the RPC. The isolated adapter displays that receipt in a dedicated `aria-live` status element outside production-owned status nodes:

```text
PILOT RECEIPT · accepted · code 41739 · request <client request id> · count 1
```

No new RPC, fake scene transition or backend state was invented. The receipt claims only that the synthetic handler accepted the exact request once.

## Targeted evidence

The browser test verifies:

- partial `739` remains stable before submission;
- submitted code is exactly `41739`;
- `librarySubmits.length === 1` and `libraryReceipts.length === 1`;
- visible receipt contains `accepted`, `code 41739` and `count 1`;
- after an additional 1.5 seconds, no duplicate exists;
- existing Pocket inspect/flip behavior remains functional.

Full V4 ACT10/ACT3, IME, scroll, draft, Teacher vote, A1 Player polling and CA284 Teacher Open Vote regressions pass. No production source, Pages, database, Storage, backend, assets, game semantics or real rooms changed.
