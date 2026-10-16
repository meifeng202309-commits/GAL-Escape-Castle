# CA decision: SQL validation route after direct Supabase access — 2026-10-16

Decision owner: CA. Evidence tier: route assessment only; no new SQL execution, cloud provisioning or deployment.

## Facts

- Gate-0 GitHub Actions run 38158942746 proved an ephemeral PostgreSQL 16 execution lane: migrations 001–019 passed, migration 020 stopped at absent Supabase-managed storage.buckets. 021–070 did not execute.
- A subsequently connected Supabase plugin permitted CA to query the real GAL's Castle Escape **PRODUCTION** catalog read-only on 2026-10-13. See SUPABASE_DIRECT_READ_ONLY_RECOVERY_20261013.md. Existing s7_get_teacher_console, s3b_grab, s3b_leave_start_room and domain tables exist; W03 combined RPC/receipt were not observed; operations_v1 was not observed.
- B1 migration 069 and W03 migration 070 are source-only/unapplied; a read-only catalog check cannot prove migration compilation or behavior.
- CD independent cross-check of the CA evidence was assigned by CA_to_CD_20261013T051000Z_supabase-live-catalog-evidence-temporary-independent-review.md. That separate task remains CD-owned until CD formally returns findings.

## Route decision

1. **Do not rerun or expand the generic PostgreSQL compatibility fixture immediately.** Although a one-table storage fixture might pass 020, further Supabase platform-managed roles, objects, policies and functions could create unbounded emulation and misleading PASS evidence. Do not declare migration 020 defective because storage.buckets is absent in stock PostgreSQL.
2. **Use connected Supabase for authorized production read-only catalog/ACL/source-version investigation only.** Never execute 069, 070, test mutation, synthetic fixture creation or deployment in the existing PRODUCTION project without a separate explicit gated authorization.
3. **For execution/concurrency/rollback/RPC integration proof, prefer a disposable Supabase project or genuine isolated Supabase stack** once deployment/test value and available budget justify it. An ephemeral PG targeted test may provide narrower syntax evidence with explicit limitations but is not an alternative to Supabase parity. Neither route is presently provisioned or authorized for a new run.
4. A1/A2 browser/mock and live UI verification can proceed through an independently authorized controlled plan; do not conflate them with unapplied B1/W03 SQL verification.
5. Preserve GitHub Actions run 38158942746 and source selection evidence. Main-branch temporary .github/workflows/ca-postgres-gate0-smoke.yml should be removed when no longer needed, but **deletion is a separate repository owner change decision**, not performed in this disposition.

## Gates and next actions

- Gate0 route-choice task: CA **CLOSED — DECISION_RECORDED**.
- B1 069: SQL_NOT_RUN; deployment HOLD.
- W03 070: SQL_NOT_RUN; deployment HOLD.
- CD independent review: IN_PROGRESS/WAITING_CD; return to CA when delivered. This assessment does not preempt or influence CD's independent verdict.
- No new implementation work, live SQL test, fixture emulation or cloud project created.
