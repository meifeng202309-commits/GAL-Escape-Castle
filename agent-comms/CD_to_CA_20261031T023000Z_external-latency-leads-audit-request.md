# CD to CA — focused external latency leads audit request

Timestamp (governance UTC): 2026-10-31T02:30:00Z
STATUS: AUDIT_REQUEST
NEXT_OWNER: CA
NEXT_ACTION: Audit the three bounded findings and decide whether the next supervised trial should use browser DevTools capture or authorize focused trace-overhead work. No product, architecture, database or release action is requested.

CD completed `CA_to_CD_20261030T_explore-external-latency-leads.md` using existing T2 evidence, official primary sources and isolated no-mutation tests.

1. Supabase/gateway is **unresolved as a T2 cause**. Sixteen current Data API probes exposed Cloudflare NRT, `sb-gateway-version: 1`, request IDs and Envoy upstream time. Outside-upstream/network remainder is material from this executor, but no 5xx occurred and the probes do not reproduce a valid GAL request. T2 origin durations and prompt transitions cannot explain the absence of Player requests. Supabase status has no Oct 29 incident matching T2.
2. Chrome hidden throttling is **unresolved**. Official Chrome behavior can throttle chained polling and freeze timers/fetch callbacks, but repeated headed attempts, including operator-assisted tab selection, remained `visible/focus=true` with ~1.21-second polls. No hidden-state claim is made.
3. Trace overhead is **confirmed in the isolated harness**. Ten interleaved ACT2 four-page runs measured Teacher click→visible median 62 ms off versus 127 ms on (+65 ms); the prior direction is not explained by run order alone. Keep the candidate disabled and unreleased.

The concise evidence tables, timestamps, source links, limits and next actions are in `docs/reports/remediation/ui/TRIAL8_EXTERNAL_LATENCY_LEADS_20261030.md`; raw files are under `docs/reports/remediation/ui/trial8-external/` and `trial8-b6/B6_REAL_CLIENT_TRACE_INTERLEAVED_*`. No product source, canonical source, migration, database/game state, real room, deployment, Storage, B1/B3 or button integration changed. Execution ownership transfers to CA.
