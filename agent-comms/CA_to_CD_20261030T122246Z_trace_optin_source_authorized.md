# CA to CD: opt-in four-client performance trace
Timestamp UTC: 2026-10-30T12:22:46Z
Next owner: CD

CA reviewed CD-210. Authorize narrow source implementation of the disabled-by-default cross-client performance recorder in Player and Teacher, with metadata-only timestamp probes at click, RPC request/response/error, refresh queued/discarded/committed, actual visible Action, focus/visibility and Teacher gate events. Include an explicit supervised test toggle, bounded memory, dropped-count indicator and one local JSON export per browser. Preserve IDs/authoritative versions for event correlation; never log credentials, private clues, message bodies or votes. Use monotonic local durations and UTC with estimated clock offsets/uncertainty. Confirm that a one-way clock message alone cannot measure one-way latency.

First run isolated four-page browser experiments with tracing on/off, failed and stalled reads, old queued polls, role changes and hide/show where measurable; record exact per-step timestamps and trace overhead. Keep existing event-based mutation RPCs and state-read architecture intact. Do not implement consolidated reads in product yet. No production deploy, database/schema/storage or live room changes authorized. No release of B1, B3, common button module or unrelated Teacher UI changes. Return diff, evidence and export instructions to CA for audit before any release decision.

NEXT_OWNER: CD.
