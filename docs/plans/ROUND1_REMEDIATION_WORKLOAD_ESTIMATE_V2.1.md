# Round-1 Remediation Workload Estimate V2.1

Date: 2026-10-05  
Purpose: GA/CA reconciled workload estimate after the approved V4 layout change and CA independent review.  
Supersedes: `ROUND1_REMEDIATION_WORKLOAD_ESTIMATE_V2.0.md` for current planning.

## Reconciled workload table

| 工作序号 | 工作名 | V1.0 GA | GA V2.0 | CA V2 review | V2.1 planning value | 对比 V1.0 新增的风险（及理由） |
|---|---|---:|---:|---:|---:|---|
| W01 | Teacher-paced Discussion lifecycle | 3.5 | 3.5 | 3.5 | **3.5/5** | **中** — stable Discussion region increases integration exposure, but authority/pacing work remains separate from visual adapter work. |
| W02 | Responsive Player shell / stable regions | 3 | 4 | 3.5 | **3.5/5** | **高** — shared-shell DOM recomposition, stable mounts, full-width responsive behavior, multiple render paths, and stable selector preservation. Regression risk is closer to 4/5 even though implementation workload is 3.5/5. |
| W03 | GRAB authoritative automatic leave + cinematic | 2.5–3 | 2.5–3 | 3 | **3/5** | **中** — must remain separate from W12 so presentation does not mask incorrect authoritative progression. |
| W04 | Generic Pocket/evidence renderer | 3 | 3.5 | 3.5 | **3.5/5** | **高** — renderer migration into the stable Pocket mount, removal of duplicate story injection, real asset binding, inspect/flip/share/reconnect continuity. W02 owns the empty/stable Pocket slot; W04 owns Pocket content migration. |
| W05 | Canonical Teacher operational-location projection | 2.5–3 | 2.5–3 | 2.5–3 | **2.5–3/5** | **低–中** — backend projection complexity is unchanged, but wrong data becomes more prominent in the redesigned Teacher Live Operations surface. |
| W06 | Teacher Console recomposition + internal views | 2.5 | 3.5 | 3.5 | **3.5/5** | **高** — same-runtime Normal/Emergency/Maintenance views, preserved pre-run setup, token/session/polling continuity, and one-time-bound control lifetime. |
| W07 | Asset publication / ACTIVE / readiness | 2.5 | 0 remaining | 0 remaining | **0/5 remaining implementation** | **低 within W07** — runtime closure is complete; any responsive geometry/anchor regression belongs to renderer/regression work rather than reopening asset publication. |
| W08 | Five-slot Library lock UI | 2 | 2 | 2 | **2/5** | **低–中** — must integrate cleanly into the new Action region across responsive widths without changing server lock/fallback authority. |
| W09 | Preserve client-owned ephemeral UI state | 1.5–2 | 2 | 2 | **2/5** | **中–高** — polling can destroy unsent draft, focus, transcript scroll, selected Pocket detail, expansion state, or Teacher internal-view state if subtrees are replaced. This task should be applied after each relevant stable mount exists, not as one premature global patch. |
| W10 | Central Player identity/runtime header | 1.5 | 1.5 | 1.5 | **1.5/5** | **中** — reconnect/initial-load/stale landing state becomes highly visible in the fixed header. |
| W11 | Low-risk UI/text cleanup | 1 | 1 | 1 | **1/5** | **低** — paired bilingual labels can still create local overflow or text-selector fragility. |
| W12 | Generic 2-second Scene Transition layer | — | 2 | 2.5 | **2.5/5** | **中–高** — needs a cross-runtime presentation scene identity adapter and exactly-once client state machine; must suppress reconnect/initial-load false positives and avoid GRAB/ACT12 cinematic collisions. |
| W13 | Integrated frontend regression + new frozen baseline | — | 3.5 | 3.5 | **3.5/5** | **高** — new root frontend composition invalidates automatic carry-over of old browser-visible acceptance; requires responsive, interaction-state, anchor, navigation, transition and reconnect coverage plus a new frozen SHA. |

## Additional risks accepted from CA review

V2.1 explicitly incorporates five CA additions:

1. **Polling input/focus/scroll loss** — persistent Discussion makes 1.2s rerender damage much more visible.
2. **Teacher event-handler lifetime** — replacing bound controls during internal-view navigation can silently remove listeners.
3. **Cross-RPC snapshot consistency** — Scene, Discussion and Pocket must not render from mutually inconsistent refresh moments.
4. **Reconnect / initial-load false scene transition** — W12 needs a clear first-render suppression rule.
5. **Bilingual local overflow** — panel/button/table overflow must be checked, not only page-level horizontal scrolling.

## Final GA/CA numerical reconciliation

The only V2.0 numerical differences are resolved as:

- W02: **3.5/5 implementation workload**, while keeping **~4/5 frontend regression risk**.
- W12: **2.5/5**.

All other values are materially aligned.

## Boundary note

The workload table is intentionally non-additive. A 3.5/5 regression package does not mean every earlier implementation package should include full integrated regression again. Each package gets a targeted gate; W13 owns the final broad integrated proof.
