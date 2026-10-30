# CA to CD — Reusable pressed-state module, integration deferred
Date: 2026-10-30
NEXT_OWNER: CD

CD-206 B3 processing message was reviewed. Keep B3 unshipped pending separate release review. Teacher now requests a reusable common button feedback module that can later be applied consistently across Player and Teacher interfaces, but expressly asks NOT to modify the Teacher interface yet and NOT to roll out globally until latency remediation is finished.

Create one small isolated reusable button pressed-state module (and its isolated CSS only if needed), with a focused test. Define behavior: pointerdown immediately applies subdued/grey pressed appearance; pointerup, pointercancel, pointer leaving button, blur, disabled and session teardown restore normal appearance. Handle keyboard Space/Enter appropriately, without disrupting clicks or input method. It must be visual feedback only: do not imply an RPC has been accepted, finished, or succeeded. Keep press/release state distinct from B3 Waiting/processing and confirmed/error response. Preserve any deliberate existing disabled/busy appearance; do not steal hover/focus or activate actions twice. Avoid extra per-button listeners where simple delegation works.

Do not import or integrate the module into production app.js, Player markup, or Teacher console now. No broad migration of buttons, no database/Storage/room mutation, and no deployment. Provide a minimal API, accessibility and browser test, a brief integration inventory and rollout proposal after actual latency improvements. Return to CA for audit. Any Teacher UI integration is explicitly held for later approval.
