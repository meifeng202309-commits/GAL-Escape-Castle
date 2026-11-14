# GA Runtime Copy Review — 14 Nov 2026 (Draft for Teacher approval)

Status: WORDING PROPOSALS ONLY — NOT CANONICAL / NOT IMPLEMENTED
Evidence: `TEACHER_TRIAL_20261113_PLAYER_RUNTIME_TEXT_EVIDENCE.csv` (86 machine-extracted rows, ACT1–14), V4 script, current localization catalog.
Review method: actual NL/ZH output + role/phase/trigger/source, with player-naive clarity review.
Boundary: do not expose private role clues; do not rewrite deliberately cryptic puzzle clues into answers; keep the 1897 closure notice Dutch-only at runtime; do not alter game logic, Action authority, phase triggers or timing.

## 1. Executive disposition

- **Keep most text unchanged.** The evidence shows that many lines are already concise, comprehensible and intentionally cryptic.
- **Propose a small number of targeted wording improvements**, primarily ACT1 opening phrasing, ACT7 clock instructions, ACT9 clue precision, ACT10 golden-key references, and ACT12/13 narrative fluency.
- **Do not treat presentation defects as copy edits:** ACT1 Linda repeats 23:49; ACT5 includes an Action button label in Runtime; ACT12/13 repeat the final SIGNAL RESTORED key as part of the escape sequence. These require projection/region/order review, not rewriting the wording.
- **Teacher approval is required for every proposed canonical wording change.** Until approved, the catalog and runtime remain untouched.

## 2. Proposed exact wording changes

### ACT1 — opening and private discoveries

| Key / role | Current Dutch | Proposed Dutch | Current Chinese | Proposed Chinese | Reason |
|---|---|---|---|---|---|
| `act01-g.001` Gitte | Een lage, kleverige, nat klinkende stem blijft fluisteren: | **Een lage, slijmerige stem blijft fluisteren:** | 一个低沉、黏糊、湿漉漉的声音在反复低语： | **一个低沉、黏腻的声音不断低语：** | Current Dutch adjective chain is awkward; retain unsettling tone without literal sensory pile-up. |
| `act01-a.001` Anna | Je wordt wakker terwijl je op de koude vloer zit. | **Je komt bij terwijl je op de koude vloer zit.** | 你醒来时正坐在冰冷的地板上。 | **你在冰冷的地板上醒来。** | More natural, concise Dutch and Chinese. |

Keep all other ACT1 copy unchanged in this pass, including Gitte's Snake King warning, the number sequence, Anna's diary clue, Linda's silver-key failure and mirror warning. The municipal closure notice remains a Dutch-only 1897 artifact; its Chinese catalog field is for review only and must not be rendered to Players.

**Source/presentation issue, not copy change:** Linda's ACT1 Runtime sequence contains `act01-l.002` = `TIJD — 23:49` and `act01-l.004` = `23:49`. Confirm whether the second is an intentional separate watch-face detail or a duplicate Runtime line. Do not delete either until its visual role is established.

### ACT2 — route update

| Key | Current Dutch | Proposed Dutch | Current Chinese | Proposed Chinese | Reason |
|---|---|---|---|---|---|
| `act02.033` | Verander nu van route. | **Pas nu jullie route aan.** | 现在改变路线。 | **现在调整你们的路线。** | More natural classroom instruction and explicitly addresses the group. |

Keep the destination-specific route names and consequences unchanged.

### ACT3–ACT6 — preserve puzzle progression and intentional ambiguity

- ACT3 `act03.008` and hint stages 1–8: **no wording change proposed**. The hints escalate progressively; stage 1 is deliberately non-informative, later stages narrow the solution. Do not collapse them into a direct answer. Stage 1–3 provenance remains flagged as inherited fallback logic.
- ACT4 `act04-05.002`: **no wording change**. “Deze deur staat niet op de kasteelkaart” is clear.
- ACT5 `act04-05.009`, `.015–.022`: **no wording change** in this pass. The inspection and route outcomes are understandable.
- ACT5 `act04-05.023`: the text `[GA DE PORTRETTENGALERIJ IN]` is an executable button label currently included in the Runtime sequence. Keep its wording, but render it only in **Action**, not Runtime. This is a region-ownership fix, not localization rewrite.
- ACT6 `act06.006–.010`: **no wording change**. The portrait messages are intentionally enigmatic clues; simplifying them risks revealing too much.

### ACT7 — make the three clock descriptions explicitly refer to clocks

| Key | Current Dutch | Proposed Dutch | Current Chinese | Proposed Chinese |
|---|---|---|---|---|
| `act07.002` | EEN TOONT HET NU. | **EÉN KLOK GEEFT DE HUIDIGE TIJD AAN.** | 一只显示现在。 | **有一只钟显示当前时间。** |
| `act07.003` | EEN LOOPT ACHTERUIT. | **EÉN KLOK LOOPT ACHTERUIT.** | 一只倒着走。 | **有一只钟在倒着走。** |
| `act07.004` | EEN HERINNERT ZICH WANNEER HET HORLOGE STOPTE. | **EÉN KLOK HERINNERT ZICH WANNEER HET ZAKHORLOGE STILVIEL.** | 一只记得怀表停止的时刻。 | **有一只钟记得怀表停走的时刻。** |
| `act07.005` | RAAK DEGENE AAN DIE HET ZICH HERINNERT. | **RAAK DE KLOK AAN DIE HET ZICH HERINNERT.** | 触碰那只记得的钟。 | **触碰那只记得这件事的钟。** |

Reason: the current Dutch drops the noun “clock” in each line, and `EEN` may read as a pronoun/article without a clear antecedent. The proposed copy names the object while preserving the riddle: it does not tell players which of the three clocks is correct.

Keep `act07.006–.007` item labels unchanged for now; they are inventory headings rather than narrative sentences.

### ACT8–ACT9 — retain sequence, clarify only the generic door clue

- ACT8 route-specific text `act08.005–.007` and `.010–.011`: **no wording change**; the route consequences are concise.
- ACT9 private role clues remain strictly private to Gitte/Anna/Linda. Do not combine or broadcast them in shared Runtime.
- `act09.004` currently: `EEN DEUR KAN WORDEN GEACTIVEERD ZONDER ERIN TE GAAN.` Proposed: **`JE KUNT EEN DEUR ACTIVEREN ZONDER ERDOORHEEN TE GAAN.`** Chinese: **`你可以启动一扇门，而不必从门中通过。`** This clarifies the distinction between activating a door and entering it.
- `act09.005–.007` remain unchanged; the RED-first / BLUE-after-RED order and “first door is unsafe” are clear.
- All ACT9 result, wrong-step and no-consensus messages remain unchanged. Preserve the four sequential decisions and current state-machine semantics.

### ACT10 — identify the golden key explicitly in private advice

| Key / role | Current Dutch | Proposed Dutch | Current Chinese | Proposed Chinese |
|---|---|---|---|---|
| `act10.001` Gitte | Neem hem. Zonder deze sleutel heb je meer tijd nodig om de Hoofdpoort te openen. | **Neem de gouden sleutel mee. Zonder deze sleutel kost het meer tijd om de Hoofdpoort te openen.** | 拿上它。没有它，你们打开主门会需要更多时间。 | **带上这把金钥匙。没有它，你们需要花更多时间才能打开主门。** |
| `act10.002` Anna | Neem hem niet. Het alarm zal afgaan en ze zullen sneller hier zijn. | **Neem de gouden sleutel niet mee. Het alarm zal afgaan en ze zullen sneller hier zijn.** | 别拿。警报会响，他们会更快赶到这里。 | **不要带走金钥匙。警报会响，他们会更快赶到这里。** |
| `act10.003` Linda | De poort kan ook zonder deze sleutel open. Waarom zou je hem nemen? | **Je kunt de Hoofdpoort ook zonder deze sleutel openen. Waarom zou je de sleutel dan meenemen?** | 没有它也能打开大门。何必拿呢？ | **没有这把钥匙也能打开主门。那为什么还要带走它？** |

Reason: replace ambiguous pronouns with “the golden key” / “this key”. Keep each line private to its existing role; do not merge the conflicting advice or expose one player's clue to another.

### ACT11–ACT13 — narrative fluency; preserve suspense and countdown

- ACT11 `act11.001–.004`: **no wording change**. A/B/C station labels are concise and should remain consistent with the Action controls.
- ACT12 `act12.016`: current Dutch `Niets wordt beter. Weglopen is geen optie meer. Je doet wat je kunt.`; proposed **`Het wordt er niet beter op. Weggaan is geen optie meer. Je doet wat je kunt.`** Chinese proposed **`情况没有好转。离开已经不再是选项。你只能尽力而为。`**. More idiomatic while preserving the pressured tone.
- ACT12 `act12.017`: current Dutch `Uit elke gang komt het natte schuren van iets dat over steen beweegt.`; proposed **`Uit elke gang klinkt het natte schrapen van iets dat over de stenen beweegt.`** Chinese proposed **`每条走廊都传来某种东西在石地上爬行时湿黏的刮擦声。`**
- ACT12 `act12.018`: proposed Dutch **`Het komt dichterbij. Uit alle richtingen.`** Chinese **`它越来越近，从四面八方逼近。`**; current fragment is atmospheric but its subject is unclear in isolation.
- ACT12 `act12.019–.027`: no wording changes proposed. Keep conditional `act12.020` only on the existing TAKE branch; retain numeric countdown and escape-success headline.
- ACT13 `act13.001–.003`: proposed Dutch for `act13.002`: **`Jullie rennen met z'n drieën door de poort.`** Chinese: **`你们三人一起冲过大门。`** This makes “through it” explicit. Keep gate-opening and midnight lines unchanged.
- The effective final array also contains `act02.024` = `SIGNAAL HERSTELD / 信号已恢复`. Keep it after `TIJD — 00:00`; do not remove as a duplicate without verifying the intended signal-restoration beat.

### ACT14 — locked ending; no wording change

Keep `act14.001–.005` exactly as currently approved:
- `Missie voltooid.`
- `Jullie zijn ontsnapt.`
- `Maar het kasteel herinnerde zich alles wat jullie deden.`
- `ZIJ weten wie jullie zijn.`
- `Einde`

Preserve the hard-lock emphasis: the full third sentence bold, and only `ZIJ` uppercase in the fourth sentence. Each Player's local Next advances their own reading; it must not bypass authoritative finalization.

## 3. Issues to route as presentation/data behavior, not text edits

1. **ACT1 Linda timestamp duplication:** establish whether `23:49` is intentionally shown both as scene time and watch face; remove a duplicate output only if it is not a distinct visual clue.
2. **ACT5 Action leakage:** `act04-05.023` remains a valid button label but must not be part of Runtime narration; move rendering to Action under existing control authority.
3. **ACT12/13 final feedback composition:** keep `act02.024` only at the intended signal-restored beat and avoid accidental repeated rendering across polling/ACT boundary.
4. **ACT4 Linda Scene comparison:** remains a Scene visual/comparison, not Runtime text.
5. **ACT9/10 private clues:** enforce current role visibility; this review does not authorize any shared copy aggregation.

## 4. Approval request

Please review the bold proposed NL/ZH replacements in sections 2. Approve or amend exact wording before GA writes a canonical localization change. The unmarked text is recommended to remain unchanged. Once approved, GA will commit only the approved catalog rows (using the existing protected localization workflow and generator), then hand the canonical text commit to CD for narrowly scoped implementation and focused browser regression.

No canonical catalog, generated localization, runtime code, database, production data or deployment was changed in this draft.
