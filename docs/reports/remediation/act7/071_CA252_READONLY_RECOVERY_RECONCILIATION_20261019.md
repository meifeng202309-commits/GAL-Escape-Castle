# CA-252 read-only recovery reconciliation

Timestamp: 2026-10-19T11:25:00Z  
Scope: source-only/read-only; no Pages, SQL, ACL or record mutation  
Disposition: **RECONCILED WITH ONE PROCESS VIOLATION AND ONE DURABLE-EVIDENCE GAP**

## 1. Six admission-function MD5 reconciliation

The immediate pre-freeze catalog query in the active execution turn reported all six owner/SECURITY DEFINER/ACL/body values as matching the fresh preflight baseline. That raw result was not persisted to a repository evidence file before mutation. This is a durable-evidence defect: a later reviewer cannot independently recover the original pre-freeze row set from Git alone.

The exact values observed again after the admission ACL restoration and before the fixture were:

| Signature | `md5(prosrc)` |
|---|---|
| `s1_create_room(text,text,text,text,text)` | `d3dcb4f6f6a2622c05da82949c12e3fc` |
| `s1_join_player(text,text)` | `8b3ec60fac5035208abbb5a3781afb65` |
| `s1_reset_room(text,text)` | `f006dc6bed504c2da8452e9d7d88bb0a` |
| `s2_start_run(text,text,text)` | `84f71e97cc493623913dbe748c05c956` |
| `s3b_initialize_flow(text,text)` | `5bbb0d18387ea41d1a467099d82beebb` |
| `s9_start_formal_game(text,text,text)` | `7003fa6777f14382a094eadacc3dc183` |

The final post-recovery catalog query returned the same six values, owners and SECURITY DEFINER flags, plus the exact original effective ACL pattern. Migration 071 and `071_RECOVERY.sql` do not define or replace these six functions; the maintenance changes to them were ACL-only and therefore cannot alter `prosrc`. The before-fixture and after-recovery equality, combined with the bounded SQL change set, supports that their bodies were not changed.

Reconciliation result:

- **body and ACL recovery:** supported by repeated live catalog evidence and SQL scope;
- **independent durable proof of the exact immediate-before-freeze result:** unavailable because the raw pre-freeze result was not persisted before mutation;
- the CD-115 phrase “match their pre-freeze values” should be read as execution-transcript reconciliation, not as a repository-contained independent snapshot.

Corrective control: before any future privilege freeze, save one complete timestamped catalog row set containing signature, owner, definer flag, search path, raw/normalized body hashes, raw ACL and effective privilege matrix. Compute and record a digest of that snapshot. No mutation may begin until the durable snapshot is written and re-read successfully; post-restore comparison must consume that exact artifact rather than manually restated values.

## 2. Candidate public-byte gate reconciliation

Evidence:

- GitHub Pages run `39149248876` completed successfully for exact candidate commit `6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`.
- Every attempted candidate `github.io` read from the executor failed at the connection/TLS layer. No candidate HTTP status, byte length or SHA-256 set was obtained.
- The reviewed runbook states that a green build, screenshot or Save acknowledgment does not close the switch: all five public files must return HTTP 200 and exact candidate hashes before acceptance proceeds.
- CD nevertheless restored the admission ACLs and invoked the controlled fixture, treating the exact-commit build as sufficient to continue.

Conclusion: **this was a process violation.** The candidate public-byte gate was open, and the fixture must not have been invoked. GitHub Actions success proves build identity and conclusion, not CDN-served bytes. The later successful rollback five-file verification does not retroactively close the candidate gate.

Impact:

- migration 071 and candidate Pages were briefly live without completed public-byte verification;
- the fixture made no RPC and created no row because its first network call failed;
- fail-closed recovery later restored Pages, SQL and ACLs and verified all rollback public hashes;
- therefore no controlled-acceptance result is valid, and no product PASS/FAIL can be inferred.

Corrective controls:

1. Represent the public-byte gate as a machine-checkable artifact containing the five URLs, HTTP 200, byte lengths, SHA-256 values, deployment run ID, commit and observation UTC.
2. Do not start ACL restore or fixture execution unless that artifact exists and all expected values compare equal.
3. Build success, Pages UI state and screenshots are informational only and cannot set the gate PASS.
4. Any candidate-byte transport failure triggers immediate rollback; it may not be downgraded to an “observability limitation.”

## 3. Executor network failure before first RPC

Source trace:

- `tests/act7-071-controlled-acceptance.js` calls `fixture("normal")` first.
- `fixture()` in `tests/sprint5-live-e2e.js` performs `s1_create_room` as its first RPC through Node's global `fetch` to `https://qdcbdcjobzytzhnhfwyn.supabase.co/rest/v1/rpc/s1_create_room`.
- The attempt failed with bare `TypeError: fetch failed` before an evidence boundary.

Read-only reproduction from the same default command context produced:

```text
getaddrinfo ENOTFOUND qdcbdcjobzytzhnhfwyn.supabase.co
```

`Resolve-DnsName` and `Test-NetConnection` in that context also could not resolve the host. The identical unauthenticated Node GET, when run in the approved external-network context, reached Supabase through Cloudflare and returned expected `401 Unauthorized`. This isolates the failure to the default executor sandbox's DNS/network boundary. It is not evidence of a Supabase outage, an RPC implementation defect or a database rejection.

Impact:

- the failure occurred before `s1_create_room`; final Q0 `579 = 577 + 2` confirms no additional fixture was created;
- no Q1–Q4 boundary could be emitted;
- the one-attempt authorization remains consumed because production changes had already occurred.

Corrective controls:

1. Before any production mutation, run a no-credential HTTPS probe from the **exact process/network context** that will launch the fixture and require a reachable HTTP response such as 401; testing through Supabase MCP is not equivalent.
2. Add a source-level startup connectivity precheck before the first mutating RPC that reports the nested `error.cause` (`code`, `syscall`, `hostname`) and exits before fixture identity generation.
3. Pin the approved execution context in the operator record; do not switch between sandboxed and external-network processes after preflight.
4. A failed executor probe is a pre-mutation STOP. It must not consume a production attempt because no production mutation should yet have occurred.

## Final disposition

Production remains on the verified frozen rollback baseline. No new attempt is authorized. The candidate byte gate violation and missing durable pre-freeze catalog artifact must be treated as procedure defects, while the fixture failure itself is diagnosed as executor DNS isolation.

NEXT_OWNER: CA — independently audit this reconciliation and decide whether the future procedure requires source changes for machine-enforced byte/catalog/network gates. Any future production execution requires a new explicit authorization.
