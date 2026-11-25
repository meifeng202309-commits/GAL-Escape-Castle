# CA → CD — CA-355 Teacher explicitly authorizes one unified CA-338 production release

FROM: CA — Code Audit Agent
TO: CD — Coding Agent
TIMESTAMP: 2026-11-25T07:45:00Z
STATUS: **TEACHER PRODUCTION GO / CD EXECUTION REQUIRED**
NEXT_OWNER: **CD**
BRANCH: `remediation/sprint9-structural-v1`
SOURCE AUDIT: CA-349 / CA-354
RELEASE PLAN: `docs/reports/remediation/ui/CA343_CA338_CONSOLIDATED_RELEASE_READINESS_20261123.md`
INPUT: `agent-comms/CD_to_CA_VA_20261125T_linda-watch-v003-staged-ca338-package-ready.md`

## Approval and exact scope

Teacher gave unequivocal **“批准”** to CA's single request immediately after CA-354: execute **one coordinated production release** for the reviewed CA-338 trial fixes, **after confirming there is no live human game**. This is actual release authority, not just permission to prepare.

Approved integrated scope, without expansion:
1. Apply and verify additive production migration `database/079_ca347_runtime_consumer_integration.sql` (current baseline migrations through 078).
2. Verify exact bytes and publish/activate the **nine Teacher-approved images** listed in the CA343 packet, including `prop_linda_watch_back` **v003**, Main Gate v003, Library ajar v001; retain originals/disputed v002 and all historical assets.
3. Advance only the necessary runtime candidate/asset registry activations; preserve original Library baseline, both existing ACT9 door-state variants, and all six already authorized audio assets/versions. For ajar candidate retain registry identity in any recovery, with null active version if needed.
4. Publish the **reviewed four changed Player Pages files together with all their unchanged module dependencies**:
   - `src/game/app.js`
   - `src/styles/app.css`
   - `src/content/localization.generated.js`
   - `src/content/runtime-page-text.generated.js`
   Use exact checked file hashes from CA343 addendum.
5. Minimal real-public-browser smoke: join and basic actual three-role visibility, changed NL/ZH Runtime display, completed-run session switch/replay, image resolution including watch v003, original Library before Inspect First and ajar after, Main Gate and ACT9; inspect no new material breakage. On a material failure, execute the rehearsed smallest recovery/rollback and report result.

## Operational boundaries

- Before any writes, **confirm no active human rooms/runs**; if cannot verify, STOP and ask Teacher for operational availability, do not assume. Snapshot only the minimum existing production state required for safe rollback.
- Recheck that live migration/Registry/Pages baseline matches CA343 release plan; if material drift, STOP and report concrete delta to CA/Teacher rather than guessing.
- No per-image approvals, additional micro-audits, new frameworks, broad regression/architecture/refactor work or separate production authorization for the actions **within this precise approved scope**.
- Do not redesign images; only stage exact preapproved hash-matching files. Any binary/readback mismatch stops the affected release and invokes safe recovery/stop.
- No historical room/run deletion or broad data cleanup; keep recovery lean.
- A CI PASS or source verification does not count as successful deployment; report actual live endpoints/asset resolution and visible game checks.

## Required completion/handoff

CD proceeds autonomously through the approved deployment or an explicit blocked/rolled-back endpoint. Send **one concise CD→CA completion or precise blocker letter** and append CD Action Log with UTC timestamp, deployed source/asset identities, verified live results, and any NOT_RUN/human-trial remainder.

**Ownership CA → CD at 2026-11-25T07:45:00Z.** Production authority granted here for only the described one-time CA338 package; do not proceed to unrelated deployments.
