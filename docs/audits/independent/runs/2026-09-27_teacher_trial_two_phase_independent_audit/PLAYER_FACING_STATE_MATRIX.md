# Player-Facing State Completeness Matrix Audit

## Audit identity

- Owner: CA
- Trigger: Teacher approval after CA/GA completeness discussion
- Framework: existing CA Methods1–9 only; no new Trial-Agent method
- Frozen product baseline: `93bd15ca36dd985685a0706bad9ec56ba4002a6e`
- Current-main delta check: **no product/runtime/database/source changes** since frozen baseline
- Objective: exhaustively inspect normal reachable player-visible states from room join through ACT14 and ask whether the player:
  1. knows what action is expected;
  2. knows when/why to wait;
  3. receives visible acknowledgement after successful action;
  4. sees coherent current state after reconnect/poll;
  5. receives the canonical evidence/media needed to understand the decision;
  6. is not exposed to stale/legacy/conflicting state.

Legend:

- **PASS** = source-level player-facing contract is clear enough.
- **FINDING** = deterministic source-level incompleteness.
- **COVERED** = already in CA-135/CA-136; matrix confirms it.
- **NOT VERIFIED** = source cannot establish rendered/browser/perceptual result.
- **AUTO** = intentionally self-advancing cinematic state; no user action expected.

---

## A. Pre-run / formal startup

| State | Player should understand | Current rendered behavior | Ack / wait clarity | Reconnect | Verdict |
|---|---|---|---|---|---|
| Joined, no formal run yet | Wait for Teacher / other players | Root renders legacy Sprint1 Scene1 choices | wrong gameplay surface | same wrong surface | **COVERED IDA-001/002** |
| Formal run created, Sprint3B not initialized | Formal game is starting / recoverable startup | root enters formal branch but `s3bState.scene` absent → error surface | explicit error, but invalid intermediate state exists | same until init | **COVERED IDA-003** |
| Teacher live "Run started" but no active run | active run should be authoritative | live PPT contradicted static contract | incoherent | unknown | **COVERED IDA-004 / root cause NOT VERIFIED** |

---

## B. ACT1 — Wake Up

| State | Expected next action / wait | Current player UI | Media/evidence | Reconnect | Verdict |
|---|---|---|---|---|---|
| ACT1 opening | Read role-specific opening, Continue | opening text + Continue | role-specific opening asset / placeholder | reconstructed | **PASS** |
| ACT1 private first action | choose one role-specific option | role-specific buttons | formal server role validation | reconstructed | **PASS** |
| ACT1 local consequence | read consequence, Continue | consequence text + Continue | role-specific text | reconstructed | **PASS** |
| Own ACT1 complete, peers incomplete | wait for others | `Waiting for the others...` | no peer choices disclosed | reconstructed | **PASS** |

Observation: the renderer does not show the full per-player ready/waiting list described in the canonical script, but the required waiting condition itself is clear; no separate finding opened.

---

## C. ACT2 — First Contact / Meeting

| State | Expected next | Current player UI | Ack / wait clarity | Evidence/Pocket | Verdict |
|---|---|---|---|---|---|
| first-meeting choice not submitted | choose one emergency message | choice buttons | clear | **Pocket not rendered** | **PASS actionability; PFC-005 evidence access defect applies** |
| choice locked, GRAB incomplete | GRAB | GRAB button | clear next action | no Pocket UI yet | **PASS actionability** |
| GRAB complete, not left room | LEAVE | LEAVE button | clear next action | server pocket initialized, client still has no Pocket UI | **PASS actionability; PFC-005** |
| own LEAVE complete, peers incomplete | wait for remaining players | action area becomes empty; scene still says SIGNAL UNSTABLE | **no accepted/waiting message** | Pocket absent | **FINDING PFC-002** |
| all left → meeting discussion | discuss / message | DiscussionRoom, transcript, countdown | clear | Pocket/memories not rendered despite canonical discussion needing evidence sharing | **FINDING PFC-005** |
| discussion timer active | discuss; vote later | countdown + "voting after discussion" | clear | Pocket absent | **PASS mechanics / PFC-005 evidence access** |
| voting, own vote not submitted | choose final meeting point | vote buttons + submitted progress | clear | Pocket absent | **PASS mechanics / PFC-005 evidence access** |
| own final vote locked | wait for remaining votes | vote locked + n/3 submitted | clear | Pocket absent | **PASS** |
| waiting_for_missing_player | wait | explicit `WAITING FOR MISSING PLAYER` + received count | clear | — | **PASS** |
| route update, own ack pending | Continue | route update text + Continue | clear | — | **PASS** |
| own route-update ack complete, peers incomplete | wait for other acknowledgements | Continue disappears; same route text remains | **no ack/wait state** | — | **FINDING PFC-002** |
| route consequence | Continue / fold back | cinematic consequence + Continue | clear | — | **PASS** |

---

## D. ACT3 — Library

| State | Expected next | Current player UI | Ack / wait clarity | Evidence/Pocket | Verdict |
|---|---|---|---|---|---|
| wayfinding, own location not Library | Follow Sign | FOLLOW SIGN button | clear | Pocket absent | **PASS actionability / PFC-005** |
| own Follow Sign done, peers not yet at Library | wait for others | button disappears; same plaque text remains | **no accepted/waiting message** | Pocket absent | **FINDING PFC-002** |
| all reunited, Library Box open | inspect evidence and enter code | 5-digit form + hints | action clear | **canonical Pocket/Group Items not rendered** | **FINDING PFC-005** |
| wrong code attempt | retry using clue/hint | form remains; hint stage updates | visible response exists | Pocket/Number Note cannot be reopened through root UI | **PFC-005 materially affects puzzle evidence** |
| puzzle resolved | proceed to ACT4 | server immediately moves ACT4 | no stale puzzle state | — | **PASS transition** |

### PFC-005 impact at ACT3

This is not cosmetic. Canonical progression-critical Number Note is intentionally a carried Pocket object whose internal information may be inspected later. A player who did not memorize/read the code during ACT1 is supposed to be able to reopen the Note later. Current ACT1–5 client never renders Pocket, so that recovery path is missing.

System fallback hints can eventually resolve the puzzle, but that does not restore the intended player evidence path.

---

## E. ACT4 — Known Route vs Unknown Passage

| State | Expected next | Current player UI | Ack / wait clarity | Evidence/media | Verdict |
|---|---|---|---|---|---|
| private route choice not submitted | compare Known Route and Unknown Passage evidence, then choose | route-choice buttons + shared Library base image | action visible | **required map crop / route highlight / hidden-door outline / ★ overlay absent; Pocket absent** | **FINDING PFC-006 + PFC-005** |
| own ACT4 choice locked, peers incomplete | wait for other private choices | buttons disappear; no replacement message | **no lock/wait acknowledgement** | same incomplete evidence surface | **FINDING PFC-002** |
| all ACT4 choices submitted | simultaneously Reveal three initial choices before direct route/discussion | server projects `act4_revealed`; client never references it | **required Reveal not shown** | — | **FINDING PFC-007** |

### PFC-006 deterministic visual evidence

Canonical ACT4 requires a web-composed comparison:
- LEFT: Castle Map crop + `Library → Main Hall → Portrait Hall` highlight;
- RIGHT: Library door crop + `★` + `NOT SHOWN ON MAP`;
- Linda-only ★/Silver-Key recognition;
- `library_unknown_door` anchor drives the door overlay.

Current `app.js`:
- never references `library_unknown_door`;
- does not render the map/door composite;
- does not render the route highlight;
- shows only `shared.library` plus generic route buttons.

This is source-level confirmed even if final assets are ACTIVE.

---

## F. ACT5 — Route Discussion / Inspect First / Handoff

| State | Expected next | Current player UI | Ack / wait clarity | Evidence | Verdict |
|---|---|---|---|---|---|
| disagreement discussion open | discuss revealed initial positions | DiscussionRoom visible | countdown clear | **ACT4 initial-choice Reveal missing** | **FINDING PFC-007** |
| voting, not submitted | final route vote | vote options + progress | clear | — | **PASS mechanics** |
| own route vote locked | wait | vote locked + progress | clear | — | **PASS** |
| Inspect First selected | inspect passage, then Known/Unknown game-only vote | inspect text + Known/Unknown buttons | clear | — | **PASS** |
| own post-inspection vote locked | wait | vote locked + n/3 | clear | — | **PASS** |
| final route resolved | show Known/Unknown route consequence, then `[ENTER PORTRAIT HALL]` | server sets terminal scene, but deferred same-transaction Sprint5 initialization overwrites scene to ACT6 before next client refresh | **route payoff / explicit transition not player-visible** | canonical transition text/button skipped | **FINDING PFC-008** |

### PFC-008 deterministic handoff trace

```text
ACT5 resolution
→ s3b_run_state.terminal_state = SPRINT3B_COMPLETE
→ s3b_set_scene(act5_route_resolved / terminal)
→ deferred trigger act6_13_deferred_cross_sprint
→ s5_ensure_initialized
→ s5_set_scene(act6_portrait / act6_vote)
→ transaction commits
→ player refresh
→ sprint5State.active = true
→ renderSprint5(ACT6)
```

Because the client does not observe the transient terminal scene before the deferred trigger replaces it, the V4.0 route-consequence text and explicit `ENTER PORTRAIT HALL` player transition are skipped.

---

## G. ACT6 — Portrait Hall

| State | Expected next | Current player UI | Ack / wait clarity | Media | Verdict |
|---|---|---|---|---|---|
| discussion phase | discuss one allowed question | DiscussionRoom + countdown | clear | portrait base/placeholder | **PASS mechanics** |
| voting open, own vote absent | choose question | vote options + progress | clear | portrait | **PASS** |
| own vote locked | wait | lock + n/3 | clear | portrait | **PASS** |
| answer shown | follow map to Clock Room | answer + explicit button | clear | map route evidence shown | **PASS** |

Media note:
- ACTIVE Portrait base uses `portrait_main_face` anchor and eye overlay.
- placeholder base causes the hydration function to return before eye-overlay placement.
- whether omission of the eye-open effect is acceptable for a temporary trial is **NOT VERIFIED semantic completeness**, not opened as a progression blocker.

---

## H. ACT7 — Clock Room

| State | Expected next | Current player UI | Ack / wait clarity | Media | Verdict |
|---|---|---|---|---|---|
| discussion phase | discuss evidence | DiscussionRoom + countdown | clear | clock scene/evidence panel | **PASS mechanics** |
| vote open | select Clock A/B/C | localized vote buttons | clear | clocks shown | **PASS** |
| own vote locked | wait | lock + n/3 | clear | — | **PASS** |
| wrong majority / retry | use feedback, discuss/revote | wrong-attempt feedback + new discussion | clear | — | **PASS** |
| correct Clock C | Check Map | solved text + explicit button | clear | scene remains | **PASS** |

Placeholder risk:
- if `shared.clock_room` is NO_ACTIVE, placeholder is applied and hydration returns before A/B/C anchor coordinates are applied.
- absolute-positioned clocks therefore have no runtime anchor geometry in placeholder mode.
- actual overlap/readability is **NOT VERIFIED** until rendered-browser evidence exists.

---

## I. ACT8 — Main Gate vs West Tower

| State | Expected next | Current player UI | Ack / wait clarity | Evidence | Verdict |
|---|---|---|---|---|---|
| private route choice open | compare evidence and choose | map/photo evidence + choices | clear | Pocket/evidence panel available from Sprint5 | **PASS** |
| own private choice locked, peers incomplete | wait for other private choices | only `Your vote is locked.` | **ack exists, but no explicit waiting condition/progress** | evidence remains | **FINDING PFC-002 expanded to ACT8** |
| final discussion needed | discuss | DiscussionRoom + countdown | clear | initial private choices included in DiscussionRoom | **PASS** |
| final vote open | Main Gate / West Tower | vote buttons + progress | clear | — | **PASS** |
| own final vote locked | wait | lock + progress | clear | — | **PASS** |
| route payoff | Continue along chosen route | route text + explicit button | clear | branch image/placeholder | **PASS** |

---

## J. ACT9 — Great Hall

| State | Expected next | Current player UI | Ack / wait clarity | Media | Verdict |
|---|---|---|---|---|---|
| initial/asymmetric discussion | share private clues | Sprint6 discussion + countdown | clear | Great Hall scene | **PASS** |
| console step 1–4, own choice not submitted | choose current door action | step-specific buttons | clear | door overlay when ACTIVE asset anchors resolve | **PASS** |
| own step choice submitted, peers pending | wait | **same choice buttons are recreated** | no visible lock/ack | — | **FINDING PFC-003** |
| no consensus / wrong action | discuss/retry | feedback + discussion | clear | — | **PASS** |

Placeholder risk:
- Great Hall door overlay anchors are skipped when base is placeholder.
- independent action buttons still exist, so continuation is source-level possible.
- spatial readability is **NOT VERIFIED**.

---

## K. ACT10 — Golden Key

| State | Expected next | Current player UI | Ack / wait clarity | Verdict |
|---|---|---|---|---|
| private Take/Leave choice open | choose privately | buttons | clear | **PASS** |
| own private choice submitted, peers pending | wait | **same private-choice buttons reappear** | no visible lock/ack | **FINDING PFC-003** |
| discussion | discuss revealed private positions | Sprint6 discussion + countdown; private choices displayed | clear | **PASS** |
| final vote open | Take / Leave | buttons | clear | **PASS** |
| own final vote submitted, peers pending | wait | **same final-vote buttons reappear** | no visible lock/ack | **FINDING PFC-003** |
| result | go to Main Gate | payoff text/audio + explicit `GO TO MAIN GATE` | clear | **PASS; audio perception NOT VERIFIED live** |

---

## L. ACT11 — Main Gate allocation

| State | Expected next | Current player UI | Ack / wait clarity | Visual grounding | Verdict |
|---|---|---|---|---|---|
| allocation discussion | coordinate roles | discussion + countdown | clear | Main Gate background | **PASS mechanics** |
| role choice open | select A/B/C or A/B/WATCHER | role buttons | clear | **no station/watcher anchored labels** | **FINDING PFC-006** |
| own role submitted, peers pending | wait | **same allocation buttons reappear** | no visible lock/ack | no role-position overlay | **FINDING PFC-003 + PFC-006** |
| invalid allocation | reassign | feedback + buttons | clear | — | **PASS** |

### PFC-006 Main Gate visual integration

Approved `shared.main_gate v002` contains:
- `main_gate_station_A`
- `main_gate_station_B`
- `main_gate_station_C`
- `main_gate_watcher_corridor`

All four are canonical required anchors.

`app.js` references all four **zero times**.

V4.0 requires:
- three recognizable station positions;
- HTML labels for Station A/B/C;
- Watcher corridor;
- UI anchor integration.

Current runtime uses text task controls but does not consume the approved spatial anchors or place station/watcher overlays.

This is source-level confirmed even with a perfect ACTIVE image.

---

## M. ACT12 — Tasks / ENGAGE / Pressure / Cinematic

| State | Expected next | Current player UI | Ack / wait clarity | Verdict |
|---|---|---|---|---|
| Station A task incomplete | enter 1897 | form + instruction | clear | **PASS** |
| Station B initial | HOLD LEVER | button + instruction | clear | **PASS** |
| Station B lever held | wait ~1.2s for indicator center | lever-track animation; client auto-submits center | visible movement gives short wait cue | **PASS source-level** |
| Station C task incomplete | insert Silver Key | action button | clear | spatial station overlay missing | **PFC-006 visual** |
| Watcher task incomplete | WATCH CORRIDOR | action button | clear | watcher corridor overlay missing | **PFC-006 visual** |
| task complete, not engaged | ENGAGE | explicit ENGAGE button | clear | **PASS** |
| own ENGAGE complete, peers pending | wait for other required roles | **ENGAGE button still rendered** | contradicts V4.0 explicit requirement that engaged player sees waiting state | **FINDING PFC-003** |
| pressure choice open | choose response | role-context buttons | clear | **PASS** |
| own pressure choice submitted, peers pending | wait | **same pressure buttons reappear** | no visible lock/ack | **FINDING PFC-003** |
| cinematic stages 1–9 | watch auto sequence | changing text/audio, no action | intentionally auto | **PASS source-level; audio live NOT VERIFIED** |
| blackout stage 10 | wait through intentional blackout | shell hidden for cinematic interval | intentional ~2s state | **PASS source-level; rendered timing NOT VERIFIED** |
| clang/gate stages 11–12 | watch/listen | auto sequence | no action expected | **audio perception NOT VERIFIED** |

---

## N. ACT13 — Escape

| State | Expected next | Current player UI | Ack / wait clarity | Verdict |
|---|---|---|---|---|
| escape cinematic <3s | watch | escape-success / gate text; no button yet | short intentional delay | **PASS source-level** |
| escape cinematic ≥3s | Continue | Continue button appears on polling | clear | **PASS** |
| ACT14 boundary | finalize / Continue | finalization Continue button | clear | **PASS pre-finalization** |

---

## O. ACT14 — Final reveal / completion

| State | Expected next | Current player UI | Ack / wait clarity | Verdict |
|---|---|---|---|---|
| finalization RPC succeeds | show canonical ACT14 final reveal | run becomes completed; root `refreshState` sees no active run and falls to legacy Sprint1 before querying completed-run state | wrong surface | **FINDING PFC-001** |
| `s8_get_player_state` manually/reachably rendered | terminal six-frame reveal | auto terminal sequence | coherent terminal state | **PASS renderer itself; normally unreachable because PFC-001** |
| reconnect after completed run | recover final reveal | root again sees no active formal run and renders legacy Sprint1 | incoherent post-completion recovery | **PFC-001 persists on reconnect** |

---

# P. Pocket / evidence continuity audit

## PFC-005 — HIGH — Canonical Pocket / Memories / Shared Photos / Group Items are absent from ACT1–5 root player UI

### Source proof

- V4.0 says Pocket becomes available after GRAB and remains reopenable in later permitted phases.
- Pocket inspection is not decorative:
  - Gitte Number Note can be reopened to recover `41739`;
  - Anna Diary can reveal/read later information;
  - Linda Watch / Closure Order can be inspected later;
  - Memory/Observation access supports information-sharing behavior;
  - Group Items after Library reunion are explicitly player-visible.
- root `index.html` contains no Pocket UI.
- `app.js` fetches `s3_get_player_state` only when `sprint5State.active`, i.e. ACT6 onward.
- `renderSprint3b` has no Pocket renderer.

### Impact

This can:
- deprive ACT2 DiscussionRoom of intended evidence review;
- prevent later discovery from carried objects;
- force ACT3 puzzle reliance on memory/fallback hints rather than canonical Number Note reinspection;
- remove Group Items visibility after Library reunion;
- distort information-sharing and evidence-seeking behavior.

Severity: **HIGH** because this affects progression evidence and the validity of behavior-observation context, not merely visual polish.

---

# Q. Required visual-overlay integration audit

## PFC-006 — MEDIUM — Required ACT4 and Main Gate anchor/UI composites are not integrated

Confirmed unused required anchors:
- `library_unknown_door`
- `main_gate_station_A`
- `main_gate_station_B`
- `main_gate_station_C`
- `main_gate_watcher_corridor`

Confirmed integrated anchors:
- `portrait_main_face`
- `clock_A_face / B / C`
- `great_hall_red / blue / black_door`

Thus this is not a blanket "anchors are unimplemented" problem; it is a specific integration gap.

Player progression remains possible via text controls, so severity is **MEDIUM**, but ACT4 decision context and Main Gate spatial task grounding are incomplete.

---

# R. Reveal / transition audit

## PFC-007 — MEDIUM — ACT4 private choices are recorded/revealable server-side but never displayed to players

V4.0 requires simultaneous reveal of the three ACT4 initial route choices before direct resolution or ACT5 discussion.

Server projection:
- `s3b_get_player_state` returns `act4_revealed` once all three choices exist.

Client:
- `app.js` references `act4_revealed` **zero times**.

Therefore the required player reveal is absent.

## PFC-008 — MEDIUM — ACT5 route consequence and explicit entry transition are skipped

V4.0 requires:
- Known/Unknown route consequence text;
- then `[ENTER PORTRAIT HALL]`.

Current deferred cross-Sprint initialization overwrites the ACT5 terminal scene with ACT6 in the same transaction before the browser can observe it.

This is a narrative/player-transition completeness defect, not a backend progression defect.

---

# S. Reconnect audit summary

| State family | Reconnect result |
|---|---|
| canonical discussions / votes | server reconstructs correctly; PASS |
| ACT1 complete wait | explicit wait restored; PASS |
| PFC-002 sync barriers | blank/incomplete waiting UI is restored exactly; finding persists |
| PFC-003 submitted Sprint6 actions | controls reappear after reconnect because current-player lock state is not projected/used; finding persists |
| ACT1–5 Pocket | still absent; PFC-005 persists |
| ACT14 completed run | legacy fallback restored instead of ending; PFC-001 persists |
| audio outbox | localStorage retry exists; source-level recovery PASS, perception NOT VERIFIED |

---

# T. Media / audio acceptance boundaries

## Confirmed source-level

- opening placeholders do not block ACT1 action;
- library placeholder does not remove puzzle/action controls;
- Sprint5/Sprint6 action controls are generally independent of image load;
- missing audio is consumed as `stopped` and does not block state progression;
- blocked audio exposes a retry/status path;
- PFC-004 remains valid: Sprint6 stale status is not cleared on success.

## NOT VERIFIED

1. ACT6 placeholder without eye overlay — semantic/narrative completeness.
2. ACT7 placeholder with skipped clock anchors — actual overlap/readability.
3. ACT9 placeholder with skipped door anchors — actual spatial readability.
4. audio blocked/missing/delayed — first-time-player comprehension/perceptual quality.
5. responsive/mobile composition for the full three-browser play journey.

---

# U. Final matrix result

The state-by-state audit **does discover additional blind spots beyond CA-136**.

### Existing findings confirmed/refined

- IDA-001–006 remain relevant.
- PFC-001–004 remain valid.
- **PFC-002 expands to ACT8 private-choice waiting.**
- **PFC-003 has direct canonical-spec support at ACT12 ENGAGE:** V4.0 explicitly says an already-ENGAGED player must see a waiting state.

### New findings from the matrix

- **PFC-005 HIGH** — ACT1–5 Pocket/evidence UI absent.
- **PFC-006 MEDIUM** — required ACT4/Main Gate anchor/UI visual integration absent.
- **PFC-007 MEDIUM** — ACT4 simultaneous private-choice Reveal not rendered.
- **PFC-008 MEDIUM** — ACT5 route consequence / explicit Portrait Hall entry transition skipped.

### Remaining NOT VERIFIED

- placeholder anchor composition/readability;
- audio perceptual completeness;
- real rendered/browser behavior under staggered three-player timing.

## Remediation-scope conclusion

The pre-remediation problem map is **not limited to startup** and is **not limited to PFC-001–004**.

Before CD implementation begins, the bounded remediation discussion should include:

```text
IDA-001..006
PFC-001..008
+ live reproduction requirement for IDA-004
+ browser acceptance evidence for anchor/audio NOT VERIFIED items
```

No implementation mechanics are prescribed by CA.

This matrix is intended to be the final pre-remediation source-level completeness pass. Further source-only audit before implementation is not recommended unless GA/Teacher materially changes the remediation scope or a new product baseline appears.
