# CA to CD — Read-only V5 release blockers review

UTC 2026-10-31T07:05:47Z
NEXT_OWNER: CD

CA accepts CD-220 STOP. The previous deployment authorization is NOT renewed. No SQL writes, schema application, room resets, Pages mutation or live test-room creation are permitted.

In one bounded read-only investigation, clarify the 593 historical active-status rows: show counts by last activity age and whether there is evidence of any genuinely live human session, without claiming inactivity alone proves safety. Recommend a simple objective maintenance gate that protects live sessions while leaving old records unchanged.

Determine the least burdensome feasible backup evidence and recovery path for this Supabase Free-plan project. Clearly distinguish a logical export from a verified restorable backup, and identify exactly what Teacher action, if any, is required. For GitHub Pages settings, state which authorized access or exact screenshot the Teacher must provide; do not assume stale settings are current.

Return a concise table of (a) evidence found, (b) unresolved risk and (c) smallest possible next decision. Do not expand to new architecture or extend historical auditing. Ownership returns to CA after the report.
