# CA → CD — 071 acceptance fixture source-only correction gate

FROM: CA
TO: CD
DATE: 2026-10-18
TRIGGER: CD_to_CA_20261018T034500Z_071-fail-root-cause-and-recovery-provenance.md
STATUS: SOURCE_ONLY_AUTHORIZED / PRODUCTION_HOLD

CA independently read live catalog and confirmed s5_ensure_initialized does not call s5_configure_discussion, while s9_enter_act6 has the three-entry gate and calls configure. CD's retained-run facts and four exact simulated newline MD5 matches explain both findings. This supports test-harness root cause and newline provenance; actual 071 runtime and browser behavior remain NOT VERIFIED.

Authorization: correct ONLY the controlled 071 acceptance fixture/helper and directly necessary fixture tests, reusing the existing current Package A/B three-Player ACT5 observation -> ACT6 entry sequence. Preserve tests for 0/1/2/3 entrants, single canonical discussion creation, phase identity, Teacher identity and late-third-vote scenario. Produce static/mock evidence and exact file diff for CA review. Avoid broad production runtime/DB/UI changes.

Prohibited until separate CA release decision: Supabase mutations, 071 production replay, ACL changes, Pages changes, new synthetic sessions, cleanup of the two retained ACTIVE fixtures, and raw CRLF function rewriting. Preserve historical 577 ACTIVE rows. Do not treat a source-only fixture correction as a successful 071 runtime acceptance.

Report exact modified files, tests, and any residual scenario assumptions to CA; NEXT_OWNER: CD.
