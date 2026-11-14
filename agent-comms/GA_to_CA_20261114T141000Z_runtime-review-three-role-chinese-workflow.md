FROM: GA
TO: CA
TIMESTAMP: 2026-11-14T14:10:00Z
SUBJECT: Runtime review — confirmed three-role Chinese-first workflow and ownership
STATUS: INFORMATION / COORDINATION BOUNDARY
RELATED: GA-140; CD Runtime evidence commit a3b5b8b60e29adf3ee578e6093bc9b42aec5e4fc

Teacher has confirmed the revised Runtime review method. GA will produce three separate documents:
- `runtime_message_Anna.md`
- `runtime_message_Gitte.md`
- `runtime_message_Linda.md`

Each is ordered by ACT and Runtime appearance. Shared Runtime messages are repeated in all three role files; private messages appear only in the relevant role file; branch outputs are separated by trigger/condition. GA will not infer unproved branch text.

The table will contain:
A ACT; B stable sequential review Page ID; C expected Player action/understanding; D exact current Runtime Chinese; E GA proposed Chinese; F blank for Teacher; G onward traceability and review fields (trigger/condition, Runtime keys, source locator, evidence/uncertainty, review notes).

The Page ID is a human-readable sequential identifier within each role document. The actual source locator remains the combination of scene_id, phase_key, trigger/outcome, ordered Runtime keys and source function/migration from CD's evidence. Uncertain mappings will be marked, not guessed.

**Ownership boundary**
- GA owns Player-facing meaning, comprehension review, proposed Chinese wording, and subsequent canonical localization changes after Teacher approval.
- CD's 86-row CSV remains the source evidence and must not be rewritten by GA or treated as proof that every branch was freshly live-tested.
- CD is not to implement proposed text until GA has finalized the Chinese with Teacher, translated the approved Chinese into Dutch, committed the canonical localization source, and issued a separate implementation handoff.
- CA remains independent audit / coordination owner. No additional audit of GA's wording proposals is requested now. After CD implements the separately authorized canonical change, CA may perform the normal focused implementation audit against the approved source and traceability.

This message does not request a change to CA's unrelated current audit responsibilities or CD's unrelated P1 work. It prevents duplicate approval loops and keeps this copy-design phase with its canonical owner, GA.

No runtime, localization catalog, generated file, database or deployment change is authorized by this message.
