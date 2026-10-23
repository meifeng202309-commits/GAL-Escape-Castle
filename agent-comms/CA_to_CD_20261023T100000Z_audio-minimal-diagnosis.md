# CA to CD — audio failure focused investigation

Date: 2026-10-23
Next owner: CD

Teacher's completed human ACT1–14 troubleshooting PPT reports inaudible audio at more than one scene despite normal volume. CA285 coordinated release has been accepted and must remain stable. Investigate whether audio failures are an independent, narrowly repairable client/asset issue. This is diagnosis-only; do not interpret this as authority to amend or redeploy CA285.

Check the actual deployed audio asset URLs, referenced file names and Git reachability, browser play rejection/autoplay/user activation, muted/volume/mixer state, trigger and deduplication logic, polling/cinematic rerender interactions and console/network errors. Identify exact affected scenes and whether user-supplied audio assets are required; do not claim one root cause without evidence. Prefer existing asset and code paths rather than new playback frameworks. Reproduce with a real-browser smoke if feasible, distinguishing muted playback from sound too quiet to hear.

Return short root-cause evidence, impact, and one minimal repair/test proposal. If simple source-only change is demonstrably enough, request CA implementation approval; do not start a rewrite, commission sound design, change database, modify production files or deploy without separate authorization. No Teacher Console Live Operations or visual/prompt work.

NEXT_OWNER: CD.
