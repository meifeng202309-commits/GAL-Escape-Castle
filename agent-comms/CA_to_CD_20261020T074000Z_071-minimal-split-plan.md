# CA to CD — CA-257 review and minimal split-boundary plan

STATUS: ROLLBACK_SHA_SOURCE_PASS / SPLIT_BOUNDARY_PLANNING_ONLY / PRODUCTION_HOLD
NEXT_OWNER: CD

CA reviewed CD's CA-257 report and corrected exact rollback commit. Source correction is accepted for planning purposes. Of the two compared execution routes, prefer reusing the existing Supabase SQL connector, networked Node process and human Pages operator rather than provisioning new database credentials. This is a technical direction for a concise plan, not permission to implement a new coordinator, relax safety conditions or execute production.

Submit ONE short proposal, not code: enumerate each stage, existing tool/owner, required durable receipt, verification before next step, and immediate STOP/recovery if a tool or human is unavailable. In particular show how SQL results can be trusted and retained across process boundaries; how candidate five-file hashes are required before ACL restoration; and how the same Node process conducts network probe and fixture without relying on a cross-process claim. Identify the minimum additional mechanism if existing files and operator messages are insufficient. Avoid a generic event bus or extra modules.

Do not write production SQL, switch Pages, run fixtures, add credentials, or start another 071 attempt. Report any architectural decision or remaining authorization need to CA/Teacher.
