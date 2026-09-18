# Sprint 2 Architecture — Reusable DiscussionRoom

## Scope

Sprint 2 implements one generic reusable discussion and voting contract. It does not bind the component to the complete Castle Escape story.

The verified Sprint 1 migration and `s1_*` RPC semantics remain unchanged.

## Formal Run Identity

`game_runs` stores:

```text
run_id
room_code
run_started_at
run_mode
behavior_dataset_eligible
status
silent_texting_mode
```

The server creates `run_id`. `run_mode` is `normal` or `audit` and is protected by a database trigger after creation. `normal` runs are dataset-eligible; `audit` runs are not.

Only one active formal run is allowed per room. Sprint 2 does not implement destructive formal-run reset. A future full restart must complete the existing run and create a new `run_id` while preserving history.

## Discussion Identity

Each discussion window has a unique `discussion_session_id`. It records:

```text
run_id + scene_id + phase_key + step_key + round_no + vote_round
```

A 1:1:1 result closes the current session as `no_consensus`, records that no action was applied, and creates a new discussion session with the next vote round. Old messages, votes, and outcomes remain immutable.

## Transcript

`dialogue_messages` stores the player, discussion identity, message text, and server-generated `created_at`. Transcript reads are ordered by `created_at` and identity value for deterministic ties.

Messages can only be submitted by a valid Sprint 1 player session while the current discussion is open. Message length is limited to 1-1000 characters.

## Voting And Privacy

Vote options are stored in the server-owned discussion configuration. The browser submits only `choice_id`; the server resolves and stores the canonical label.

The uniqueness boundary is:

```text
run_id + scene_id + phase_key + step_key + vote_round + player_id + decision_type
```

Before resolution:

- a player sees only their own locked vote;
- other players receive no private choice;
- the teacher sees submitted/waiting state but not choice content.

After all three votes:

- 3:0 and 2:1 resolve to the majority;
- 1:1:1 applies no game action and follows the configured tie policy.

## Deadlines

`phase_deadline` is generated and evaluated by Supabase.

- Discussion timeout opens voting when a final vote is configured.
- Vote timeout with fewer than three submissions enters `waiting_for_missing_player`.
- Missing input is never synthesized.
- The teacher may add time through a teacher-token-protected RPC.

## Reconnect

Students reuse the Sprint 1 room and player session token. `s2_get_player_state` restores:

- run metadata;
- current discussion and deadline;
- transcript;
- configured revealed initial choices;
- current vote round;
- the player's own locked vote;
- resolved vote history.

## Access Boundary

All Sprint 2 tables use RLS with no broad public policies. Browser access is through `SECURITY DEFINER` RPC functions protected by either:

- room code + teacher token; or
- room code + player session token.

No service-role key is present in browser source.

## Deferred Work

Sprint 2 does not implement final exports, Pocket/knowledge, full story binding, Asset Manager publishing, ACTIVE promotion, runtime asset resolution, Agent analysis, prediction, or audio climax.
