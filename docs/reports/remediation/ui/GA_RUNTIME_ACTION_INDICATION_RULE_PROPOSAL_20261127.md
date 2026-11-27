# GA — Runtime 明确下一步行动指引规则（讨论稿，27 Nov 2026）

Status: **Teacher review / proposed game-design rule; NOT yet canonical or deployed.**
Source: Teacher's live-trial `debug report 27 Nov.pptx`, especially slides 4, 6, 9, 13, 14, 20. CA split letter: `agent-comms/CA_to_GA_20261127T135000Z_teacher-trial-27nov-runtime-ownership-and-page-split.md`.

## Principle

**任何显示在 Runtime 的非纯过场文本，如果玩家此时需要操作、阅读/比较线索、在 Discussion 讨论、参与投票或等待，都必须明确告知“现在发生了什么 → 下一步做什么 → 在哪里做／等什么”。**

Use a concise actionable sentence after an atmospheric narrative or character's spoken line. Preserve mystery and puzzle-solving: state **what** students should do without revealing the correct answer. Do not write instructions in Scene image captions, duplicate them in Discussion Room, or put an Action control inside Runtime. Runtime describes actions; Action hosts clickable controls; Discussion hosts discussion/messages/votes; Scene displays artwork.

### Minimum test per message

1. **Action clarity:** Can a first-time Player identify whether they must click a live Action control, type in a field, speak in Discussion Room, vote, inspect Pocket, or simply wait?
2. **Surface consistency:** Does the named panel or button actually exist **at this authoritative state**? Do not say "click Continue", "send SMS" or "vote now" if unavailable. If the server automatically advances, say "请等待游戏显示下一步" only when appropriate.
3. **Trigger correctness:** No announcement before its actual trigger (e.g. restored signal and already-received messages only after those events; box entry before unlock; portrait response after voice introduction acknowledgement; tie text only after real tie, never 2:1).
4. **Role/knowledge isolation:** Don't expose another character's private clue; distinguish Gitte's prior audible dream voice from Anna/Linda's first ACT6 Castle Voice and distinguish audible speech from UNKNOWN SENDER SMS.
5. **Bilingual/voice:** NL and ZH give the same actionable meaning and separate visual lines. Preserve spoken quotations; put narrator/UI instruction **outside** dialogue, with the speaker labeled (e.g. `画像回答：`).
6. **Exception:** A cinematic beat, short dramatic sound cue, countdown (5..1), or locked ACT14 finale may appropriately contain **no** instruction when no Player input is available. Do not interrupt them with a bogus button suggestion. A persistent waiting state, however, should tell players what is pending when otherwise ambiguous.

### 21-slide handoff split

- GA: slides **1 (Runtime status wording only), 4, 6, 7, 8, 9 (only true tie instruction), 10, 12, 13, 14, 20**. Check 216 canonical role pages + actual separate live Runtime messages and propose bilingual action guidance.
- CA: slide 2/3 private Pocket cross-role leakage; 5 premature Library image; 9 majority 2:1 revote functional correctness; 11 query timeout; 15 ACT6 voice-ack block; 16/17/19 image overlays; 18 Teacher state; 21 ACT11 keys/ABC controls. GA will not alter vote SQL, client renderers, VA graphics or station logic.
- Scene/Discussion duplicates on slides 7/8/10/12: retain the approved Runtime wording; only remove non-Runtime duplicated copy.

### Proposed copy review artifact

`docs/reports/remediation/ui/GA_RUNTIME_ACTION_INDICATION_AUDIT_20261127.csv` — 222 entries comprising 216 previously approved Player page appearances plus six additional observed live Runtime events, with Page ID, role, ACT, slide, existing CN/NL, status, proposed CN/NL, and implementation constraint. These drafts are **not automatic approval for canonical replacement**: the Teacher should review style and specific messages first, and CD must verify caller/button availability. Many are already correct; the CSV identifies and exempts cinematic/finale lines.

### No implicit gameplay change

The proposed wording must not change ACT5 vote aggregation, ACT6 acknowledgement gating, ACT9 red-first retry, ACT10 take/leave branch or ACT11 A/B/C/WATCHER semantics. Existing approved keys and screenshots show some gaps are in actual trigger/rendering rather than the prose; CA owns those root-cause investigations. 
