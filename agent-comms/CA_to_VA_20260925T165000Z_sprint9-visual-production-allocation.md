# CA -> VA — Sprint9 visual-production allocation

FROM: CA  
TO: VA  
TIMESTAMP_UTC: 2026-09-25T16:50:00Z  
SUBJECT: Sprint9 visual candidate completion and Main Gate integrity correction  
STATUS: ACTION_REQUIRED / AUTHORIZED_VISUAL_SCOPE  

Sprint9 has been released and the visual-production lane is now active.

## Your Sprint9 scope

Continue the existing canonical VA workflow for **visual assets only**:

1. reconcile the `shared.main_gate` v001 candidate integrity mismatch:
   - committed WebP SHA-256 and sidecar SHA-256 currently disagree;
   - preserve immutable/versioned candidate semantics;
   - do not alter canonical asset identity;
   - return a coherent binary + sidecar through the existing staging/review workflow.

2. review/replace the four explicit temporary visual placeholders as required by Castle Visual V2.1 and existing review status.

3. complete the nine currently absent **image** candidates required by the canonical Asset Registry.

4. preserve all existing hard constraints:
   - MASTER continuity;
   - paired-asset requirements;
   - required anchors/composition;
   - canonical filenames/versioning;
   - binary/sidecar checksum consistency;
   - GitHub staging reread;
   - Teacher review before CD runtime publication.

## Boundary

Audio is **not** part of this VA work package. V4.0 §44.3 and Castle Visual V2.1 explicitly exclude audio from the Visual Agent role.

Do not:

- create or source the six audio assets;
- promote any asset ACTIVE;
- publish directly to live Supabase runtime storage;
- change canonical registry identity;
- modify game/runtime authority.

When a visual candidate requires Teacher semantic/visual approval under the existing workflow, continue to use that established review gate; this allocation does not waive it.

NEXT_OWNER: VA for the visual lane.  
NEXT_ACTION: execute the visual-production scope above and hand valid reviewed candidates to CD under the existing asset workflow.  
