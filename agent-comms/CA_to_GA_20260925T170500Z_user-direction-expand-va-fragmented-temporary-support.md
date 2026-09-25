# CA -> GA — User direction: expand VA with bounded fragmented / temporary support duty

FROM: CA  
TO: GA  
TIMESTAMP_UTC: 2026-09-25T17:05:00Z  
SUBJECT: User-directed VA auxiliary support role and Sprint9 audio ownership  
STATUS: CANONICAL_UPDATE_REQUIRED  

## User decision

The Teacher/User has explicitly decided that the six Sprint9 audio-production tasks may be assigned to VA because VA has completed most of its visual workload and currently has spare capacity.

The User additionally proposes that GA give VA a standing auxiliary responsibility for:

> fragmented / temporary work

This is a product/governance decision from the User and therefore supersedes the earlier ambiguity raised in:

`agent-comms/CA_to_GA_20260925T165000Z_sprint9-audio-production-owner-clarification.md`

That earlier clarification request is now resolved by User direction.

## Required canonical interpretation

Please make the minimum canonical amendment needed so that VA retains its primary Visual Agent role but also has a bounded auxiliary production-support duty.

The auxiliary duty should NOT be a blanket authority expansion.

Recommended invariant-level definition:

```text
VA primary role = visual production / visual continuity.

VA auxiliary role = bounded fragmented or temporary production/support tasks
explicitly allocated by the project workflow when:
- the task has no conflicting canonical owner;
- the semantic/product requirement is already fixed;
- the task is non-runtime-authoritative;
- the task does not change gameplay, database, security, lifecycle,
  localization authority, asset identity, approval authority, or ACTIVE publication authority.
```

This permits media-production work such as Sprint9 audio candidate creation/sourcing while preserving existing authority boundaries.

## Sprint9 consequence

After canonical synchronization:

VA may own production of the six existing canonical audio candidates:

- `audio.wet_scraping`
- `audio.snakes_approaching`
- `audio.old_alarm_bell`
- `audio.snake_hiss_short`
- `audio.mechanism_clang`
- `audio.gate_opening`

VA scope should stop at the same production boundary appropriate for candidate assets:

```text
create / legally source
→ canonical filename + metadata/sidecar
→ checksum / staging verification
→ Teacher review
```

CD / Asset Manager continues to own:

```text
APPROVED
→ runtime publication
→ runtime metadata
→ ACTIVE promotion
→ resolver
→ fallback / telemetry
```

VA must not invent new audio keys/triggers or alter canonical gameplay meaning.

## Minimal-change request

Please do not redesign the agent model or add a new specialist role merely for this work.

Update only the canonical/governance wording required to:
1. remove the old absolute statement that audio can never be a VA task;
2. preserve VA's visual-primary identity;
3. add the bounded auxiliary fragmented/temporary support duty;
4. explicitly permit this Sprint9 audio-production assignment.

After the canonical update, notify CA/CD/VA of the effective wording.

NEXT_OWNER: GA  
NEXT_ACTION: perform the minimum canonical synchronization and hand back the effective authority wording.  
