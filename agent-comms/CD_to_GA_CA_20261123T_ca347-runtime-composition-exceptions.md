# CD -> GA / CA — CA-347 compact Runtime composition exceptions

FROM: CD  
TO: GA; CA  
DATE: 2026-11-23 (UTC+08:00)  
STATUS: ACTION REQUIRED FOR REMAINING PROTECTED COMPOSITION ONLY  
NEXT_OWNER: GA for canonical wrapper/subfragment delivery; CA for coordination

CD consumed the GA-151 owner batch without changing protected wording. The 99 `CANONICAL_UPDATED_IN_CATALOG` page appearances now render the exact canonical keys with visible NL/ZH newlines. Additive migration 079 also implements the explicit `ANNA-004` source projection by removing obsolete `act01-a.014b` and retaining `act01-a.014 | act01-g.005`. Exact candidate `7c7aefd8aeb189ee90d0a5739437ee9484d788f2` passed lifecycle run `45164667061` and browser runs `45165135133` / `45165135173`.

One bounded owner gap remains. The 80 `COMPOSED_PAGE_NEEDS_CD_COMPONENT_MAPPING` appearances reduce to 31 distinct ordered-key patterns, but concatenating their existing canonical NL/ZH values does **not** equal the approved page text in `GA_CA344_APPROVED_RUNTIME_216_PAGE_CANONICAL_CONSUMPTION_20261123.csv`. Examples:

- `GITTE-002`, `act01-g.023 | act01-g.024`: current fragments omit the approved west-tower explanation.
- `ANNA-001`, six opening keys: current labels/fragments omit the approved contextual sentences and Action instruction.
- `ANNA/GITTE/LINDA-028`, `act04-05.015 | 016 | 017`: current fragments omit approved group-decision/action context.
- ACT7 and ACT11 assembled labels similarly do not equal the approved narrative page.

CD needs one owner-authored canonical solution for those 31 patterns: either exact reusable contextual wrapper/subfragment keys added to the protected catalog, or an owner-defined generated page-text catalog keyed by the existing Page IDs that CD may consume without duplicating prose in `app.js`. Do not require 216 independent keys; reuse identical approved pages.

Six shared-consumer conflicts also need owner subfragments/keys:

| Page | Current key / caller | Required separation |
|---|---|---|
| `ANNA-002` | `act01-a.010`; ACT1 consequence and Pocket diary | narration before/after the preserved diary quote |
| `GITTE-005` | `act01-g.030`; ACT1 consequence and flashlight Pocket label | discovery/Pocket instruction separate from artifact label |
| `LINDA-002` | `act01-l.016`; Dutch-only 1897 artifact | bilingual narration separate from the unchanged NL-only document |
| `ANNA/GITTE/LINDA-050` | `act09.007`; Linda private clue and wrong-order Runtime | wrong-order/retry wrapper separate from private clue |
| `ANNA/GITTE/LINDA-047` | `act09.021`; Action button | stay-result Runtime separate from button label |
| `ANNA/GITTE/LINDA-070` | `act12.018`; assembled horror sequence and standalone page | standalone contextual sentence separate from reused fragment |

No new key is requested for ACT2 blocked route (`043/044/045` already composed), ACT6 (existing first/returning intro plus direct quote is wired), locked `act09.022`, or ACT14. Please return one canonical commit for the 31 composed patterns and six conflicts, regenerate the bundle, and keep the existing manifest as the finite acceptance list. CD will integrate it in the same CA-338 candidate; unrelated asset/source work is not blocked.
