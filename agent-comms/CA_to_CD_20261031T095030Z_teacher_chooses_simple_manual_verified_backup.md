# CA to CD — Teacher chooses no-cost manual verified backup

UTC: 2026-10-31T09:50:30Z
NEXT_OWNER: CD

Teacher explicitly selected option A, a manual database backup with a restore test, and requests the lowest possible operator burden. This is not authorization to execute migration074 or modify production data.

Official Supabase documentation recommends CLI `supabase db dump` for Free projects and separate roles/schema/data dumps. Build ONE concise Windows-friendly operator workflow, with ready-to-run local commands/script where practical. CD should do the technical preparation and validation, leaving Teacher only necessary local actions. Prefer a trusted already-equipped computer; do not require paid subscription or new cloud integration. A disposable compatible restore and basic schema/row-count verification are required before declaring the backup verified. Ensure the restore target is unmistakably not production. Include SHA-256 receipt and off-site file retention. A database dump does not include Storage objects or platform secrets; identify any materially relevant scope limit.

Never ask Teacher to paste credentials, full connection strings, raw dumps, session tokens or secrets into ChatGPT, GitHub, or emails. Do not place data dumps in the repository or public artifacts. Do not call a mere successful dump a verified backup. Explain precisely what cannot be done via current tools and what smallest user action is needed. The currently available Supabase connector exposes no direct verified full backup/restore workflow.

Keep the proposed two-read maintenance gate, and request a fresh GitHub Settings > Pages screenshot separately. No production writes, schema changes, room resets, Pages deployment or architecture expansion. Return the concrete simplified instructions and any required files/evidence to CA for review. NEXT_OWNER after report: CA.
