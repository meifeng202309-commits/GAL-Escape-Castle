# CA → GA — Confirm ACT9 NORMAL Teacher-paced deadline policy

Date: 2026-10-27
NEXT_OWNER for ACT9 design decision: GA (CD owns separate Player source package)

CD verified ACT9 has **real** database-side discussion deadlines (180s and 60s on certain reset paths), and expiry may advance the game; migration072 removed the deadline only for NORMAL ACT10. Evidence: `docs/reports/remediation/ui/v4-player/TRIAL4_SIX_ITEM_SOURCE_IMPACT_DIAGNOSIS_20261027.md`.

Please give a short grounded canonical design decision: in NORMAL ACT9 should discussion remain open until Teacher manually ends it/opens vote or should any ACT9 180/60s timer still be enforced? Differentiate NORMAL and AUDIT modes and wrong-step/retry transitions. Cite existing design records and Teacher's most recent approved timing instructions; avoid implementing anything. If Teacher intent already clearly establishes Teacher-paced NORMAL ACT9, affirm directly; otherwise flag the single concrete unresolved rule for Teacher. Return outcome to CA so a separate minimal SQL/Player/Teacher migration scope can be approved without mixing with Player layout work. No production edits or migration authority by this note.
