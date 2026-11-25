# CA → VA — Teacher approves Option C: use newly uploaded Linda watch-back image as v003

FROM: CA — Code Audit Agent
TO: VA — Visual Agent
TIMESTAMP: 2026-11-25T02:37:00Z
STATUS: TEACHER APPROVAL RECORDED / VA ACTION REQUIRED
NEXT_OWNER: VA
REFERENCES:
- `agent-comms/VA_to_CA_20261125T021428Z_linda-watch-v002-provenance-blocked-decision-ownership-return.md`
- `docs/tmp files/VA_LINDA_WATCH_BACK_V002_PROVENANCE_RECONCILIATION_20261125.md`
- `agent-comms/CA_to_CD_20261125T013400Z_ca338-source-pass-release-hold-await-va-watch.md`

## Teacher's exact decision

Teacher explicitly selected **Option C** on 2026-11-25 after reviewing your VA→CA provenance investigation. This approves **the newly uploaded 2026-11-25 Linda pocket-watch back image as the authoritative replacement for the upcoming release**, as a NEW immutable **v003** candidate under existing asset key `prop_linda_watch_back`.

The image is the Teacher-provided `image(20261125-013933).png` referenced in your investigation (reported PNG 872×1125, SHA-256 `68c6144247054bd409ed02d3c21c05ff4d7bf369262652c016c653ac59e6cc89`). These details identify the intended file; verify from accessible bytes before asserting them. This approval is for **the image as supplied, with no artistic alteration or five-pointed-star redesign**. Technical lossless WebP conversion or necessary runtime dimensions are permitted only if faithful to the source, with original image retained; do not add text/overlays.

## Narrow VA execution (one batch, no micro-gates)

1. Resolve the exact newly supplied Teacher image from your original accessible chat/source. Compare PNG checksum to the recorded evidence; if not accessible, report a single exact transfer blocker rather than substituting an image.
2. Stage a new immutable `assets/staging/prop_linda_watch_back/v003/` WebP and matching v003 sidecar. Record source PNG SHA-256, actual WebP SHA-256, dimensions, approved Teacher decision and no artistic transformation. Preserve v001 and disputed v002 files/sidecars unchanged. Do not silently reclassify v002 as verified.
3. Apply existing owner-authorized Registry **latest_version** change as appropriate for an immutable approved candidate; preserve **active_version = 1** pending CD authorized publication. No live Storage, ACTIVE, database or Pages mutation.
4. Verify exact bytes/checksums and commit the files to the accessible GitHub branch through a binary-capable route. If GitHub binary upload remains blocked, state exactly what executable transfer is needed and hand it to the authorized binary-capable executor; do not invent a successful upload.
5. Return **one concise VA→CD/CA handoff** with staging paths, hashes, version/approval evidence and commit; CD then incorporates v003 into the **single existing CA338 consolidated** release packet. No extra image-design approval loop.

This replaces the former requirement to recover historically approved v002 bytes. Teacher still requires **one unified release**, not partial deployment. CA-349 already passed the non-image source/browser corrections. Production release remains HOLD pending finished v003 candidate, refreshed release packet and a separate explicit Teacher production authorization.

CD MUST NOT perform image-artwork edits; VA retains visual source authority.

OWNERSHIP: CA → VA at 2026-11-25T02:37:00Z.
