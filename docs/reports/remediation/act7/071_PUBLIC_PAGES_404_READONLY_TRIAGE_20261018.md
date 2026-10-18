# Migration 071 public Pages 404 read-only triage

Status: `READ_ONLY_TRIAGE_COMPLETE / FALSE_404_CAUSE_IDENTIFIED / PRODUCTION_HOLD`

Authority: CA-249 and `agent-comms/CA_to_CD_20261019T004000Z_pages-404-readonly-triage.md`

Observation interval: `2026-10-18T16:37Z` to `2026-10-18T16:46Z`

No SQL, ACL, Pages selector, Save, deployment, fixture, RPC, flag, or record mutation occurred.

## 1. Finding

The CD-112 all-five 404 result was caused by malformed PowerShell URL construction, not by a public Pages outage and not by a proxy split.

The failing expression was equivalent to:

```powershell
"$base/$p?cd071=$nonce"
```

PowerShell parsed `$p?cd071` as the variable name. Because that variable was unset, every request was sent to the same invalid path:

```text
https://meifeng202309-commits.github.io/GAL-Escape-Castle/=1792341948785
```

Every invalid request therefore returned the same GitHub Pages 404 response: HTTP 404, 9,379 bytes, `text/html; charset=utf-8`, SHA-256 `b620507312c5e97566a3c6cfaf99144fefc18a0da7d941401dfa0f5f58fb0368`. This fully explains the identical CD-112 result for five nominal paths.

Using an explicit variable boundary (`${p}`) sent the intended URLs. No HTTP redirect was observed.

## 2. Network and response evidence

- Method: GET.
- No `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, or `NO_PROXY` environment variable was present.
- .NET default proxy resolved to no proxy for the tested URLs.
- Correct root and `teacher.html` requests returned HTTP 200 with `Server: GitHub.com`, `Via: 1.1 varnish`, `X-Cache: HIT`, and the expected HTML content type.
- A separate no-proxy `HttpClient` route returned HTTP 200 and exact frozen bytes for all five paths.
- An independent in-app browser route loaded the game landing page titled `GAL Castle Escape` and `teacher.html` titled `GAL Castle Escape Teacher Console`, with their expected visible controls. This route was used only as independent reachability/render evidence, not as byte-hash proof.

## 3. Correct five-file public-byte result

All requests used cache-busting query parameters, produced `X-Cache: MISS`, and returned `Server: GitHub.com` through `Via: 1.1 varnish`.

| Path | HTTP | Bytes | Content-Type | SHA-256 | Frozen match |
|---|---:|---:|---|---|---|
| `index.html` | 200 | 2,574 | `text/html; charset=utf-8` | `1da4904ed40496b3ade206893969ce46278cf1d50debcac41ca96fac476609c4` | yes |
| `teacher.html` | 200 | 8,559 | `text/html; charset=utf-8` | `d2f7b8f0bfc07912fb484004d2aff8a87a20d3e8d99b0f98e25fd5a28b72950f` | yes |
| `src/game/app.js` | 200 | 61,987 | `application/javascript; charset=utf-8` | `9f19c27f92be9835ea5d9b48e196803dcee85eae032feb0f9e65fe3e97b323fa` | yes |
| `src/teacher/teacher-console.js` | 200 | 29,564 | `application/javascript; charset=utf-8` | `ce8fb816caf2c362311772a6eb70944b1c645eff18a64aad8b221aaa2dce474d` | yes |
| `src/styles/app.css` | 200 | 10,501 | `text/css; charset=utf-8` | `3a375c87aeec797e2b32f8ba383d91af9ef6f9e9d01bb40cf0e3faa0f04ead7c` | yes |

## 4. Read-only branch and deployment state

- Candidate branch still resolves to `deploy/act7-071-20261017@6e3bbd1d2795bd4486b1437a0b9e107e2238fa28`.
- Frozen branch still resolves to `deploy/manual-acceptance-20261003@891feffe558a4683ac3da67e1e6b15e902c7e592`.
- Latest observed Pages build/deployment run: GitHub Actions run `39090947796`, run number 900, frozen branch/commit above, started `2026-10-18T02:40:47Z`, completed `2026-10-18T02:41:38Z`, conclusion `success`.
- Correct live hashes prove the currently published bytes match the frozen manifest.

## 5. Fail-closed method for the subsequent gate

1. Build every URL without adjacent PowerShell variable-name ambiguity, preferably by concatenation or a URI builder. If interpolation is used, require `${base}` and `${p}` braces.
2. Before sending, parse the URI and assert its `AbsolutePath` equals `/GAL-Escape-Castle/` plus the exact manifest path. Abort if it contains `=` in place of the expected file path or differs in any character.
3. Use GET with automatic redirects enabled, but record both requested and final URI. Require final origin `https://meifeng202309-commits.github.io`, expected path, and no cross-origin redirect.
4. Read response bytes directly, never re-encode response text. Require HTTP 200, expected content type, expected byte length, and expected SHA-256 for every file in one pass.
5. Cross-check root and `teacher.html` through an independent browser route. Browser rendering is reachability evidence only; the byte client remains the hash authority.
6. Any URI assertion, status, redirect, byte length, content type, or hash mismatch is STOP before continuing.

## 6. Disposition

The public deployment is reachable and exactly matches frozen bytes. The CD-112 404 blocker is resolved as a client command-construction defect, but the earlier maintenance window remains closed and its time-sensitive database preflight is expired. This report does not reopen or commence the approved attempt.

NEXT_OWNER: CA — independently review the false-404 root cause and corrected fail-closed verification method, then decide whether CD may open another completely fresh bounded preflight. Production remains HOLD.

