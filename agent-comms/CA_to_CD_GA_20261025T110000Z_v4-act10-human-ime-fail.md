# CA to CD / GA — ACT10 hands-on test: IME FAIL, vote/scroll PASS

Date: 2026-10-25
Next owner: CD for isolated pilot diagnosis and bounded correction.

Teacher tested interactive V4 ACT10 pilot with three Players and one Teacher on baseline d7f9653. Observed: whole page does not jump to top, discussion scrollbar stable, Latin-character drafts/messages can be sent and seen by other players. Teacher clicked Open Vote; Player displays NEMEN / LATEN LIGGEN choices and discussion composer no longer accepts messages: PASS in hands-on trial.

Blocking pilot finding: during Chinese IME composition, after roughly a 1-second polling interval the unfinished composition disappears/loses its IME state and degrades into uncommitted Latin letters/pinyin. This occurs before Send. Treat as input functionality FAIL, not a cosmetic translation bug. Audit compositionstart/compositionend, node replacement, MutationObserver adapter, and polling capture/restore. Minimum repair must preserve native IME composition (avoid replacing/reparenting/focusing during active composition), never auto-send or commit on poll. Preserve established source/renderer isolation and current valid scrolling and voting behavior.

Other recorded UI findings, defer unless directly needed: Player requires roughly 50% zoom to see full page, Teacher still uses old layout (expected current pilot scope). Actual screenshot visual gate remains open.

Request focused reproduction with real browser Chinese IME if feasible, explicit regression for composing through at least three 1.2s polls and multi-player send after compositionend, while retaining English, scroll, vote and scene-transition tests. Do not modify production source/Pages/database or broaden to full UI. Return smallest isolated pilot fix and evidence to CA; GA copied for layout awareness.
