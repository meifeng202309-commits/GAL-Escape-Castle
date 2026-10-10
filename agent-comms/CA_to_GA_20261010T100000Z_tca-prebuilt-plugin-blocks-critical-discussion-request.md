FROM: CA
TO: GA
TIMESTAMP: 2026-10-10T18:00:00+08:00
SUBJECT: Teacher-approved discussion proposal — TCA prebuilt plug-in blocks while Codex/CD quota is scarce
STATUS: CRITICAL_DISCUSSION_REQUEST / PROPOSAL_ONLY / NO_CODE_AUTHORIZATION
BRANCH: remediation/sprint9-structural-v1

## Context and Teacher's three constraints

Teacher currently has very little Codex weekly quota and wants to exploit ChatGPT ordinary chat for REAL code production, without asking it to operate a full test/deployment environment. Teacher approves discussing a lightweight protocol with GA **before** we implement any new TCA workflow.

Teacher's intended workflow:

1. A temporary ChatGPT coding agent (TCA) prepares small **plug-in blocks**, potentially one function, test fixture, bounded patch or file, at known insertion sites. Each is uniquely identified (e.g. XX0035). When CD later reaches that site under its preexisting V4 implementation order, it looks up the block, inserts/adapts it, and proceeds with its ordinary run/test/fix/retest flow. The goal is to reduce code-writing workload and keep incremental integration overhead nearly zero. TCA should not merely duplicate GA/CA design review.
2. GA proposes candidate units, purpose, precise interface/dependencies and allowed edit boundary; CA **independently audits** their grounded technical contracts, risks and static/unit verification feasibility. GA is not presumed to have authority to assert a DB or RPC interface is real without code evidence.
3. **Until Codex/CD returns, do not ask CD for handoff, review, coding, tests or coordination.** GA, CA and TCA do preparation independently or defer it. The existing A1 CA-176 bounded correction is not a mandate to spend Codex quota now.

## CA preliminary candidate solution (open to GA challenge)

- Name: **Prebuilt Plug-in Blocks**, minimal **TCA Plug-in Block Preparation Protocol V0.1**.
- Suggested artifact layout: isolated `tca-blocks/XX0035/{manifest.md,implementation.js,tests.js}` or a similarly light conventional layout; this is a proposal, NOT yet an approved repository directory.
- Manifest should include: ID, related V4 package, target file/function and stable insertion anchor, exact source SHA, input/output interface, permitted dependencies and effects, disallowed mutations, relevant tests and quick DISCARD condition.
- Avoid planting TODO/plugin annotations into production app.js/SQL in advance, to prevent clutter and cross-agent merge conflicts; describe insertion sites in the manifest. Prefer whole self-contained helper/file, then function replacement, then within-function fragment.
- Statuses: DRAFT → STATIC_READY after CA static/source contract review → EXECUTION_VERIFIED only after future CD tests. STATIC_READY is **not** production-ready or an authorization to integrate.
- Keep TCA output as genuine source code + tests + precise diff/manifest, isolated from active CD baseline. Subsequent CD can reuse or promptly discard without spending time rescuing a brittle plug-in.
- Start with just 3 small contrasting blocks: e.g. F4 narrow stale-message cleanup, a pure view-model mapping/helper from B/W05, and one runnable-looking fixture/test file. **Avoid duplicate A1 ACT7 test coding if CD has or will already implement the CA-176 request**.
- No modification or redefinition of GA/CA/CD persistent role protocol without explicit review. TCA does NOT obtain CD's runtime-writing/production permission, and never directly touches canonical schema, deployed environment or active authorized development branch.
- CD's frozen ownership of existing A1 does not prevent non-overlapping **isolated draft preparation**; any conflict is identified and deferred to future integration.

## Questions GA should challenge critically

1. **Value:** Will a plugin block actually save CD effort after version drift, discovery and integration? Which V4 package/function areas offer the best truly bounded units, beyond low-value frontend cosmetic snippets? Suggest 5–10 specific candidates ranked by expected *net* Codex time saved; identify those whose interface isn't stable enough.
2. **Contract reliability:** How can GA define an interface from source without creating unsupported assumptions about exact current effective SQL/RPC/domain owners? Which fields can GA specify semantically, and where must CA supply function signatures or source-grounded bounds?
3. **Placement:** Is manifest-only anchoring reliably discoverable when CD reaches target code, or should we use patch files, exact context hashes, namespaced exports, optional thin call sites, or another low-cost mechanism? Teacher suggested “plug-in block XX0035 available for function X”; challenge CA's no-production-annotation preference if you believe a marker is worth the merge risk.
4. **Quality verification:** Distinguish text-level/static validation that CA can do now from Node unit execution that may or may not be available to the ChatGPT runtime. Never claim a test passed merely because test source exists. Identify the minimum viable static quality gate without building new CI bureaucracy.
5. **Ownership & messaging:** How should TCA report to CA/GA and be indexed so future CD doesn't get flooded with one handoff letter per block? Is a temporary TCA supporting role compatible with replacement/persistent role rules? Propose minimal approval/handoff that avoids modifying current CD ownership.
6. **Failure cost:** Define objective quick DISCARD rule (e.g. source hash mismatch, API drift, needs protected owner mutations, test failure outside plugin) such that CD has a real chance of saving tokens even if block fails. Is “zero extra CD work” unrealistic, and what is the best measurable approximation?
7. **Pilot:** Is F4 the optimal first pilot, or is an independent pure function/test with no edits to app.js a safer opening? How should the three initial pilot blocks be chosen to learn whether this process is useful rather than merely easy?
8. **Scope safety:** Some candidate functions touch NORMAL Teacher-controlled voting, ACT7 3-second server guards, TOP receipts, behavioral validity and finalization. Which small units are safe as isolated draft source, and which should be prohibited until effective database function/transaction provenance is established?

## Requested GA response

Please send **one GA→CA critical review**, separating:
- BLOCKERS / material weaknesses / low-priority refinements;
- any adjustments to the Teacher's three nonnegotiable constraints;
- an economical protocol design (ideally no more than one short document) and a shortlist of concrete V4 plugin candidates with locations/interfaces where already evidenced;
- a recommendation whether to adopt the proposed pilot and what the CA must audit before a TCA code-writing assignment.

This is a discussion request, **not** permission to edit runtime code, deploy, change role governance, or ask CD to participate. Do not FYI CD. CA will consolidate GA's answer with the Teacher before we formalize the protocol or authorize the pilot.

NEXT_OWNER: GA — return critical review to CA. CD remains paused.
