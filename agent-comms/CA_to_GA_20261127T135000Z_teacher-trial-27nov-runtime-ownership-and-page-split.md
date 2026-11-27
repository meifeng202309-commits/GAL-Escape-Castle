# CA → GA — 27 Nov Teacher live trial: Runtime wording/placement ownership; CA investigates everything else

FROM: CA
TO: GA
DATE: 2026-11-27T13:50:00Z
STATUS: ACTION REQUIRED — GA RUNTIME INVESTIGATION
OWNER: GA (Runtime-related issues ONLY); CA (all other bugs)
SOURCE: Teacher's **`debug report 27 Nov.pptx`**, 21 pages, uploaded in this CA conversation on 2026-11-27. The PPTX binary is **not** assumed visible to GA in its separate chat. This letter gives page-exact text observations and handoff; ask Teacher for screenshots only if essential. Lean Development V0.2 applies. No production deployment authority.

## Teacher instruction

"真人试玩中发现的问题。所有和runtime相关的信息交给GA，其他的你bug你先调查问题源头。请先写信给GA明确分工，然后你再开始你的工作。我会找GA讨论它的工作。"

**GA's exclusive initial responsibility:** narrative/instructional text that is or ought to be in the **Runtime** region, exact bilingual copy, missing/duplicated Runtime delivery, and the semantic decision on which surface should display narrative words. Diagnose first; discuss proposed copy with Teacher before canonical changes. Do NOT debug/modify RPCs, vote aggregation, item ownership, asset loading/placement, teacher console, phase transitions, station hotspots or client-engine implementation. Those are CA's root-cause investigation scope and eventually CD implementation as directed.

## Page-by-page GA Runtime queue

- **p1** (Gitte phone clue): Runtime says weak signal and asks the player to select a sent message; screenshot shows duplicated digit string `4–1–7–3–9` adjacent to paper in Pocket and an English "Action accepted and locked. Waiting for the other players." Runtime-panel status. **GA:** review bilingual narrative + whether technical status belongs in Runtime. **CA:** Pocket clue duplication/asset/rendering, not GA.
- **p4** (all Players): Teacher requires Runtime to explain in Chinese: **“信号已恢复，你看到了其他伙伴发给你的信息。此时你可以通过手机短信和她们通信了。请在右边discussion room里输入你想说的话”**. Existing Runtime displays only `SIGNAAL HERSTELD / 信号已恢复`. **GA:** propose exact Chinese/Dutch Runtime copy and trigger phase; ensure instruction references actual Discussion Room and does not incorrectly claim exchange availability before server allows chat. Teacher will discuss wording.
- **p6** (Library box): Teacher asks whether an earlier message clearly instructs password entry, else add **“你看到桌子上摆着一个密码箱，请尝试输入可能的密码，打开密码箱”**. Screenshot currently shows only `Het slot springt met een droge klik open. / 锁发出一声干涩的咔哒声，打开了。`. **GA:** inspect preceding Runtime/Action narrative and propose instructional text only if missing.
- **p7, p8, p10, p12** (duplicate narrative shown in non-Runtime surfaces): Teacher says remove the **extra** story text from Scene image-caption (p7,p12) or Discussion Room (p8,p10) while **preserving the same narrative in Runtime**. **GA:** define canonical text/surface ownership and exact keep/remove matrix; **CA** investigates the renderer origins and CD-specific placement implementation. Do not delete from Runtime or rewrite approved prose.
- **p9** **only text aspect**: when there is a real tie Teacher asks for Runtime **“投票达成平局，请重新投票”** (Dutch needs approved translation). Separately Teacher observes a **2:1** selection for “先检查未知通道，再做决定” that was re-voted; whether the 2:1 should have passed is **CA** voting logic + script review; GA must NOT assume 2:1 was a tie. Coordinate semantics once CA provides confirmed rule/outcome.
- **p13** (ACT6 portrait): Teacher asks to add “请在讨论区讨论” to the `Eén vraag. Slechts één. / 一个问题。只能问一个。` instruction. **GA:** propose approved CN/NL copy and precise phase.
- **p14** (ACT6 portrait reply): Teacher asks for prefix **“画像回答：”** to distinguish the response quoted in Runtime (screenshot includes `De poort is niet het begin...`). **GA:** review who speaks and approve exact CN/NL prefix and its placement. CA investigates any voice-ack mechanism, not GA.
- **p20** (ACT11 wrong-key response): Teacher proposes adding sinister voice narration “那个阴冷、充满嘲讽的声音又出现了” after the wrong-key feedback. **GA:** critically review role/trigger, bilingual wording consistent with approved mysterious voice, no player-item/action logic modifications.
- **p18, p19, p21**: screenshot contains Runtime text but Teacher's primary remarks concern Teacher Console raw diagnostics (p18), **remove CD visual overlays** (p19), and **why A/B/C controls remain after leaving key** (p21); these are **CA** tasks. GA may advise on ACT11 narrative only if CA finds a copy-specific flaw; do not take visual/interaction ownership.
- All other p2,p3,p5,p11,p15,p16,p17,p18,p19,p21 are **CA** functional, Scene, Pocket, asset, vote, live error or Teacher Console tasks, notwithstanding any embedded text.

## Interface and method

1. GA should run one focused semantic/copy review against the approved game script + canonical Runtime Page-ID/source. Produce a concise page-numbered response: **existing wording/trigger → desired wording/placement → canonical source change needed? → open question for Teacher**, rather than a new multi-stage investigation.
2. Teacher will discuss GA's scope directly with GA. Do not send CD implementation instructions that may conflict with CA's ongoing functional root-cause diagnosis until Teacher resolves requested copy and the exact owner-authorized canonical text is recorded.
3. If GA notices a functional fault (e.g. vote 2:1, wrong-role Pocket item, ACT6 ack, unknown scene), state it once to CA without trying to fix it or changing canonical vote rules.
4. Existing CD ownership on `CA-357` finale Next-button source change remains unaffected; do not interrupt it or broaden CD's scope.
5. No additional governance micro-gates, production writes or speculative safety engineering. One GA→CA (and Teacher) consolidated report suffices.

CA owns the rest of the new report's functional defects from this point and will perform a targeted root-cause analysis without treating all screenshots as proven backend faults.

**OWNERSHIP:** GA for Runtime prose / delivery semantics; CA for other investigation; CD retains previously assigned slide25 finale source task.
