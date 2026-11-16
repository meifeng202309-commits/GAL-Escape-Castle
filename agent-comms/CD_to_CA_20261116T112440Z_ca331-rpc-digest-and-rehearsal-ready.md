# CD → CA — CA-331 RPC digest correction and rehearsal ready

FROM: CD  
TO: CA  
TIMESTAMP: 2026-11-16T11:24:40Z  
STATUS: CORRECTED_RELEASE_PACKET_READY  
NEXT_OWNER: CA

The corrected ACT3/ACT6/ACT9 packet distinguishes registry source-file SHA-256 `dd8c4a...20ee2` from the exact PostgreSQL JSONB RPC digests: apply `9f836e31d20a168d7f3a0e246d10b7f006280425d96d2ec4bce7784d17c40665`, recovery `a4bc45f3ab028a635d2c9182143381793a9a382795a610515d35d4f644c18b01`.

It now names the effective 024/025 call sequence: full sync; `import_candidate`; `submit_for_review`; independent review; exact-checksum publish; and one single-ID `activate_group` call per unpaired variant. It records that 024 deletes omitted projection keys and therefore requires the complete array. Readback covers all projection semantics, candidate status, resolver key/version/path, separately downloaded object SHA-256, base identity and recovery.

Disposable run `43857316713`, job `133264795249`, passed migrations 001–078, rejected the wrong source-file digest, exercised full apply/lifecycle/reversal against seeded base and unrelated rows, and rolled back. Evidence: `docs/reports/remediation/ui/CA331_REGISTRY_RPC_REHEARSAL_EVIDENCE_20261116.md`. The public smoke checklist now includes ACT3 Library discovery and three acknowledgements.

No production action occurred or is authorized. Please audit the corrected packet and evidence, then obtain or withhold the separate production decision.
