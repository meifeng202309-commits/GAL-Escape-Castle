# CA -> CD — Package A CA-A recheck: startup closed, one ACT6 timer residual remains

FROM: CA
TO: CD
TIMESTAMP_UTC: 2026-09-27T15:45:00Z
SUBJECT: Narrow recheck of bounded Package A corrections
STATUS: CA-A_FAIL / ONE_BOUNDARY_RESIDUAL + REMEDIATED_E0_NOT_VERIFIED
CORRECTION_SHA: `92c0f59967a4588769fb3d562035a96e663639f7`
HANDOFF_HEAD: `966e1c6a4b29af89ec13e8dddcc537018eab9f23`

Audit report:

`docs/audits/regular/runs/2026-09-27_package_a_ca_a_recheck_1/AUDIT_REPORT.md`

## Result summary

```text
A-CA-001 = FIXED_VERIFIED
A-CA-002 = PARTIALLY_FIXED
A-CA-002-R1 = OPEN_HIGH
REMEDIATED_E0 = NOT_VERIFIED

CA-A = FAIL
Packages B/C/D = remain blocked
NEXT_OWNER = CD
```

## A-CA-001 — closed

Migration060 successfully removes browser-role execution of `s2_start_run` from `anon/authenticated`.

The supported browser formal-start authority is now the atomic `s9_start_formal_game`.

Preserve this.

## A-CA-002 — original defects corrected

CA independently verified:
- per-player handoff observation;
- per-player ACT6 entry state;
- peers are not globally advanced by one player's click;
- successful entry writes that player's `player_location='portrait_hall'`;
- new progress fields are projected through the existing `to_jsonb(s3b_player_progress)` player-state projection;
- root dispatch gates ACT6 by the current player's own `act6_entered_at`.

Preserve these corrections.

## A-CA-002-R1 — HIGH

The canonical ACT6 DiscussionRoom still starts its 90-second timer at ACT5 terminal completion.

Current effective trace:

```text
ACT5 terminal
→ deferred s5_ensure_initialized
→ s5_configure_discussion('act6_vote')
→ started_at = now()
→ phase_deadline = now() + 90 sec
→ players later observe ACT5 payoff
→ players later click ENTER PORTRAIT HALL
```

V4.0 defines ACT6 as:
- enter Portrait Hall;
- present Portrait scene;
- then automatically open the 90-second DiscussionRoom.

Therefore the server is consuming ACT6 interaction time before the player-visible transition boundary has completed.

A staggered player can enter late with reduced time or after the discussion has already advanced.

### Required outcome

The canonical ACT6 discussion/timer must not begin consuming player interaction time before the required ACT5→ACT6 visible entry boundary has completed for the participants required by the group scene.

CA is not prescribing the mechanism.

## Remediated E0

The harness exists and broken-baseline evidence is valid.

But CA-A acceptance still requires one controlled run with:
- corrected frontend;
- migrations059–forward correction applied;
- remediated E0 / bounded live correction evidence.

Do not simulate this result.

## Stop rule

Correct only:
- A-CA-002-R1;
- the missing remediated-E0 evidence gate.

Do not reopen A-CA-001.
Do not begin B/C/D.

Then freeze one new Package A SHA and return ownership to CA for another narrow recheck.
