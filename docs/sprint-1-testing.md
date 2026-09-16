# Sprint 1 Testing

## Database Setup

Run this migration in Supabase SQL editor:

```text
database/001_sprint1_core.sql
```

## Teacher Flow

Open:

```text
teacher.html
```

Create a room:

- room code: any classroom code, for example `S1TEST`
- teacher token: a room-specific secret chosen by the teacher
- Gitte join code: give only to the Gitte student
- Anna join code: give only to the Anna student
- Linda join code: give only to the Linda student

Then click:

```text
Create room
```

Expected hardening behavior:

- Creating the same room code again must fail with "Room already exists".
- Empty join codes must fail.
- Duplicate join codes must fail.
- If a student has already claimed a role, entering the same join code in another browser must fail until the teacher releases that role's session.

## Student Flow

Open:

```text
index.html
```

Each student enters:

- same room code
- their own assigned join code

Each student submits one private choice.

Expected behavior:

- before all three submit, teacher sees only submitted/waiting
- after all three submit, reveal happens
- students see all three choices
- teacher sees all three choices

## Reconnect Test

After joining and submitting:

1. Refresh one student browser.
2. Confirm the student is restored without entering the join code again.
3. Confirm the locked choice cannot be changed.

## Teacher Reset Test

1. Open teacher console.
2. Enter the same room code and teacher token.
3. Click Reset room.
4. Confirm decisions are cleared and scene returns to collecting.

## Recovery Test

1. Join as one player.
2. Try the same room code + join code in another browser.
3. Confirm takeover is rejected.
4. In Teacher Console, click the matching "Release session" button.
5. Try joining again with the same join code.
6. Confirm rejoin succeeds only after teacher release.

## Concurrent / Double-Join Race Test

This test verifies that claiming a player role is atomic.

1. Create a fresh room with a unique room code.
2. Use the same role join code in two independent browsers or tabs at nearly the same time.
3. Confirm exactly one join succeeds.
4. Confirm the other join fails with the already-claimed role message.
5. Refresh the successful browser.
6. Confirm it remains attached to the claimed role.
7. In Teacher Console, confirm only one role session was claimed for that join code.
8. Release the role session from Teacher Console.
9. Confirm the join code works again only after release.

Expected database behavior:

- `s1_join_player` locks the matching `s1_room_players` row with `FOR UPDATE`.
- The second concurrent transaction waits for the first transaction to finish.
- After the first transaction writes `session_token_hash`, the second transaction sees the role as claimed and fails.

## Advance Test

1. Create a fresh room.
2. Before all three private choices are submitted, click Advance scene.
3. Confirm it fails.
4. Submit all three choices and wait for reveal.
5. Click Advance scene.
6. Confirm it advances only after reveal.

## Local Static Check

Run:

```text
node tests/sprint1-static-check.js
```

This does not require npm packages.

## Live E2E Check

Run only after the current migration has been deployed to Supabase:

```text
node tests/sprint1-live-e2e.js
```

This uses the deployed GitHub Pages URLs and the existing Supabase project. It creates fresh random test rooms and verifies room creation hardening, three-player joins, pre-reveal privacy, canonical choice storage, reconnect, reset, teacher release recovery, invalid choice rejection, and the concurrent double-join race.

## Not Covered In Sprint 1

- DiscussionRoom
- Agent analysis
- Asset Manager
- production authentication
- full 17 ACT story flow
