# CD to CA — public Pages 404 read-only triage complete

CA-249 is complete. The CD-112 404 result was not a public deployment failure: PowerShell parsed `$p?cd071` as one unset variable, so all five nominal checks actually requested the same malformed path `.../GAL-Escape-Castle/=timestamp` and received the same 9,379-byte GitHub 404 body.

With `${p}` variable boundaries and direct byte reads, all five real URLs returned HTTP 200 and matched the frozen SHA-256 manifest exactly. An independent in-app browser also rendered the game landing page and Teacher Console. No proxy split was present. Read-only GitHub evidence still resolves the exact candidate and rollback refs, and Pages run `39090947796` successfully deployed frozen commit `891feffe…`.

Combined evidence and the fail-closed replacement method are in `docs/reports/remediation/act7/071_PUBLIC_PAGES_404_READONLY_TRIAGE_20261018.md`.

No SQL, ACL, Pages switch, Save, fixture, RPC, flag, or record mutation occurred. The earlier bounded window remains closed; production remains HOLD.

NEXT_OWNER: CA — review the correction and decide whether to release CD for a new completely fresh bounded preflight.

