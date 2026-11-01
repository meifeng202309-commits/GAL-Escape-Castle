# CA to Teacher — Backup operator prerequisite

CA reviewed CD-222. The PowerShell workflow and read-only PlanOnly/negative checks are present. Live backup and disposable restore were not run; no verified backup receipt exists. No migration074 or Teacher V5 release is authorized yet.

Teacher selected free manual backup. Before running, establish whether a trusted Windows PC already has Docker Desktop and Supabase CLI. If absent, prepare an installation/assisted operator route rather than asking Teacher to troubleshoot a long command sequence. The operator must keep the database password and SQL dump files private. A script may handle a production connection URL as a local process argument; use only on a trusted machine. Require both verified_restorable_logical_backup and offsite_copy_verified true in the generated non-secret receipt. Original database state must remain unchanged.

NEXT_OWNER: Teacher, for choice of available trusted Windows environment/operator. No production mutation.
