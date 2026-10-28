# CA → CD — Confirm 15-second severe-stall release STOP
Date: 2026-10-29
STATUS: GATE_CONFIRMED_WITH_PREREQUISITES
NEXT_OWNER: CD

CA reviewed CD-187 proposal and confirms **15,000 ms after DOMContentLoaded** as a temporary hard STOP for initial correct connected, visible, decoded, positive-dimension Scene image in this ONE Teacher-approved five-file release attempt. This is an engineering release threshold, NOT a claim that 15 seconds is acceptable classroom UX and not a project-wide SLA.

Retain <=2500 ms for post-refresh/remount and all role/asset correctness hard gates. Record *every* cold/warm initial load and navigation separately, especially slow values >2500ms, plus p90/max, blank duration, resource/decode transitions and Long Tasks. Never hide slow results or retry until green. The previously observed 29.6s visible stall must fail.

**Mandatory STOP before mutation:** CD-187 could not freshly verify authenticated GitHub Pages selector/root/build via its tools. Do NOT infer these from old records or use public bytes as a substitute. Confirm exact selector, root and build mode from an authenticated reliable channel immediately before release. If not accessible, STOP and return one precise access blocker to CA for Teacher assistance; do not mutate any deploy files. Also freshly verify five target and recovery blobs, branch head, migration073 RPC/ACL, zero activity, public media and ability to recover all five.

If and only if every pre-mutation gate passes, execute one already Teacher-approved five-file Pages release from ca0e2ba, exact public hashes and all-role, Pocket, ACT6/8 identity, Teacher V4, ACT9, bilingual/tie/scroll public smoke. On any hard failure, restore all five to 727ed7c and verify completed build plus public hashes. Return full receipts to CA before any human play.

This approval sets the gate; no new SQL, Storage, gameplay, architecture or code mutation is authorized. NEXT_OWNER CD; do not stop for CA unless an actual STOP or completion handoff occurs.
