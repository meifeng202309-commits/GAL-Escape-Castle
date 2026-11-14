# GA-146 Runtime source mapping and canonical gaps

Date: 2026-11-14
Owner: CD
Scope: CA Gate I mapping plus Gate II/III source findings; no protected copy edit or production release

## Complete mapping

`RUNTIME_GA146_SOURCE_TO_DISPLAY_MATRIX_20261114.csv` contains 216 rows: 72 each for Anna, Gitte and Linda. Every row records ACT, stable Page ID, role, trigger/outcome, current ordered keys, source projection/caller, current surface, exact Chinese/Dutch manuscript references, role visibility and state/key disposition. The original 86-row evidence CSV is unchanged.

Mapping totals:

- 132 single-existing-key copy candidates;
- 80 composed multi-key outputs that must remain composed and must not be replaced by one concatenated key;
- 3 locked ACT14 rows;
- 1 Anna device-discovery removal requiring consumer verification.

All 216 manuscript rows are source-evidenced Runtime rows except any explicit `ENTER PORTRAIT HALL` control, which belongs to Action. Conditional rows remain alternatives, not sequential output claims. NL and ZH `<br>` markers remain line boundaries; the matrix does not flatten copy.

## Proven source findings

### Anna ACT1 device discovery

`anna_detected_devices` is written only by `database/009_sprint3b_act1_consequence_integrity.sql:s3b_apply_act1_consequence`; repository-wide search found no downstream reader. `act01-a.014` is projected only by the `check_phone` mapping in `database/011_sprint3b_transition_and_act1_delivery_integrity.sql`. Therefore the obsolete two-device output can be removed from that caller after GA supplies the canonical replacement for the approved phone wording. Retaining or removing the unused fact has no demonstrated gameplay consumer; deletion of historical facts is not proposed.

### ACT2 failed Main Gate rendezvous

Authority correctly reaches `route_consequence/main_gate` only after meeting resolution, but the current scene exposes only `act02.043`. Existing canonical keys `act02.044` and `act02.045` (snakes emerge/block corridor; common entrance unreachable) are not composed by the Player caller before `s3b_complete_foldback` redirects to Library. This is a demonstrated projection/composition gap, not missing copy. A later source patch should render ordered `act02.043 | act02.044 | act02.045` only in the authoritative `route_consequence/main_gate` phase.

### ACT3 Library discovery

Implemented independently in source-only commit `90afb04fdfef2e7ea9e9de977795fd34646ce41c`: migration076 adds the reconnect-safe three-Player acknowledgement gate; direct and timeout success share the same discovery phase; current active v001 photo/note render before ACT4 and remain in Group Pocket. No catalog, registry, ACTIVE or production change occurred.

### ACT6 first Castle Voice

The authoritative transition and caller already exist: migrations 061/063 enter `act6_portrait/act6_vote`, project `act06.001`, and `renderSprint5` shows the portrait/eyes overlay plus `presentation_text_key`. What is missing is per-Player first-audible/repeat authority: current `act06.001` is a shared continuously projected presentation and cannot distinguish Gitte (repeat after ACT1) from Anna/Linda (first audible encounter). This requires a minimal owner-approved state/copy contract, not blind substitution:

- one per-run/per-Player durable `castle_voice_heard_at` (or equivalent existing evidence if GA/CA identifies one);
- Gitte initialized as heard by the ACT1 dream event; Anna/Linda uninitialized;
- first ACT6 presentation uses a GA-owned first-audible key; repeat uses a GA-owned return key;
- UNKNOWN SENDER messages remain SMS and never set audible-voice state.

GA must supply exact canonical NL/ZH keys/copy for the first-vs-repeat introduction before CD implements this portion.

### Later gameplay coverage

- ACT5 `ENTER PORTRAIT HALL` remains an Action control.
- ACT7 private clock/watch evidence must keep current owner-local projection; no shared copy collapse is authorized.
- ACT9 step authority is explicit (`act9_step` 1–4); current overlays derive door state from step flags.
- ACT10 take/leave and ACT11 A/B/C versus A/B/WATCHER are already represented by guarded source phases and role allocations; the review inventory is incomplete coverage, not proof that the gameplay is absent.
- ACT12/13 use `feedback_text_keys` plus cinematic/escape transitions; duplicate presentation requires a focused browser replay before any removal. It remains NOT VERIFIED, not silently fixed.

## VA image trigger contract after staging

The 20-file binary transport is verified at `e1fdccfa921aad403a95278bba213763e888b875`; nothing is active.

| Asset | Intended surface/trigger | Source contract before activation |
|---|---|---|
| `prop.library_clock_clue_note` v002 | ACT3 discovery and retained Group Pocket | Same identity as v001; no gameplay change. Remove duplicate HTML note text only after resolver proves v002 is active and artwork text equivalence is independently accepted. |
| `prop.photo_1897` v001 | ACT3 discovery and Group Pocket | Already active and used by migration076/client patch. |
| `shared.library/variants/hidden_door_ajar` | ACT5 inspect-first result, `post_inspection_route` | Do not replace ACT3/ACT4 base Library. Variant selection needs a reviewed resolver contract; base Library and `library_unknown_door` anchor remain required before reveal. |
| `shared.main_gate` v003 | ACT11/12 Main Gate | Same scene identity; revalidate A/B/C/watcher anchors. Suppress duplicate A/B/C HTML labels only when v003 is actually resolved. |
| Great Hall `red_first` | ACT9 after authoritative red activation, before blue activation | Bind to server state, not click intent. |
| Great Hall `blue_first` | Only an authoritative blue-first state | Current canonical ACT9 requires red first, so no reachable trigger is proven. Do not bind or invent a branch. |
| Great Hall `both_open` | ACT9 when `red_activated && blue_activated` | Bind to projected server flags; preserve black door behavior. |
| Four text-bearing replacement props | Existing item inspection surfaces only | Same asset identity; avoid duplicate HTML artifact text only after exact version activation. |

## Required owner decisions

1. GA canonical commit for the 132 single-key and 80 composed-output mappings, with shared-key conflicts resolved rather than bulk replacement.
2. Exact first-audible/repeat Castle Voice keys for ACT6 Anna/Linda versus Gitte.
3. CA audit of ACT3 commit `90afb04`; browser and transaction tests are authored, but this machine lacks an exposed Playwright module and no production SQL execution was authorized.
4. CA/GA decision that the unreachable `blue_first` Great Hall image remains staged supplemental material unless the canonical gameplay state machine changes under a separate Teacher gate.

NEXT_OWNER: GA for protected copy; CA for ACT3/source and visual-contract audit.
