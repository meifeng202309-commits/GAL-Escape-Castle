
# Safe Visual Asset Generation, Naming and Transfer

Project: GAL Castle Escape / Skill 3  
Date: 2026-09-18  
Prepared by: Coding Manager, based on joint review and testing with Visual Agent  
Status: GitHub staging path verified; Supabase runtime publishing not yet verified

---

# 1. Purpose

This report records the problems found while designing a safe image-production workflow, the tests performed, and the resulting recommended process.

Target chain:

Visual Agent
→ identify canonical asset
→ generate image
→ assign safe filename/version
→ attach metadata/checksum
→ transfer to GitHub staging
→ Teacher review
→ later publish to runtime storage

The primary goal is to eliminate human file-handling errors without allowing Visual Agent to accidentally change the live game.

---

# 2. Existing project architecture that must remain true

Current project specifications already establish these principles:

1. Runtime assets are addressed by asset_key, not by hard-coded image filenames.
2. The game should resolve the ACTIVE asset version from metadata.
3. Production runtime assets are intended to use Supabase Storage.
4. GitHub is for source code, version-controlled configuration, fallback/default assets when needed, and production/audit metadata.
5. Castle Visual defines appearance and continuity; it is not the runtime database.
6. MASTER-01–05 are visual continuity references, not automatically runtime asset keys.

Intended runtime chain:

scene
→ asset_key
→ Asset Manager
→ ACTIVE version
→ storage_path
→ Supabase Storage
→ browser render

The workflow below is designed to feed this architecture, not replace it.

---

# 3. Problems discovered

## 3.1 Manual rename and upload create avoidable risk

The original practical workflow was:

Visual Agent generates
→ user downloads
→ user manually renames
→ user chooses folder
→ user uploads

This can produce:

- asset_key typos;
- accidental changes between dot, underscore, and hyphen;
- wrong asset identity;
- wrong folder;
- duplicate or overwritten versions;
- image/metadata mismatch;
- lost provenance.

Decision:

Manual renaming should not be part of the normal production workflow.

---

## 3.2 The image-generation tool cannot directly control the final filename

Visual Agent verified that the image-generation interface itself does not expose a final filename/output-path parameter.

However, Visual Agent also verified that it can post-process the generated image into an exact canonical handoff filename such as:

shared.clock_room__v003.webp

without requiring the user to rename the file.

Decision:

Canonical naming is a post-generation operation.

---

## 3.3 A canonical Asset Registry does not yet exist

Expected future path:

assets/asset-registry.json

This file did not exist during the audit.

Without a machine-authoritative registry, a natural-language request such as “redo Clock Room” could lead an Agent to invent one of several plausible names:

clock_room
clock-room
shared.clockroom
shared.clock_room

Decision:

Every production image must resolve identity through one canonical registry before generation.

---

## 3.4 Human labels need explicit mapping to canonical keys

A registry containing only a canonical key and a version number is not enough.

Recommended fields include:

- display_name
- aliases
- asset_type
- latest_version
- active_version

Example concept:

shared.clock_room
display_name = Clock Room
aliases = [Clock Room]

Then:

Clock Room
→ exact display_name / alias lookup
→ shared.clock_room

If no exact mapping exists:

STOP
ASSET KEY NOT FOUND

Visual Agent must not infer or invent a production asset key.

---

## 3.5 Castle Visual is not the machine registry

Castle Visual V2.0 is the human visual-production specification.

It defines:

- visual canon;
- scene requirements;
- continuity;
- recurring props;
- paired assets;
- UI-safe composition;
- revision policy.

It does not define authoritative live version state.

Likewise:

MASTER-03

may be a continuity reference while the runtime asset key is:

prop_gitte_castle_map

MASTER IDs and runtime asset keys must never be conflated.

---

## 3.6 Mixed naming styles are acceptable only with exact-match lookup

Current canonical keys intentionally use both dot and underscore styles, for example:

shared.clock_room
prop.golden_key
prop.photo_1897
prop_gitte_castle_map
prop_linda_watch_face

This is safe only if asset_key is treated as an opaque identifier.

Hard rule:

- never translate;
- never abbreviate;
- never normalize;
- never reconstruct an asset_key from a filename.

---

## 3.7 ACTIVE version and latest candidate version must be separate

A single ambiguous current_version field is unsafe.

Example:

v002 = ACTIVE
v003 = PENDING_REVIEW

If the next candidate number is derived from ACTIVE=2, another v003 may be created.

Decision:

Registry state should separate:

latest_version
active_version

Next candidate is based on latest_version + 1.

Runtime is based on active_version.

---

## 3.8 Registry reads must be fresh

Visual Agent verified that it can make a fresh exact-path GitHub read.

A version number remembered from chat must never be treated as authoritative.

Pre-generation gate:

fetch registry fresh
→ resolve canonical key
→ read latest_version
→ calculate candidate
→ generate

Pre-commit gate:

re-fetch registry
→ if latest_version changed
→ recalculate version
→ rename image + sidecar
→ commit

For a future multi-writer system, Codex should eventually add atomic reservation or compare-and-swap rather than relying only on optimistic re-read.

---

## 3.9 APPROVED and ACTIVE must not mean the same thing at runtime

Multiple approved versions can legitimately exist.

Correct semantics:

APPROVED = eligible for promotion  
ACTIVE = the one runtime version

Required later:

- unique asset_key + version;
- at most one ACTIVE version for each asset_key.

Runtime should resolve only ACTIVE.

---

## 3.10 Filename alone is not enough identity

Visual Agent verified automatic creation of a matched pair:

shared.clock_room__v003.webp
shared.clock_room__v003.json

It also verified automatic:

- width extraction;
- height extraction;
- SHA-256 calculation;
- checksum write-back into the JSON sidecar.

Recommended sidecar minimum fields:

asset_key
version
asset_type
source
status
continuity_refs
required_anchors
width_px
height_px
sha256

The image and JSON should be treated as one immutable candidate package.

---

## 3.11 Binary integrity should be checked by checksum

The same filename does not prove the same bytes.

Rule:

reviewed SHA-256
must equal
staged/published SHA-256

Mismatch means the transfer is rejected and the candidate cannot become ACTIVE.

---

## 3.12 GitHub broad code search is not an authoritative existence test

Visual Agent found that code search can miss files that an exact-path fetch can read.

For canonical resources such as:

assets/asset-registry.json

use exact-path reads.

---

# 4. Binary upload tests

## 4.1 Coding Manager test

A real binary PNG was committed to:

agent-comms/_binary-test/coding-manager-upload-test.png

Verified GitHub tree entry:

blob SHA:
26a8c68efad2a094e8fe6d850426b651d353c568

size:
68 bytes

commit:
28a0048b1f803e4fc0a3a68ba34a871c49d6428e

Result:

Coding Manager → GitHub binary upload → GitHub tree reread = PASS

---

## 4.2 Visual Agent test

Visual Agent independently read the shared GitHub instruction, uploaded a real binary image, committed it, and verified the result.

Path:

agent-comms/_binary-test/visual-agent-upload-test.png

Recorded result:

RESULT: PASS  
BLOB SHA: 933c4c4ed7a3e2ced577dd4d571bd9e94bd64148  
SIZE: 1466 bytes  
COMMIT SHA: c538aa8b83fd77f10c08d72e5dc5620bd17c8974

Result:

Visual Agent
→ GitHub read
→ binary create/upload
→ commit
→ GitHub reread
= PASS

Therefore Visual Agent → GitHub staging binary transfer is now technically verified.

---

# 5. Verified capabilities

Visual Agent has verified:

- exact GitHub reads from main;
- fresh re-fetch instead of relying on chat memory;
- numeric next-version calculation;
- post-generation canonical renaming;
- WebP conversion where needed;
- matched JSON sidecar creation;
- width/height extraction;
- SHA-256 generation;
- checksum write-back;
- real binary upload to GitHub;
- commit;
- post-upload verification of path, blob SHA, and non-zero size.

Coding Manager independently verified:

- GitHub binary blob creation;
- tree creation;
- commit creation;
- fast-forward update of main;
- exact-path text reread;
- repository-tree verification of uploaded binary.

---

# 6. Not yet verified

## 6.1 Canonical Asset Registry

assets/asset-registry.json has not yet been created or used in a real production transaction.

## 6.2 Supabase Storage publishing

Visual Agent currently has no verified direct Supabase Storage object workflow for:

- bucket listing;
- binary upload;
- versioned object creation;
- public/signed URL creation;
- Asset Manager metadata mutation;
- promotion to ACTIVE.

Therefore Visual Agent must not currently publish directly into live runtime storage.

## 6.3 Runtime asset resolver

Sprint 1 remains the verified text prototype.

The future chain:

asset_key
→ ACTIVE metadata
→ storage_path
→ Supabase Storage
→ rendered image

has not yet been implemented.

---

# 7. Recommended production workflow

Phase A — Visual production and GitHub staging:

1. Visual request arrives.
2. Visual Agent fetches fresh assets/asset-registry.json.
3. Resolve request through display_name / aliases.
4. Obtain exact canonical asset_key.
5. Read latest_version.
6. Calculate next candidate version.
7. Read Castle Visual requirements and continuity references.
8. Generate the image.
9. Post-process to:
   {asset_key}__vNNN.webp
10. Create:
   {asset_key}__vNNN.json
11. Calculate width, height, SHA-256.
12. Re-fetch registry before commit.
13. If version state changed, recalculate and rename the pair.
14. Upload image + JSON to GitHub staging.
15. Re-read GitHub.
16. Verify path, blob, non-zero size, and checksum.
17. Candidate remains PENDING_REVIEW.
18. Teacher reviews.

No human file renaming is required.

---

# 8. Recommended GitHub production structure

Production assets must not use agent-comms/.

Recommended:

assets/
  asset-registry.json

  staging/
    shared.clock_room/
      v003/
        shared.clock_room__v003.webp
        shared.clock_room__v003.json

    shared.library/
      v002/
        shared.library__v002.webp
        shared.library__v002.json

agent-comms/ remains a communication/testing channel only.

---

# 9. Recommended registry fields

Each canonical asset should at minimum support:

- asset_key
- display_name
- aliases
- asset_type
- latest_version
- active_version
- continuity_refs
- paired_asset_group
- required_anchors
- runtime_required

Important rules:

- latest_version controls candidate numbering;
- active_version controls runtime;
- aliases are explicit;
- no Agent invents keys;
- paired assets are explicitly encoded.

Examples of paired assets:

prop.photo_1897
shared.west_tower_payoff

and:

shared.portrait_hall
overlay.portrait_eyes_open

---

# 10. Visual Agent hard rules

1. Never invent an asset_key.
2. Never translate an asset_key.
3. Never abbreviate an asset_key.
4. Never normalize dot, underscore, or hyphen.
5. Fetch the canonical registry before every production image.
6. Resolve wording only through exact display_name / aliases.
7. If no key is found: STOP → ASSET KEY NOT FOUND.
8. Use latest_version, not active_version, for candidate numbering.
9. Apply the canonical filename after generation.
10. Produce image + matched JSON sidecar.
11. Calculate dimensions and SHA-256 automatically.
12. Re-fetch registry immediately before commit.
13. Never overwrite an existing version.
14. After upload, verify GitHub path, blob, non-zero size, and checksum.
15. Never promote a candidate to ACTIVE.
16. Never store production assets in agent-comms/.
17. Never substitute MASTER-XX for a runtime asset_key unless the registry explicitly defines it.

---

# 11. Human responsibility after automation

The user/teacher should no longer need to:

download
→ rename
→ choose version
→ create folder
→ edit manifest
→ upload binary

Human responsibility should be reduced to semantic decisions:

Review image
→ Approve / Reject
→ confirm required anchors
→ confirm paired-asset continuity

---

# 12. Codex / Asset Manager responsibility

Visual Agent should stop at verified staging + metadata.

Codex should own:

APPROVED candidate
→ publish/copy to Supabase Storage
→ persist runtime metadata
→ enforce one ACTIVE version
→ update active_version
→ runtime resolver
→ missing-asset fallback
→ load/error telemetry

Codex must later define:

- bucket policy;
- public vs signed/authenticated URL strategy;
- Storage path format;
- upload authorization;
- rollback;
- cache/version behavior;
- ACTIVE uniqueness;
- 404/corrupt/network failure behavior.

---

# 13. Missing assets must fail visibly, not silently

Recommended runtime behavior:

asset load failure
→ safe placeholder
→ preserve core gameplay where possible
→ log asset_load_failed
→ include asset_key and requested version/path
→ show the cause in Teacher debug

Interaction-critical overlays may require a stricter scene block, but the cause must remain explicit.

---

# 14. Source-of-truth hierarchy

Machine identity/version authority:

assets/asset-registry.json

Owns:

- canonical key;
- display label / aliases;
- asset type;
- latest version;
- active version;
- pair identity;
- anchor contract.

Human visual specification:

Castle Visual

Owns:

- what the image must look like;
- visual continuity;
- master references;
- composition;
- paired visual rules;
- revision policy.

Runtime manifest:

If Codex needs src/content/asset-manifest.js, it should be generated or validated from asset-registry.json rather than maintained as a second independently edited source of truth.

---

# 15. Final safe boundary

Verified production side:

Castle Visual + canonical registry
→ Visual Agent
→ generate
→ canonical post-generation naming
→ sidecar metadata
→ dimensions + SHA-256
→ GitHub staging
→ GitHub reread verification
→ Teacher review
→ APPROVED

Separate runtime publishing side:

APPROVED
→ Codex Asset Manager
→ Supabase Storage
→ unique ACTIVE
→ runtime lookup by asset_key

This separation prevents Visual Agent from accidentally changing the live game while removing manual file-transfer and renaming work.

---

# 16. Current status

Visual Agent exact GitHub read: VERIFIED  
Visual Agent canonical post-rename: VERIFIED  
Visual Agent image + JSON sidecar: VERIFIED  
Visual Agent width/height extraction: VERIFIED  
Visual Agent SHA-256 generation: VERIFIED  
Visual Agent GitHub binary upload: VERIFIED  
Visual Agent post-upload verification: VERIFIED  

Coding Manager GitHub binary upload: VERIFIED  
Coding Manager GitHub tree reread: VERIFIED  

Canonical asset registry: NOT YET CREATED  
Registry production update protocol: NOT YET VERIFIED  
Supabase Storage transfer: NOT YET VERIFIED  
Runtime asset resolver: NOT YET IMPLEMENTED  
ACTIVE uniqueness enforcement: SPEC HARDENING REQUIRED

---

# 17. Recommended next steps

1. Create assets/asset-registry.json from the canonical asset list in the current game specification.
2. Add explicit display_name / aliases.
3. Separate latest_version from active_version.
4. Encode paired asset groups and required anchors.
5. Install the hard rules in the Visual Agent operational instruction layer.
6. Establish assets/staging/{asset_key}/vNNN/.
7. Run one real production-like candidate through:
   registry → generation → canonical pair → GitHub staging → reread verification.
8. Later, Codex implements:
   APPROVED → Supabase Storage → unique ACTIVE → runtime resolver.
9. Then run full E2E:
   Visual Agent → GitHub staging → Teacher approval → Supabase → game render.

---

# 18. Conclusion

The original high-risk workflow:

generate
→ download
→ manually rename
→ manually choose path
→ manually upload
→ manually update metadata

is no longer necessary.

Testing supports moving to:

fresh registry lookup
→ exact asset identity
→ generation
→ automatic canonical naming
→ automatic metadata + checksum
→ verified GitHub staging
→ Teacher approval

The Visual Agent → GitHub boundary has passed independent binary tests.

The remaining engineering boundary is:

APPROVED staging asset
→ Supabase Storage
→ unique ACTIVE
→ runtime load by asset_key

That boundary should be owned and verified by Codex / Asset Manager, not by Visual Agent.
