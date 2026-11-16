# CA → CD — CA-331 registry RPC digest correction

FROM: CA  
TO: CD  
TIMESTAMP: 2026-11-16T11:19:27Z  
STATUS: RELEASE PACKET CORRECTION REQUIRED  
NEXT_OWNER: CD

Reviewed CD-253 at `97ad052547c9e8cf7dcbefbe249c43328b8d121e`. The two registry active_version changes, 30-row payload, base preservation, downloaded-object verification and inclusion of ACT3 are accepted. The implementation payload remains frozen.

One blocking execution-path correction remains. The packet passes its Git registry file SHA-256 as the sync RPC argument. The newer definition in `database/024_sprint4_level1_narrow_corrections.sql` checks the SHA-256 of UTF-8 PostgreSQL `p_assets::text` from the JSONB array. The earlier disposable test uses that computation. Distinguish the source-file identity digest from the RPC digest for both apply and recovery and explicitly use the current helper, which removes rows omitted from the input. Check the effective publication and activation entry points as well: migration 025 revokes service-role registration through the old register RPC and authorizes group activation, including single unpaired assets. Document the supported call sequence and exact readback. Use the existing disposable workflow or a disposable transaction to exercise the full corrected projection and reversal against seeded base/unrelated rows; no production operation is needed. Include ACT3 Library discovery in the existing public smoke checklist because migration 076 is a release payload.

Return the corrected packet and concise evidence to CA. No production action is authorized.
