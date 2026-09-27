# Structural Remediation V1 — Starting Safety State

- Recorded at: `2026-09-27T14:20:45Z`
- Released starting commit: `dbe1709f6bb19fca3465a5a9373c293bdbf2ce1e`
- Frozen audited product baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`
- Recovery branch: `safety/pre-remediation-20260927`
- Recovery SHA: `a4ad27c6e61cc33a259ae4ed5dc5fcaf0c0faad7`
- Integration branch: `remediation/sprint9-structural-v1`
- Immutable deployed migration ceiling: `058`
- Next migration, if evidence requires one: `059+`

## Initial Phase 0A browser evidence

Deployed root URLs inspected:

- `https://meifeng202309-commits.github.io/GAL-Escape-Castle/teacher.html`
- `https://meifeng202309-commits.github.io/GAL-Escape-Castle/`

Supabase project configured by the served source:

- `https://qdcbdcjobzytzhnhfwyn.supabase.co`

Fresh diagnostic room: `R0A927`.

Observed before formal-run creation:

- the root player page accepted Gitte's join;
- it immediately rendered `Scene 1 — Wake Up`;
- it exposed the three legacy Sprint1 choices (`Study the map on the wall`, `Check the old keys on the desk`, `Go straight to the door`);
- it showed `0/3 submitted` rather than an explicit formal pre-run lobby;
- no role-specific formal opening asset or placeholder was rendered.

This confirms the source-traced legacy fallback is reachable on the deployed root product. It does not yet classify the separate IDA-004 start/init contradiction; that evidence remains to be captured before Package A acceptance.

No runtime source or database migration was modified while capturing this evidence.

