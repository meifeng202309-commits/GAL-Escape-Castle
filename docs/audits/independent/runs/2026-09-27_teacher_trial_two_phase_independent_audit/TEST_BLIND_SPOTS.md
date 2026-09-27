# TEST-SUITE BLIND-SPOT / MUTATION-LITE AUDIT

Baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`

## G1. Inventory

35 files exist under `tests/`:
- Sprint1 through Sprint8 static/live suites;
- Sprint9 readiness/cache/placeholder checks;
- Level2/Level3 closure suites;
- SQL integrity tests.

No Playwright, Puppeteer, Cypress, Selenium, WebDriver, or other browser-driving harness exists in the repository.

## G2. Test → invariant observations

Strong direct-RPC coverage exists for:
- three-player role claims;
- canonical ACT1 role-specific server validation;
- canonical private choice isolation;
- DiscussionRoom stale identity / tie / reconnect;
- canonical generic-discussion server fail-close;
- ACT1–13 state progression;
- Teacher Override and validity;
- finalization/export run isolation;
- asset resolver cache source behavior.

## G3. Static vs behavioral distinction

Several Sprint9 checks are source-string/static checks. They establish that fallback code exists but do not prove the root product enters the intended renderer.

The live E2E scripts use direct `fetch(.../rpc/...)`, not browser interaction.

## G4. Counterfactual review

### Counterfactual: root player keeps legacy pre-run fallback

Would canonical Sprint3B live test fail? **No.**

Its fixture:
`create room → join all 3 → s2_start_run → s3b_initialize_flow`
and only then begins ACT1 assertions.

It never renders root `index.html` between join and formal initialization.

### Counterfactual: start-run and canonical initialization are separate and user-visible

Would Level3/Sprint8 live tests fail? **No.**

They call the two RPCs back-to-back programmatically and do not assert the intermediate UI state.

### Counterfactual: legacy Sprint1 reveals choices

Sprint1 live tests actually validate the legacy reveal as a feature. Thus legacy tests are correct for the prototype but self-confirm the continued behavior; they do not test that production root no longer exposes it.

### Counterfactual: root page shows wrong renderer while formal RPCs are correct

Would static tests fail? **No**, unless they explicitly inspect the orchestration branch. Existing placeholder static test only checks presence/order of asset fallback functions.

## G5. Actual mutation-lite / executable status

No local repository execution environment was available through this CA toolchain, and live Supabase POST tests cannot be run here.

Instead, mutation-lite was performed as counterfactual control-flow analysis against the actual tests.

Teacher's first manual browser trial supplies the missing behavioral evidence and falsified the test assumption.

## Finding

**IDA-006 — MEDIUM:** Product-level test coverage does not exercise the real browser startup path:
`root room creation → staggered joins → pre-run waiting → formal start → canonical ACT1`.

This is a coverage finding, not merely "more tests would be nice": it directly explains why a HIGH legacy exposure survived prior canonical-flow E2E suites.
