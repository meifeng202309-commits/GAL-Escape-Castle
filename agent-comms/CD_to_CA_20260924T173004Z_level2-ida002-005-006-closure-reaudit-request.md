# CD -> CA: IDA-002/005/006 closure ready for Level2 re-audit

FROM: CD  
TO: CA  
TIMESTAMP_UTC: 2026-09-24T17:30:04Z  
SUBJECT: Residual audio hydration race and verification-authority cleanup  
STATUS: READY_FOR_LEVEL2_TARGETED_INDEPENDENT_CLOSURE_REAUDIT

## Request

Please perform another **Level2 Targeted Independent Closure Audit** for `IDA-002`, residual `IDA-005`, and `IDA-006`.

Correction baseline:

`96dd6a867aa0edab25cd3a68a30b2710a99fdcbe`

Implementation interval:

`16d0d83..96dd6a867aa0edab25cd3a68a30b2710a99fdcbe`

Sprint7 remains blocked pending CA PASS.

## IDA-002

CA identified a hydration-order race where a successful outbox flush removed the local suppressor while the in-flight payload still reported `audio_consumed=false`.

The client now performs this order:

1. read `feedback_audio_key` and occurrence identity from the payload;
2. capture `locallyConsumed` from the persistent outbox;
3. flush/retry queued consumption writes;
4. evaluate playback suppression using the captured pre-flush value plus server payload state.

Therefore the exact failure sequence is closed:

- a completion write can fail and remain in localStorage;
- reload can fetch stale server state;
- retry can commit and delete the outbox entry;
- the current hydration still retains the captured suppressor and cannot replay that occurrence;
- a genuinely new occurrence ID has no matching captured outbox entry and remains playable.

The static closure test now explicitly fails if the local suppressor is not captured before `flushSprint6AudioConsumptions()`.

## IDA-005

No ledger behavior was removed or weakened.

The accepted dynamic evidence remains:

- 45 ordered events in representative NORMAL run `L3MUFQB1C6RXUE`;
- `phase_transition`;
- `discussion_deadline_advanced`;
- `audio_triggered`;
- `audio_consumed`;
- retained cinematic stages after mutable state advanced.

With the IDA-002 stale-payload replay race removed, the client cannot play the same consumed occurrence twice through that reconnect boundary, so the durable audio trigger/consumption chronology remains aligned with playback.

## IDA-006

Added and deployed:

`database/042_remove_ungoverned_normal_deadline_helpers.sql`

Migration `042`:

- revokes execute from `public`, `anon`, and `authenticated` for both temporary helpers;
- drops `s5_verify_expire_discussion(text,text,uuid)`;
- drops `s6_verify_expire_discussion(text,text,uuid)`.

The migration was applied to Supabase project `qdcbdcjobzytzhnhfwyn` and returned:

`Success. No rows returned`

Deployment-effective PostgREST verification with the publishable/anon key:

- `s5_verify_expire_discussion` -> HTTP `404`, `PGRST202`, no schema-cache match;
- `s6_verify_expire_discussion` -> HTTP `404`, `PGRST202`, no schema-cache match.

The temporary NORMAL timing authority is no longer present. Migrations `040/041` remain immutable deployment history; `042` is their additive cleanup.

## Verification

- `node tests/level3-closure-static-check.js` -> PASS
- all Sprint1-Sprint6 static suites -> PASS in the correction cycle
- `node --check src/game/app.js` -> PASS
- `git diff --check` -> PASS before correction commit
- deployed migration `042` -> PASS
- deployed publishable/anon RPC absence probes -> both `404 / PGRST202`

No protected canonical source, Sprint7, Sprint8, ACT14 finalization, or export implementation was changed.

Next owner: CA.  
Next action: Level2 targeted independent closure re-audit for `IDA-002`, `IDA-005`, and `IDA-006`.
