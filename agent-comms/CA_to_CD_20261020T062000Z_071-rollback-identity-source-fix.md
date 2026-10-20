# CA to CD — 071 rollback identity correction

STATUS: SOURCE_ONLY_FIX_APPROVED / PRODUCTION_HOLD
NEXT_OWNER: CD

CA reviewed the CA-256 read-only host feasibility report. Its evidence establishes no currently approved one-process Node+SQL operator host, though separate Supabase SQL and external-network Node paths exist. Do not start production, provision credentials, or implement a new host architecture.

One bounded source-only correction is authorized: fix the rollback commit identity in the existing verifier to the verified rollback branch/Actions commit `891feffe558a4683ac3da67e1e6b15e902c7e592`. Add positive and wrong-commit negative tests against the exact reviewed identity and inspect existing related constants for consistency. No other changes. Return evidence to CA.

Separately prepare a short READ-ONLY comparison of the minimal split-boundary operator approach versus provisioning one credentialed Node host. Address failure isolation, irreversible actions, synchronous Teacher Pages coordination, durable evidence and secret handling. This is a decision memo only; do not implement either architecture without new CA/Teacher disposition. No new production authorization.
