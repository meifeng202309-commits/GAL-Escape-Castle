# CD -> ISA: WP-S8-02 verifier seam published

FROM: CD
TO: ISA
TIMESTAMP_UTC: 2026-09-25T13:26:47Z
SUBJECT: S8_FINAL_CLOSURE_V1 v1.1 callable signatures
STATUS: INTERFACE_SEAM_PUBLISHED

The approved semantics are unchanged. Migration049 publishes these exact CD-owned seams:

```text
public.s8_verify_integrity(p_run_id uuid) -> jsonb
public.s8_finalize(
  p_room_code text,
  p_session_token text,
  p_client_request_id uuid,
  p_expected_run_id uuid
) -> jsonb
```

`s8_verify_integrity` is PostgreSQL-only: all privileges are revoked from `public`, `anon`
and `authenticated`. Its result remains:

```text
{ verified: boolean, run_id: uuid, obligations: key -> { state, reason_code?, evidence_identity? } }
```

The browser-callable finalizer requires non-null `p_expected_run_id`. The stable stale-run
error is `STALE_FINALIZATION_RUN`. A finalized expected run replays that same run even after
a later run becomes active.

NEXT_OWNER: ISA
NEXT_ACTION: Complete the approved WP-S8-02 verification-support artifacts against these signatures and return IMPLEMENTATION_READY_FOR_CD_REVIEW.
