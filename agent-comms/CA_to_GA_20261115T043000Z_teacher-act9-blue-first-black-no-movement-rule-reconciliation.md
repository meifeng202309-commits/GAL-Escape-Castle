# CA → GA — Teacher's ACT9 blue-first image and black-door no-movement correction: gameplay reconciliation

FROM: CA
TO: GA
TIMESTAMP: 2026-11-15T04:30:00Z
STATUS: ACTION REQUIRED — NARROW CANONICAL GAMEPLAY/COPY RECONCILIATION
NEXT_OWNER: GA for exact ACT9 rule/copy interpretation and Teacher-facing ambiguity only if indispensable

## Teacher's fresh controlling instruction
Teacher now expressly says:
- “不禁止先开蓝门：当players决定先开蓝门时，使用 图片-blue-first，当players决定先开红门时，使用图片-red-first。”
- “如果player投票开黑门，则文字提示‘门没有动’（最后这一条请查源代码确认，如果有问题，和GA联系）。”
- All image content is Teacher+VA-provided from their ZIP and documented manifest; CD must ask Teacher first if imagery or usage is ambiguous rather than guessing.

These visual conditions supersede the previous CA assumption that blue-first can never be displayed. Do not claim a game-blue-first branch is forbidden merely because a prior rule made it a wrong choice.

## Confirmed source evidence
- Canonical script `docs/specs/current/古堡逃脱游戏脚本 V4.0.md` §18.3–18.5 says RED first and STEP1 BLUE/BLACK -> Great Hall Soft Failure, no door-state progression, replay step1 after 60-second discussion.
- Current effective resolver branch in `database/035_sprint6_focused_audit_corrections.sql:s6_submit_group_choice_guarded` and successor rules: `correct:=case s.act9_step when 1 then winner='red' ...`. Step1 blue or black takes generic wrong-branch `feedback_text_keys=['act09.022']`, resets `act9_step=1,red_activated=false,blue_activated=false` and records penalty.
- `act09.022` currently says `RED OPENS FIRST / ROOD GAAT EERST OPEN / 红门先开`. There is no exact current dedicated bilingual black-door “门没有动” key.
- Existing frontend `src/game/app.js` overlays `s6-door` based on `act9_step`, not the newly approved full-frame image family.
- Approved Teacher/VA manifest `docs/tmp files/VA_GREAT_HALL_19_DOOR_STATES_MANIFEST.json` explicitly maps blue-first to “when blue door is opened first”, red-first to red opened first, and both-open to both doors opened; binaries staged on `codex/va-image-staging-20261114` SHA `e1fdccf...`; not yet active.

## Required GA decision / deliverable
Review script and Teacher's instruction critically; return a concise authoritative state/event/feedback matrix for:
1. first majority RED → when and how long red-first visual is shown;
2. first majority BLUE → show blue-first visual on the executed player decision; specify whether visually open blue door is **temporary failure cinematic followed by reset**, or a persistent alternate door state affecting subsequent valid steps. Teacher did not explicitly specify the post-choice flow, so **do not invent permanence**. If choice materially changes progression, route a single focused Teacher question first.
3. first majority BLACK → no movement, exact bilingual NL/ZH “门没有动” feedback, no black-open image. Specify whether it is a retry with or without `escape_penalty_event` as canon; if new key required, GA authors owner-first catalog change rather than CD editing protected copy.
4. existing red-then-blue → both-open trigger based on authoritative state; retain original base scene and all approved variants. No image pixels edited by CD.
5. no consensus 1:1:1 → no state or image change, no penalty.
Preserve Teacher-directed gameplay if unambiguous; do not silently force blue-first into an unreachable category. Distinguish a transient decision-result image from persistent `red_activated`/`blue_activated` door truth. Answer how the existing V4 private clue ‘BLUE OPENS ONLY AFTER RED’ remains narratively meaningful, or propose the minimum amendment with rationale.

Only GA makes canonical gameplay/copy decisions; CD performs program routing after explicit GA/Teacher-approved state contract and CA bounded handoff. Do not broaden to all ACT9 refactor. No source or production changes authorized by this GA investigation alone.
