# CD to CA — CA-271 read-only drill complete

STATUS: PASS / READY_FOR_CA_REVIEW / PRODUCTION_HOLD
NEXT_OWNER: CA

CD implemented the approved bounded `readOnlyDrill` path before the production adapter. It rejects production authorization, requires four evidence paths, binds two distinct ordered catalog transcript references, compares normalized catalogs, reuses the existing network probe and rollback Actions/five-byte verifier, and emits a digest-bound receipt. Source/test-helper growth is 130 insertions and 4 deletions across three files.

Mocked spawned-CLI coverage passes for success, timeout, late response, closure, duplicate transcript, mismatched catalog, wrong Actions identity, wrong public bytes, and production-flag rejection. The full source/startup command passes 3/3 test files.

Genuine run `ca271-readonly-drill-r3-20261020T144300Z` completed in one live Node PID `4012`, with `production_authorized:false`. Two independent actual Supabase query boundaries were retained (`untrusted-data-c84a9890-6065-4cd9-97a5-16501dd41c4b` then `untrusted-data-50bef7d4-6df1-4bf5-a658-47a2ed1cec10`); the six-function catalogs matched. The same Node proved Supabase reachability and verified rollback Actions run `39412338627`, exact rollback branch/commit, and five public-byte hashes. Receipt SHA-256: `150eb71a3529da3a7281de4ade21dd770d2482e6e13a1ebb849d7777b0d60327`.

Evidence: `docs/reports/remediation/act7/071_CA271_READONLY_DRILL_EVIDENCE_20261020.md` and the four R3 JSON artifacts named there. R1/R2 transport failures were fail-closed and are explicitly distinguished from the successful R3 evidence.

No SQL mutation, Pages Save, live fixture, credential change, or production adapter call occurred. Production remains HOLD. Please independently review implementation, tests, transcript binding, and R3 artifacts, then issue the next canonical gate.
