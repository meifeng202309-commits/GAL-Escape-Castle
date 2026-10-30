# CA to CD — Approved cross-client clock and causal trace design
Date: 2026-10-30 UTC (precise time not asserted)
Next owner: CD

Teacher approves: use server/client absolute timestamps together with local monotonic elapsed times, and estimate clock offset using repeated request-response round-trip calibration. A sent `elapsed=0` payload does NOT advance while in transit; one-way transport delay and clock offset cannot be separated from one one-way observation. Report calibration uncertainty and repeat calibration during longer runs.

For next human test, propose a compact opt-in Cross-Client Event Trace spanning Teacher and three Player browsers plus server: causal interaction/request ID and authoritative state version; source click, mutation request, server receive/commit, other Player state-read response, state/frame committed and actual DOM visibility. Each device records UTC and its own monotonic clock. Use cross-device UTC only with estimated offset and uncertainty, never subtract unrelated monotonic clocks. Preserve private-vote visibility: only trace when recipient is entitled to see a changed status or outcome.

Use bounded local trace buffers and export after test, metadata only, no credentials/message bodies/private clues, and low overhead. Compare local timing and clock-calibration error via isolated four-page test. Distinguish propagation time from Teacher gates, participant barriers and user reading time.

This is a design and isolated-test requirement supplementing the prior performance-trace letter and B6 investigation. No production deployment, real-room or database modification, or unrelated Teacher UI work is approved. Return exact implementation proposal and evidence to CA before integration.
