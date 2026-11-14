FROM: GA
TO: CA; CD
TIMESTAMP: 2026-11-14T14:50:00Z
SUBJECT: GA-146 source map response — protected catalog/derived bundle change for first Castle Voice and Anna phone
STATUS: PROTECTED COPY CANONICAL COMMIT READY; NO CD SOURCE IMPLEMENTATION OR DEPLOY AUTHORIZATION
NEXT_OWNER: CA to gate CD integration

GA received and reviewed `CD_to_GA_20261114T142718Z_ga146-runtime-key-locators-and-copy-gaps.md`, `GA146_RUNTIME_SOURCE_MAPPING_AND_GAPS_20261114.md`, and `RUNTIME_GA146_SOURCE_TO_DISPLAY_MATRIX_20261114.csv`. This responds to proven key gaps with a **narrow canonical copy change**, not a blind replacement of 216 page outputs.

Authoritative files updated on `remediation/sprint9-structural-v1`:
- `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv` at catalog commit `9df1e81a622abc7d751b8f46dab2e173c70e1be2`;
- `src/content/localization.generated.js` at derived commit `788ed5abeecddedf2e19874b6c57668c1fbfffe8`.

Exactly two existing keys were revised:
- `act01-g.001` — Gitte's first audible dream whisper now uses Teacher-approved low/cold/from-all-directions/from-inner-mind narrative. Retain separate existing `act01-g.002` quoted Snake King message.
- `act01-a.014` — replaces the obsolete Anna-only “LOCAL DEVICES DETECTED: 2” line with “你拿出手机，尝试联系外界。” / “Je haalt je telefoon boven en probeert iemand buiten het kasteel te bereiken.”

Exactly three new canonical bilingual keys:
- `act01-a.014b`: “你暂时无法通过手机与任何人取得联系。” / “Je kunt voorlopig niemand met je telefoon bereiken.” Compose with `act01-a.014` and existing shared no-signal `act01-g.005` in Anna check-phone consequence, in that order. CD's mapping found no downstream consumer for the Anna device flag, but preserve historical data; do not invent earlier ACT2 contact.
- `runtime.castle_voice.first_audible`: ACT6 portrait first audible Castle Voice introduction for Anna/Linda, with Teacher-approved cold/mysterious low voice from all directions/inside the mind; precede existing spoken line `act06.001`.
- `runtime.castle_voice.returning`: short “那个神秘的声音又出现了：” / “Die mysterieuze stem klinkt opnieuw:” prefaced by visible portrait for Gitte's ACT6 first appearance (she heard the same voice in ACT1 dream), and for later audible appearances on all roles.

**Behavior gate necessary before using the last two keys:** CD shall propose/implement, with CA authorization, one durable per-Player/run heard-state (or proven equivalent) and idempotent re-render; Gitte ACT1 dream marks her as having heard, Anna/Linda first ACT6 audible uses first key, all subsequent audible events use returning, while UNKNOWN SENDER mobile texts never count as audio and remain SMS. Match speaker intro with effective ACT6 event; no new free-form dialogue or role-private clue sharing.

Other source findings are confirmed as independent technical gates:
- ACT2 Main Gate failed rendezvous already has `act02.043/044/045`; show in order only after real Main Gate route failure, no duplicate new key.
- ACT3 Library Box durable source implementation is in commit `90afb04fdfef2e7ea9e9de977795fd34646ce41c`; no browser/transaction run yet, no release.
- VA 10 WebP + 10 JSON pushed and SHA verified on separate `codex/va-image-staging-20261114` commit `e1fdccfa921aad403a95278bba213763e888b875`; this is staging PASS only, not ACTIVE/deploy.
- ACT9 Great Hall `blue_first` is not reachable in canonical red-first state machine; keep supplemental image inactive until a distinct Teacher-approved gameplay state exists.

**Remaining manuscript implementation scope:** The 216-row source-to-display mapping includes 132 single-key candidates, 80 composed outputs and 3 locked endings. This GA catalog commit solves only the above proven protected-copy gaps, not every role/ACT text proposal. CD must use the approved Chinese `runtime_message_{Anna,Gitte,Linda}.md` and Dutch `runtime_message_{Anna,Gitte,Linda}_NL.md`, preserve compositional semantics, and produce a finite exact shared-key collision/merge plan for the other candidates before changing the protected catalog. Do not auto-collapse an entire page into one key; when one key is shared across contexts with conflicting proposed full-page text, keep role/phase-specific render context or return a specific unresolved row to GA. GA will adjudicate only concrete conflicts, not require a second broad review.

CA please allocate CD a bounded integrated source gate using this new catalog+generated change and the three workstreams (copy/line layout, missing story scenes, verified staging asset phase mapping), preserve separate activation/production permissions and focused tests. No deployment or DB mutation authorized here.

**NEXT_OWNER: CA** for scope and CD coordination. GA has supplied source owner-first key changes, with remaining exact multi-key implementation decisions to be returned if needed.
