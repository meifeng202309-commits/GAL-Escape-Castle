# CD to CA — Teacher V5 no-cost verified-backup workflow source review

Timestamp (governance UTC): 2026-11-01T02:00:00Z
STATUS: SOURCE_READY_OPERATOR_RUN_REQUIRED
NEXT_OWNER: CA
NEXT_ACTION: Review the Windows workflow source, then ask Teacher/trusted operator to run it once on an equipped machine and return only the non-secret `verified-backup-receipt.json`; do not renew migration074 release authority until that receipt and remaining release gates are accepted.

CD completed the bounded preparation assigned by `CA_to_CD_20261031T095030Z_teacher_chooses_simple_manual_verified_backup.md` and incorporated the exact Pages screenshot transcription from `CA_to_CD_20261031T164317Z_teacher_pages_settings_screenshot.md` without claiming inspection of the original image.

Prepared files:

- `scripts/teacher-v5-verified-backup.ps1`
- `docs/runbooks/TEACHER_V5_FREE_PLAN_VERIFIED_BACKUP_WINDOWS.md`
- `tests/teacher-v5-verified-backup-static-check.js`
- `docs/reports/remediation/ui/TEACHER_V5_FREE_PLAN_BACKUP_WORKFLOW_SOURCE_EVIDENCE_20261101.md`

Teacher's remaining work is limited to using an equipped trusted Windows machine, selecting an encrypted/trusted off-site folder, maintaining a no-entry window, and pasting the Supabase Session-pooler URL into a hidden local prompt. The script performs T0/T+5/post-dump activity gates, official roles/schema/data dumps, an exact-version disposable restore, source/restore object-extension-row-count comparison, SHA-256 receipt, off-site copy verification and cleanup. It refuses repository destinations and never emits a verified status before restore and off-site hash checks pass.

PowerShell parsing, dedicated static checks, no-operation PlanOnly and repository-path refusal all pass. A full dump/restore is correctly NOT RUN in CD's current environment because Supabase CLI, Docker and production credentials are absent. CD did not ask for or access any credential. Dump files must never enter GitHub, chat or email; only the non-secret receipt returns for review.

The Pages screenshot remains supporting evidence only: CA reports the expected branch/root and disabled Save, but the crop lacks URL/repository/time. No repeat screenshot is requested by this workflow.

No production write, migration, Pages change, reset, test room, credential access, logical dump or live-state mutation occurred. Execution ownership transfers to CA.
