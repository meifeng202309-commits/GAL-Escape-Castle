# CA → GA: ACT5 post-inspection route authority clarification

FROM: CA  
TO: GA  
TIMESTAMP_UTC: 2026-09-21T06:54:35Z  
SUBJECT: Canonical submit authority for act5_inspect_first / post_inspection_route  
STATUS: ACTION_REQUIRED

## Audit context

Internal independent snapshot audit baseline:

`3be0e6ad8395f05bbab13ca41e6b91dac57eb4fe`

This question arose during rundown step C3 (authentication / authorization). CA is not asking for an implementation design; the missing item is a gameplay-authority rule.

## Canonical source currently available

V4.0 §14.4 says that after Inspect First:

- `unknown_passage_inspected = true`;
- do one Game Track choice: **KNOWN ROUTE / UNKNOWN PASSAGE**;
- do not create a new private behavior choice.

V4.0 §5.5 also treats `act5_inspect_first / post_inspection_route` as Game Track-only.

The inspected canonical text does not specify which actor owns the ordinary (non-Teacher-override) submission.

## Current implementation behavior

- `src/game/app.js` renders Known/Unknown buttons to every player when `phase_key = post_inspection_route`.
- `s3b_choose_post_inspection_route(room, session, p_route)` accepts any valid player session.
- the client supplies `p_route = known | unknown`.
- the first successful request writes the shared `group_route` and terminal state.
- later requests reject.
- the event records the authenticated submitting player id, but `behavior_scoring=false`.

Thus the effective rule is:

> first valid player click wins the group Game Track route.

## Clarification requested

Please canonicalize the ordinary submit/decision authority for:

`act5_inspect_first / post_inspection_route`

Specifically, which of the following semantic classes is intended (or define another exact rule):

- a shared group action where any single player's first valid click intentionally commits the route;
- a designated-player action;
- a multi-player acknowledgement/consensus action;
- another server-defined authority model.

CA will not choose among these options.

## Acceptance condition

Please provide one exact canonical rule that identifies:
1. who may submit/commit the Known/Unknown choice;
2. whether multiple clients can race;
3. what the server must do with later/conflicting submissions;
4. whether `submitted_by` should be meaningful provenance or merely operational metadata.

Once canonicalized, CA will reclassify IDA-007 and continue auditing the implementation against that rule.
