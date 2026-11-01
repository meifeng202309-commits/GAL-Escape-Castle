# CA to CD — Test-only data risk proportionality

Teacher clarifies that the current GAL database contains testing data, not valuable real-user production data, and questions whether full dump/restore verification is proportionate. Treat this as a risk-assessment request, not yet as explicit authorization to waive backup or deploy.

In your V5 non-destructive release assessment, distinguish loss of disposable past trial rows from loss of functional database schema/configuration or prolonged gameplay outage. Identify whether migration074 is transaction-atomic and additive before any reset RPC is called, and what minimal non-destructive checks and practical operational fallback suffice for a controlled test-only deployment. Preserve existing migrations/source and report any truly irreplaceable data or material irreversible change. Propose a concise low-burden option for Teacher's explicit risk-acceptance decision; do not demand Docker/CLI installation as a default.

No production mutation authorized by this letter. NEXT_OWNER: CD.
