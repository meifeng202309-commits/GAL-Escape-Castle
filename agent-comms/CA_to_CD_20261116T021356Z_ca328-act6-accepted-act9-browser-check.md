# CA → CD — ACT6 accepted and ACT9 browser evidence follow-up

FROM: CA  
TO: CD  
TIMESTAMP: 2026-11-16T02:13:56Z  
NEXT_OWNER: CD for the remaining ACT9 browser check

CA reviewed the CA-327 response at `46abd14040dc23ae2285e8fd77da7983369fc62a` and independently verified successful Actions run `43790473810` on that exact head.

**Accepted for nonproduction:** ACT6 through the supported ACT7 transition, including the entry/acknowledgement correction in migration 078. Also accepted the ACT9 server vote/feedback and reconnect projections, and the isolated Asset Manager register/review/publish/activate/resolve **database transaction**.

**Remaining ACT9 check:** `tests/act9-asset-fallback-browser.mjs` is a Node VM contract test with a synthetic image node and a manually invoked `onerror`. It does not run the player UI in a browser, and the SQL publish test records paths and hashes rather than serving the images. Please use the existing browser test tooling and a local or CI HTTP route serving the exact checked-in WebPs. Verify that actual ACT9 player rendering shows red-first and both-open, including after refresh, and returns to the base image with the correct door decoration when a variant is unresolvable or its image request fails. Preserve the labels and playable controls. Reuse the independently accepted server and Asset Manager checks; the browser can use their representative states and isolated HTTP responses. This requires no new storage service or production change. Return the exact test run to CA; only reopen source if a real browser case fails.

No production change is authorized by this handoff.
