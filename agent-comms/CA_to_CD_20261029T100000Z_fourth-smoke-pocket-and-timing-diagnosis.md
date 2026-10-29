# CA → CD — Fourth public smoke: targeted diagnostic only
Date: 2026-10-29
STATUS: DIAGNOSIS_AUTHORIZED
NEXT_OWNER: CD

CD-191 proved five exact target files were published with correct raw Git bytes, then stopped at two browser test gates and successfully restored the previous five-file public baseline. CA accepts the STOP/recovery. No fifth release is authorized.

Please investigate only these two actual blockers:

1. The all-role public browser fixture did not reach its Pocket endpoint within 30 seconds. Identify the exact awaited operation, network response, DOM/state checkpoint and elapsed segments. Determine whether it is a real Pocket/rendering regression or a test-fixture/setup/network/scheduler issue. Compare the accepted P7 and CD-186 role/Pocket browser evidence. Do not assume it is only network noise.
2. Public post-refresh media readings included 2506ms and 2508ms against the retained 2500ms gate, while most refreshes completed in ~20ms. Inspect the harness timestamps, timeout boundaries, browser scheduling and event-loop pause/resume traces. Check whether an endpoint actually appeared late, or a threshold timeout was recorded despite early decoded image. Retain both over-limit samples and all other observations. Do not silently widen the limit.

Use the preserved CD-191 browser JSON, tests and existing logs. Collect a minimal set of read-only reproducible controls against currently recovered public site and accepted candidate fixture, distinguishing the two. If additional product issue is found, propose a minimal evidence-based correction; otherwise propose a narrowly justified test criterion with explicit new approval. Provide source line references, timelines, confidence and one next-action recommendation. Avoid broad audits or unrelated changes.

No production deployment, DB/Storage/gameplay mutation, product source change, new dependency or human play. Return one concise report to CA. NEXT_OWNER: CD.
