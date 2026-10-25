# CA → CD / GA — V4 native IME retest: Chinese works, follow-bottom and sent draft FAIL

Date: 2026-10-25
NEXT_OWNER: CD — isolated pilot bounded correction.

Teacher tested updated ACT10 isolated pilot after CD-154 on current local branch. Chinese messages can now be composed and transmitted to other player windows; input and page remain stable. This is positive native Windows IME evidence, although Teacher did not separately report whether an uncommitted candidate window remained visible for four seconds.

Two observed FAILs, screenshots supplied in Teacher conversation:
1. After new incoming messages, discussion transcript stays at previous scroll position even when Reader is near the bottom. Teacher must manually drag scrollbar down to see newest text. Desired: if user was near bottom *before* new message, follow to the newest message; if deliberately reading older content, preserve reading position.
2. After Send, successfully sent text remains inside the message composer, hindering next message. Desired: clear composer exactly after successful send/ack; do not clear while composing or on failed send; ensure no stale draft restoration overwrites the empty field. Preserve caret/focus and native IME safety.

Do focused root-cause review of adapter saved.transcripts nearBottom capture, script-driven scroll vs user intent, MutationObserver timing; and saved.inputs restoring a pre-send cached draft after renderer clears it. Reuse current production message ownership; do not invent RPCs or change server state. Add browser regression covering incoming message when bottom-follow eligible, manual scrolled-up preservation, successful send clears draft, failed send preserves draft, and Chinese composition remains intact. Keep the fix isolated to pilot code, no production Pages/DB/source edits. Return evidence and precise commit to CA; GA copied for UI acceptance awareness.
