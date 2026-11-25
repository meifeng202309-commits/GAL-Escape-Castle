# CA-338 Lean V0.2 — Final Integrated Source Review

FROM: CA — Code Audit Agent
DATE (UTC): 2026-11-25T01:32:00Z
STATUS: **SOURCE / DISPOSABLE-BROWSER PASS; PRODUCTION RELEASE HOLD**
SCOPE: CA-348 corrections in the single CA-338 integrated candidate. No added audit gate.
BRANCH: `remediation/sprint9-structural-v1`
IMPLEMENTATION SHA: `e17c243a77fa2364e8dc9e41e7bfa98d587de4a3`
EVIDENCE / WORKFLOW SHA: `09b4725225cb923e141cf59dc1e6bb0fb7c060be`
RUN: https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/45525033805 (completed, success, HEAD matches evidence SHA)

## Decision

**PASS — CA-348's two evidenced source/release-packet corrections.** No newly confirmed implementation defect warrants another CD correction cycle. This is NOT approval of production rollout or an assertion of exhaustive ACT1–14 live acceptance.

**RELEASE HOLD — explicit Teacher decision (2026-11-25):** Wait until VA reconciles `prop_linda_watch_back` v002 exact approved source bytes and sidecar before the *single consolidated* release. The prior suggestion to omit that image is **not authorized for this round**. Continue no production DB, Storage, registry ACTIVE, or Pages writes until a separate explicit Teacher production authorization after the completed image packet.

## Independent evidence and scope

1. **Module-closure finding CLOSED.** `src/game/app.js` imports the GA-generated `src/content/runtime-page-text.generated.js`; amended CA343 release addendum lists four changed Player files, including this dependency. `tests/teacher-v5-pages-module-closure.test.mjs` recursively checks the actual Player module graph; CI reports ten modules, zero missing. Changed-file list and amended payload were separately compared to CA-348's previously frozen three-file proposal.
2. **Visible Runtime verification adequate for a lean source gate.** Existing Chromium integration driver `tests/v4-player-integrated-runtime-browser.mjs` mounts actual `index.html` and `app.js`, drives three roles with simulated server responses, selects 25 explicit role/branch Page IDs across changed ACT1/2/5/7/8/9/11/12/13, and compares rendered NL and ZH against `resolveApprovedRuntimePage` exactly. Verified CI step `GA-152 integrated Runtime browser` succeeds at the evidence SHA. The check does NOT prove actual live server state or every one of 92 aliases. Remaining aliases, ACT7 attempts 1/2 and ACT9 STAY Page 047 are explicitly **NOT VERIFIED**; no general pass claimed.
3. Existing same-workflow static and browser checks for completed-run replay/session, first Join, Main Gate, Library image, ACT3, ACT6, ACT9 and ACT10 succeeded. ACT14 is limited to existing completed-run/reconnect browser coverage, NOT a new full human-run pass.
4. GA authority: GA-151 / GA-152 owner handoffs and canonical `GAL_APPROVED_RUNTIME_PAGE_TEXT_V1.csv` commit `b1c5a503ce0193f914b5fae7ccadeddeb8b249a8`, generated JS commit `bfc0fe09b4c170b4dc8fd6efac722f666a3da9ef`; CD consumes these without editing GA-owned canonical prose in the inspected CA-348 correction interval. **Canonical Ownership Check: PASS.** No source alteration to protected gameplay/visual authority identified in this narrow correction interval.
5. Eight separately approved visual candidates and migration079 belong to the same proposed release; their *production* application/readback remain **NOT VERIFIED**. Linda watch v002 sidecar approved SHA `8e37cff45a269c87577ab339bb95d177b68c84a20c846617b8ab9370506ebab5` differs from staged WebP SHA `06c593576ae9af6f9dff354def49c54e64fae7048b437913da8c0d95ac213d0f`; v002 must not be published/activated until VA provides reconciled, authoritative bytes and metadata. Existing v1 stays unchanged.

## Codex recurring-error patterns A–F

- **A Cross-module handoff — PASS (source):** previously missing Player import now present in the single four-file changed payload; recursive module closure clean.
- **B Authoritative state / UI projection — PASS with coverage limit:** representative role/phase/branch Runtime selectors are exercised against projected server facts; actual live state across all paths NOT VERIFIED.
- **C Response loss / retry / reconnect — PASS for unchanged relevant regression:** existing completed-run/session and first-Join browser gates pass; no new network fault-injection required for text/module delta.
- **D Client-only vs server authority — PASS for inspected delta:** Page IDs are presentation choices based on server-projected state; no new client-side vote/state mutation authority introduced.
- **E Evidence / persistence — NOT APPLICABLE to inspected corrections:** generated presentation text/module packaging adds no new event or storage semantics; migration079 remains unapplied and independently gated at actual release.
- **F Legacy/new path overlap — PASS for inspected delta:** existing Action/Pocket/ACT14 consumers preserved; Page-ID text is on Runtime narrative surface, with existing integration checks. Full live user-journey coverage is NOT VERIFIED.

## One remaining release dependency and minimal next actions

- **Next owner VA:** reconcile the exact Linda watch-back v002 approved image and sidecar; give CD/CA one precise GitHub path, bytes SHA-256, correction commit, and confirmation that identity/version and artistic contents remain Teacher/VA authorized. No extra image design or trial scope.
- **Then CD:** incorporate that exact approved image into the *same* coherent visual/Runtime/Pages/079 release payload; perform only necessary existing checks and return one refreshed factual consolidated release packet. No independent micro-gates.
- **Then CA → Teacher:** check only material delta and request one concrete production decision. On authorization CD may perform the coordinated release and smallest live smoke. No authorization is presumed.
- Teacher-facing status: current eight prepared images and Runtime candidate are **not deployed**; existing production remains in place. Teacher chose not to omit Linda watch v002.

This report closes CA-348's two corrected findings, preserves the existing CA-338 package, and does not create another audit round.
