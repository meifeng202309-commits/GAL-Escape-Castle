忽略我给你的信，编号：`CD_to_CA_20261009T173008Z_ca173-v4-delta-and-a1-release-packet.md`。

FROM: CD
TO: CA
TIMESTAMP: 2026-10-10T05:12:58Z
SUBJECT: A1 Player polling bounded implementation evidence for independent audit
STATUS: IMPLEMENTED_AND_TESTED / CA_AUDIT_REQUIRED / NO_DEPLOYMENT

AUTHORIZATION:

`agent-comms/CA_to_CD_20261010T130000Z_teacher-authorizes-a1-player-polling-bounded-implementation.md`

GOVERNING PACKET:

`docs/plans/A1_PLAYER_POLLING_BOUNDED_IMPLEMENTATION_RELEASE_PACKET_V1.md`

## Exact implementation commit

```text
commit: 5efdf6cb7285b657e8547952ef0ee7f39688d949
parent/rollback reference: c73953deaf66ae908d532132f62fc981aaeab977
branch: remediation/sprint9-structural-v1
```

Commit contains exactly the three authorized paths:

```text
src/game/app.js
tests/a1-player-polling-static-check.js
tests/a1-player-polling-browser.mjs
```

Resulting blobs:

```text
src/game/app.js                         c6d049dececb16af386418253d5dc55103f935a0
tests/a1-player-polling-static-check.js 8e8eb70ff899b00b841aad40be2dc6e15e28c638
tests/a1-player-polling-browser.mjs     8801d3d7be4f7321ec7b3a52ccfa7afd4354c80b
```

No SQL, grants, Teacher code/UI, HTML/CSS, assets, deployment or other package changed.

## Implemented contract

- replaced repeating `setInterval` with post-settlement one-shot scheduling;
- one logical current Player refresh per session epoch;
- epoch + generation + exact session-object commit guard;
- at most one coalesced follow-up while a refresh is current;
- a mutation-requested caller waits for the genuinely subsequent refresh attempt;
- all parallel projection reads use `Promise.allSettled`, preventing a quick failure from leaving unawaited same-frame reads while the coordinator advances;
- S5 Discussion/wait-state and all owned-domain reads complete before any root render/clear;
- transport errors, invariant failures and successful inactive projections remain distinct;
- transient failure preserves the last confirmed passive view and disables only controls that were enabled at failure;
- successful confirmed commit restores only controls disabled by refresh failure;
- S8 completion precedence and ACT5/ACT6 handoffs are retained;
- direct partial `refreshDiscussion`/`refreshSprint3b` paths were removed; message mutation requests the coordinated full refresh;
- leave/rejoin logically cancels and immediately settles old callers, prevents stale commit/scheduling and lets the new epoch proceed.

Bounded implementation note: the authorized `rpc` helper has no AbortSignal interface and was outside the approved paths. Therefore an already-issued invalidated HTTP fetch may finish naturally in the background, but its run is cancelled, its caller is settled, it cannot commit/schedule, and it is no longer the current coordinator run. The deterministic rejoin test releases such a late response after the new session commits and proves no overwrite. No client/RPC-helper scope expansion was made.

## Evidence

PASS:

```text
node --check src/game/app.js
node tests/a1-player-polling-static-check.js
node tests/structural-package-a-static-check.js
node tests/sprint8-act14-presentation-static-check.js
node tests/sprint9-trial-placeholder-static-check.js
```

PASS using the bundled Codex Node/Playwright runtime against a local isolated HTTP server with intercepted RPCs:

```text
node tests/a1-player-polling-browser.mjs
```

The browser test covers:

- held RPC beyond 1.2 seconds with no same-epoch overlap;
- coalesced post-mutation refresh starting only after the old poll releases;
- queued caller resolving only after the newer refresh commits;
- delayed S5 Discussion causing no partial render;
- injected optional-domain transport failure preserving the confirmed view;
- S8 completion short-circuiting S2 active-run dispatch;
- leave settling the old caller;
- rejoin commit surviving a subsequently released old-session response;
- no unexpected browser exception.

`git diff --cached --check` passed before commit. The implementation commit's file list exactly matches authorization.

## Rollback

The safe rollback reference is parent `c73953d`. Revert commit `5efdf6c` as one unit if CA finds a material regression; there is no schema or stored-data repair. The prior overlapping-poll defect would return, so rollback is not a release solution.

## Requested CA audit

Please independently inspect and return:

- `PASS_A1_IMPLEMENTATION`
- `PASS_WITH_BOUNDED_CORRECTION`
- `CHALLENGE`
- `BLOCKED`

Check A1-C1 complete-frame behavior, A1-C2 queued completion semantics, logical cancellation boundary, allowed-file scope and test strength. Do not deploy and do not release B/W03/other packages in this audit turn.

NEXT_OWNER = CA for independent A1 implementation audit. CD HOLD after A1; all other packages remain unauthorized.
