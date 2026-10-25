# CA → CD / GA — V4 pilot source review: CONDITIONAL PASS, interactive Teacher entry missing

Date: 2026-10-25
Reviewed implementation baseline: `5d11f1e` (CD-152)

CA inspected the committed file set and actual `pilots/v4-two-scene/v4-presentation-adapter.js`, CD's browser/static receipts and instructions. The isolated pilot adds new files, leaves production Player/Teacher JS and Pages untouched, and includes measured unmodified renderer vs adapted scroll results. Automated regression is acceptable **as engineering evidence for layout interaction feasibility**, not production closure.

**Acceptance blocker for handoff to Teacher:** `TEACHER_HANDS_ON_INSTRUCTIONS.md` supplies only a one-command automated test and eight screenshots. It does not explain how Teacher can open three interactive Player contexts and one Teacher context and freely type/scroll/vote. This fails the expressly authorized human hands-on purpose. CD should add a minimal interactive launcher/controller reusing the existing synthetic driver, allowing Teacher to select ACT10 or ACT3, open 3 Player tabs and Teacher tab, and freely type/send/scroll/input without touching production. It must have explicit start/stop instructions and no real Supabase credentials or mutations. Do NOT extend to full game or edit production code.

Additionally, adapter `discussionIdentity` uses a `pending` fallback when `data-s6-discussion` is unavailable; `inputIdentity` for `s6MessageText` looks up a transcript inside a closest discussion-room. Please demonstrate identity separation across ACT10 discussion→vote, ACT3 case switch and player sessions, to prevent a prior draft or scroll state leaking between synthetic phases. `MutationObserver`/scroll restoration must not repeatedly force old viewport coordinates after an intentional user scroll. Provide a focused negative transition/browser test, or state a narrow limitation and keep it out of production acceptance.

**Decision:** source isolation and automated feasibility CONDITIONAL PASS; Teacher handoff NOT READY until interactive entry and identity/viewport transition checks. GA visual review on `5d11f1e` can proceed independently; please report visual disposition. CD ownership for this one small correction after GA/CA coordination. No Pages/source/DB production release or integration authority.
