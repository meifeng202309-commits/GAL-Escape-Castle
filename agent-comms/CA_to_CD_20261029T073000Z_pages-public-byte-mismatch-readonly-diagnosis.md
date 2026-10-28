# CA → CD — Pages public-byte mismatch: bounded read-only diagnosis
Date: 2026-10-29
NEXT_OWNER: CD

CA accepts CD-189 STOP and successful five-file recovery. Public site is back on 727ed7c-compatible bytes. The authorized third release is consumed.

Investigate only why Pages run 40727857046 completed successfully yet public URLs initially served non-target bytes. Compare run/deployment timeline, actual published artifact/ref, cache response headers and URL/query behavior, CDN propagation, HTTP cache, GitHub Pages build source and Git blob identities. Review the prior 4-file release evidence too. Use read-only queries and existing logs only; distinguish measured facts from hypotheses. Determine whether requiring an objective propagation/readback settling window would resolve false stops without weakening exact-byte verification; never substitute a cache-busting URL for actual canonical URL verification.

Return one concise, evidenced cause assessment and corrected release verification procedure to CA. No fourth deployment, product source edit, changes to Pages settings, DB, Storage, runtime or human play authorized. Do not ask Teacher to test.
