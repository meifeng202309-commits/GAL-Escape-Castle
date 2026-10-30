# CA to CD — Root cause first; freeze UI rollout
Date: 2026-10-30
NEXT_OWNER: CD

Teacher rejects treating B3 Waiting feedback as resolution of latency. The injected-delay B2/B3 figures (roughly 0.8–1.1 sec result) are simulated single samples; the 28–70 ms Waiting feedback also does not fix authoritative delay. Real human gameplay had waits of several seconds to over a minute. Do NOT deploy or broadly integrate B3. Do NOT integrate the common pressed-button module or modify Teacher UI. If the reusable module has not yet been completed, preserve its work and suspend further implementation until latency root cause is established.

Priority is read-only/test-only root-cause isolation before another product-code optimization. Examine real T2 event sequence and current RPC/log timings, separate deliberate Teacher/player gates from genuine stuck waits, investigate complete projection fanout, serial authority reads, polling queue/starvation, error/retry/timeouts, multiple concurrent player and Teacher operations, and any client-side DOM/render scheduling. Design experiments that can falsify hypotheses rather than merely reproducing injected slowness. Cover representative action families across ACT1–ACT13; explicitly label unmeasured cases.

Deliver a ranked causal diagnosis with evidence for measured production/server steps vs simulated/browser steps, and a proposed minimal experimental fix that actually decreases click-to-authoritative-visible latency (not just immediate Waiting text). Test candidate in isolation first, compare before/after across several delay regimes, and request CA permission before modifying product source. No Pages deployment, DB/Storage/game-state mutation or broad architecture redesign authorized.

The already implemented B1 Teacher Start reset remains staged and unshipped. Report to CA when diagnosis is ready; next owner CD.
