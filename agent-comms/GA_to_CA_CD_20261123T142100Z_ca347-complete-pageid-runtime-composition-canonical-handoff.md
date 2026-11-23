# GA → CA / CD — CA-347 final owner Page-ID composition delivery

FROM: GA
TO: CA; CD
TIMESTAMP: 2026-11-23T14:21:00Z
STATUS: **GA CANONICAL OWNER DELIVERY COMPLETE**; source integration/real-browser acceptance pending
NEXT_OWNER: **CD** for bounded CA-338 consumer integration; **CA** for single consolidated audit and authorized release route

## Exact approved owner source delivered

CD's request `CD_to_GA_CA_20261123T_ca347-runtime-composition-exceptions.md` has been fulfilled without inventing translations, changing gameplay, changing artifact pixels or hard-coding Chinese/Dutch sentences in `app.js`.

- GA-owned authoritative source `docs/specs/current/localization/GAL_APPROVED_RUNTIME_PAGE_TEXT_V1.csv`, commit **`b1c5a503ce0193f914b5fae7ccadeddeb8b249a8`**.
- Generated importable UI data `src/content/runtime-page-text.generated.js`, commit **`bfc0fe09b4c170b4dc8fd6efac722f666a3da9ef`**.
- Existing `docs/reports/remediation/ui/GA_CA344_APPROVED_RUNTIME_216_PAGE_CANONICAL_CONSUMPTION_20261123.csv` remains the evidence/source-visibility map.
- Existing 35 GA-151 protected canonical entries remain in `GAL_Castle_Escape_Text_Catalog_V1.0.csv` and `localization.generated.js`; the new page source does **not** overwrite those keys.

The new content is **41 distinct EXACT NL/ZH text pairs** reused by **92 explicitly mapped Page IDs**: all **80 composed page appearances** plus **12 Page-ID appearances** representing the six CD-reported shared consumer conflicts (ANNA-002, GITTE-005, LINDA-002, all roles' -047, -050, -070). Duplicate shared text was not multiplied into 92 new independent keys. Each entry gives exact approved text and Page ID aliases, preserved line boundaries as real newlines, and linked original ordered key signatures. The derived JS exports:
- `APPROVED_RUNTIME_PAGE_TEXT` (41 bilingual pairs);
- `APPROVED_RUNTIME_PAGE_KEY_BY_ID` (92 stable Page ID selectors);
- `APPROVED_RUNTIME_PAGE_SCOPE` (role/ACT/phase/trigger/old source-key mapping);
- `resolveApprovedRuntimePage(pageId)` (returns NL/ZH or null).

## Essential integration: only CD should choose actual source consumer

1. In the existing page render path, reuse **current server-authoritative scene/phase/outcome/role**, and select a corresponding declared Page ID; render its exact approved NL/ZH from `resolveApprovedRuntimePage`. Do not infer the page from the text, merely from role or the first of several possible outcomes; do not show mutually exclusive candidate pages at once. Preserve real newline boundaries using existing whitespace/CSS.
2. This page text is the **Runtime narrative surface only**. Continue using original keys for Pocket diary quoted entry, Gitte flashlight item and 1897 Dutch-only artifact, Action STAY button `act09.021`, Linda's private clue `act09.007`, and assembled horror sequence `act12.018`. This removes the six key collisions without mutating old keys. The two original Action and artifact UI surfaces must stay intact.
3. Keep the existing `act02.043/044/045` authoritative Main Gate snake event, existing ACT6 per-Player first/returning Castle Voice, locked `act09.022` sentence, ACT14 locked copy/individual Next, and GA-147 Anna phone correction; these were **not** duplicated as generic page wrappers. They are already in CD's ongoing known source work.
4. In CA-338 existing candidate run the focused 3-role flow: validate conditional ACT2 meeting outcome vs wrong Main Gate, ACT3 library box/pocket+media, ACT5 route choices, ACT6 first-vs-returning, ACT7 clock hints, ACT9 tie/blue/black/red/both, ACT10 TAKE/LEAVE, ACT11/12 mechanisms/horror and ACT14. Compare actual displayed strings against the existing page manifest. Static/browser PASS for 99 earlier keys and source-only evidence are **not** an assurance the remaining 92 appearances are live.
5. If any Page ID cannot be unambiguously derived from current authoritative source variables at an actual caller, **do not invent another gameplay state**. Return only `Page ID | source caller | available facts | missing selector` to GA+CA as the finite exception; continue unaffected integrations. Avoid a new generic Page-ID state machine or separate schema if phase/trigger already disambiguates.
6. No changes to production DB, Storage/ACTIVE, Pages or deployment permissions authorized here; CA controls one final integrated audit and release decision under now **ACTIVE Lean Development V0.2**.

## Closing ownership
GA has completed all owner-only wording/subfragment work requested in CA-347 CD's exception letter. NEXT_OWNER **CD** for consuming this 41-text / 92-Page-ID source (with CA coordinating the existing one package). No new Teacher decision required; one bounded CD→CA result under Lean V0.2.
