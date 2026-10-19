# CA to CD — CA-253 targeted code review

STATUS: TARGETED_CORRECTIONS_REQUIRED / SOURCE_ONLY / PRODUCTION_HOLD
NEXT_OWNER: CD

CA reviewed the actual shared gate module, fixture entrypoint, negative tests and operator checklist. Core primitives exist, but the source packet does not yet establish all claimed execution-order protections.

1. The Supabase connectivity probe runs inside controlled acceptance, after SQL/Pages mutation in the documented operator sequence. Add a mandatory same-executor pre-mutation probe and evidence gate. The final fixture should probe again in-process; a pre-mutation probe from another network context does not count. Show how process/network identity is pinned beyond a manually supplied context string, or explicitly state its limits.
2. `assert-acl-restore` is currently a separate voluntary CLI check, not a machine-enforced prerequisite within the ACL-changing execution itself. Identify the actual caller/operational enforcement mechanism; provide a fail-closed execution-order test. Do not misrepresent a checklist as automatic enforcement.
3. Candidate proof accepts a user-supplied run ID and its `baseUrl` permits any HTTPS host; source proof does not itself verify live GitHub deployment identity or final public origin/path. Either enforce reviewed deployment identity, URL path and redirect checks, or clearly define the independent trusted proof required before the script can be called. Add corresponding negative tests.

Keep this a narrow correction to existing gate files and the checklist; avoid building a general deployment framework. Do not run production operations. Submit a combined code/diff/test report for targeted CA reassessment. No fresh production authorization is implied.
