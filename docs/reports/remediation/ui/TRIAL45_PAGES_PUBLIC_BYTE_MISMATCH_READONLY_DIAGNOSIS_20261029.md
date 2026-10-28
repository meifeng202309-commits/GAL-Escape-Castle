# Trial4+5 Pages public-byte mismatch read-only diagnosis

Date: 2026-10-29  
Authority: `CA_to_CD_20261029T073000Z_pages-public-byte-mismatch-readonly-diagnosis.md`

## Conclusion

The third release did **not** serve non-target bytes. The STOP was a verifier false positive caused by comparing canonical public LF bytes with a Windows checkout/archive representation affected by Git EOL conversion. The five public SHA-256 values recorded immediately after release exactly equal the raw Git blob bytes at frozen target `ca0e2ba`:

| File | raw target SHA-256 | recorded public SHA-256 |
|---|---|---|
| `teacher.html` | `cf767cdab6e32092ef60d668e0fd3530eadddac02f8113a8bb0cbb8cbff39c82` | same |
| `src/game/app.js` | `8e03dbbde6c974291e8bc4360cac3559f46ef5d800653df4fdd51a397bbc88be` | same |
| `src/game/asset-runtime.js` | `49085c0f7b7ea1a2079a8c8d8acdea7ae062929b395767c4f1369fb9cbab0d61` | same |
| `src/styles/app.css` | `3b0bffed34f7d20b5ec0566c3af8840ae0d931a0bf60bb4ac9c1e208aa3be42e` | same |
| `src/content/localization.generated.js` | `9f4b4763f636a976127fd1c8a1d9946f2aa46463b5323325dbf8376d98cb63b7` | same |

The original comparison used `Get-FileHash` on the checked-out deployment worktree. Those files had CRLF-filtered bytes and produced different hashes (`18e558…`, `8ea497…`, `25aa0e…`, `b51812…`, `b9db10…`). The later recovery verification correctly used downloaded-byte Git blob identity, which is why recovery passed.

## Independent run/deployment evidence

- Pages run `40727857046` head: `d08776260ef2a773c0d9cdebd56e7c005e83bc32`.
- Build job: 16:37:57Z–16:38:32Z, success.
- Deploy job: 16:38:37Z–16:38:49Z, success.
- Deployment `7391451478`: exact SHA `d087762`, exact ref `deploy/trial4-player-act9-20261027`, environment `github-pages`, updated 16:38:50Z.
- The recorded canonical public hashes after completion match all five raw target blobs. Therefore artifact/ref, build and public readback were coherent.

No measured fact supports CDN propagation as the cause of CD-189. Current canonical and query URLs both return the same recovery representation and headers `Cache-Control: max-age=600`, `X-Cache: HIT`, identical ETag/Last-Modified. Query parameters can select/cache a request variant and must never substitute for canonical verification.

## Corrected verification procedure

1. Generate expected bytes from raw Git objects, never from a checkout or `git archive` subject to attributes: resolve `commit:path` blob ID and materialize with `git cat-file blob`, then SHA-256 it.
2. After the exact deployment SHA/ref/environment completes, download each **canonical URL without a query string** to a binary file. Compute both SHA-256 and `git hash-object`; require equality to the raw expected SHA-256/blob ID.
3. Record response Date, Age, Cache-Control, ETag, Last-Modified and X-Cache. A cache-busting URL may be diagnostic only and cannot pass the gate.
4. Because Pages advertises `max-age=600`, allow a bounded readback-settling observation of up to 600 seconds after deploy completion: sample canonical URLs at fixed 15-second intervals, retain every mismatch/header, and begin smoke only after all five canonical URLs match in one observation. If any canonical file still mismatches at 600 seconds, hard STOP and recover. This window guards genuine edge propagation without weakening exact-byte verification.
5. Do not rerun a failed sample until green or discard slow/mismatching observations. Continue to apply the separately confirmed image latency/correctness gates after byte equality.

The settling window would protect against a future real stale edge, but it would not have been necessary to resolve this incident: the public bytes already matched the target. The primary correction is raw-Git-byte comparison.

No deployment, source/settings, database, Storage, runtime or human-play mutation occurred during this diagnosis.

