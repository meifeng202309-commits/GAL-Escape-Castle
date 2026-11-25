# VA — Linda Watch Back v003 Teacher-approved exact-image staging packet

**VA record date:** 2026-11-25 (UTC)  
**Status:** ART SOURCE CONFIRMED / LOSSLESS WEBP PREPARED / **GITHUB BINARY STAGING BLOCKED**  
**Canonical key:** `prop_linda_watch_back`  
**Teacher authority:** `agent-comms/CA_to_VA_20261125T023700Z_teacher-approves-option-c-watch-back-v003-exact-new-image.md` (Option C, no artistic alteration)

## Accepted source

- Teacher's uploaded `image(20261125-013933).png`, **872 × 1125**, PNG RGBA, **2,114,254 bytes**.
- Independently read from original current-chat source at `/mnt/data/image(20261125-013933).png`.
- **PNG SHA-256:** `68c6144247054bd409ed02d3c21c05ff4d7bf369262652c016c653ac59e6cc89`. EXACT match to CA's target/source report.
- **No pentagram/star edits, no color changes, no text/graphic overlays, no crop, no rescaling.**

## Exact converted WebP

- WebP source dimensions preserved **872 × 1125**; lossless encoding, image pixel comparison against source PNG **exact-match** (RGBA-equivalent pixels).
- **WebP SHA-256:** `ca9a31b2bd7b880f88b4dfabcfcb5d973b4c19a3dc9d482796afa60b83320469`.
- **WebP size:** 1,060,604 bytes.
- Intended immutable staging target: `assets/staging/prop_linda_watch_back/v003/prop_linda_watch_back__v003.webp`.
- Intended sidecar: `assets/staging/prop_linda_watch_back/v003/prop_linda_watch_back__v003.json`, with `version:3`, `teacher_review:APPROVED`, original PNG and converted WebP checksums; validated locally.
- ZIP artifact in this VA conversation: `GAL_Linda_Watch_Back_v003_Approved_Staging.zip` (**3,178,207 bytes**, SHA-256 `f295f6f81f25febd5dc25c48100c7db2b64552352de6e5e3d7a3cf3627d304bb`). Contains exact PNG, WebP, sidecar, README and checksummed manifest. ZIP CRC check passed.
- **This ZIP is a local download attachment, NOT a GitHub-reachable file.**

## Actual GitHub state (critical)

- Binary **v003 is NOT on GitHub**. Do not claim the v003 target file exists or that immutable staging has passed.
- No v003 sidecar was committed to `assets/staging/` without the binary.
- Both v001 and disputed v002 staging files remain untouched. v002 mismatched checksum remains unresolved, but superseded for this release by Teacher-approved v003.
- Development branch `assets/asset-registry.json`: `latest_version=1`, **`active_version=1`**; these remain unchanged until exact binary staging verification.
- No database, GitHub Pages, runtime Storage, ACTIVE or release mutation.

## Exact executable binary-transfer task (CA/CD or authenticated local git workspace)

1. Obtain the **actual ZIP bytes**, e.g. Teacher downloads the attachment in VA chat and attaches the ZIP to CD's authenticated Codex workspace. If ZIP download fails, transfer the **1,060,604-byte WebP** plus 1,340-byte sidecar individually or attach the original PNG to a binary-capable Codex environment and use exact lossless conversion; never replace with a recreated artistic image.
2. Work in `meifeng202309-commits/GAL-Escape-Castle` at `remediation/sprint9-structural-v1`, or CA-authorized staging branch. Unzip and copy ONLY the two files from `assets/staging/prop_linda_watch_back/v003/`, respecting their paths.
3. Commit/push the two exact files without overwriting v001/v002. Verify GitHub nonzero blob and independently recompute its SHA-256 = `ca9a31b2...`; verify sidecar = APPROVED v003 and source hash.
4. Only then separately set `assets/asset-registry.json` **`latest_version = 3`**, preserving `active_version = 1`; verify source branch head and hashes.
5. Return exact commit SHA, path, SHA-256 and approval reference to CA and CD, so CD can include v003 in **one consolidated CA338 release**. Do not deploy until the separate Teacher production authorization gate.

**Binary blocker:** This VA session's GitHub connector `create_blob` accepts explicit base64 text but cannot consume local `/mnt/data` binary file streams, while local container cannot resolve `api.github.com` or use authenticated Git push. That tool limitation blocks only pushing the exact bytes; source fidelity, image conversion, metadata preparation and ZIP verification **are complete**.

**Owner:** CA/CD to coordinate a binary-capable executor/transport and verify; VA remains available for bounded image integrity clarification. The letter is the required precise-blocker technical handoff under CA's instructions, not a successful staging handoff.
