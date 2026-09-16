# Sprint 1 Architecture

Scope approved for Sprint 1:

- room/session
- shared state
- private-choice lock
- reveal
- reconnect

Out of scope:

- DiscussionRoom
- Agent analysis
- Asset Manager
- prediction system
- full story implementation

## Room Identity

Each room is identified by an uppercase `room_code`.

The authoritative room record lives in Supabase:

```text
s1_rooms
s1_room_state
```

## Player Session Token

Students do not freely select `GAL-A`, `GAL-B`, or `GAL-C`.

The teacher creates a room with three role-specific join codes:

```text
GAL-A -> Gitte
GAL-B -> Anna
GAL-C -> Linda
```

A student enters:

```text
room code + assigned join code
```

Supabase returns a generated `session_token`. The browser stores it in `localStorage`. The token is never hard-coded in the frontend.

If a role is already claimed, the same join code cannot silently rotate the token or take over that role. The student must use the original browser session, or the teacher must explicitly release that role's session from the Teacher Console. That recovery action is logged as a teacher event.

## Reconnect

On refresh, the student page loads the saved session token from `localStorage` and calls:

```text
s1_get_player_state
```

This restores:

- room code
- player identity
- current scene
- phase
- locked private choice
- revealed choices when reveal is allowed

## Authoritative Room State

The authoritative state is stored in:

```text
s1_room_state
```

Fields:

```text
room_code
current_scene
phase
updated_at
```

The browser does not decide reveal. Supabase updates the phase to `revealed` after all three private choices are locked.

Teacher scene advance is allowed only from `revealed`. Sprint 1 does not include emergency advance from `collecting`; any future emergency override must be a separate logged intervention RPC.

## Private-Choice Storage

Private choices are stored in:

```text
s1_player_decisions
```

Uniqueness:

```text
room_code + scene_id + player_id + decision_type
```

This enforces first-choice lock.

Choice labels are canonicalized server-side using `s1_scene_choices`. The browser may send a label for UI convenience, but Supabase validates `choice_id` against the current scene and stores the server-owned label.

## Reveal Rule

Reveal happens when the current scene has three private choices, one per player session.

Before reveal:

- students see their own locked choice
- teacher sees only submitted/waiting status

After reveal:

- students see all three choices
- teacher can see all three choice labels

## Teacher Access Protection

Sprint 1 uses a room-specific teacher token.

The token is chosen or stored by the teacher when creating the room. It is not hard-coded in public frontend source. Teacher actions call RPC functions with:

```text
room_code + teacher_token
```

This is a simple safe prototype mechanism. It is not a full authentication system.

The teacher token input is a password field with a show/hide control.

## RLS Policy Direction

Tables have RLS enabled and no broad public table policies.

Browser access goes through `SECURITY DEFINER` RPC functions:

- `s1_create_room`
- `s1_join_player`
- `s1_get_player_state`
- `s1_submit_private_choice`
- `s1_get_teacher_state`
- `s1_advance_scene`
- `s1_release_player_session`
- `s1_reset_room`

No service-role or secret key is used in browser code.

Public unrestricted DELETE/reset is not used.

## Sprint 1 Limitations

- Join codes are classroom credentials. Anyone with a join code can join that role.
- Teacher token is room-specific but manually handled.
- Teacher can explicitly release a lost student session; this is a prototype recovery mechanism.
- There is no full account system.
- The story content is still placeholder-level.
- DiscussionRoom and Agent features are intentionally postponed.
