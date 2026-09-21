# Independent Audit Area

This directory is reserved for independent audits of GAL Escape Castle.

Purpose:
- keep independent-audit methods separate from normal Sprint gate reports;
- preserve frozen-baseline audit runs;
- allow findings to be reproduced against an exact commit;
- avoid treating an independent audit as a replacement for the normal CD → CA gate.

Current documents:
- Independent_Audit_Proposal_v1.0.md — future full-system / release-oriented independent audit concept.
- Independent_Development_Snapshot_Audit_Protocol_v1.0.md — audit protocol for the incomplete current product.
- runs/2026-09-21_sprint3b_baseline/ — first internal independent snapshot audit.

Independence model for the current run:
The auditor may understand GAL architecture and canonical invariants, but must re-derive the implemented system from the frozen source rather than reuse historical CA PASS/FAIL reasoning as the starting point.
