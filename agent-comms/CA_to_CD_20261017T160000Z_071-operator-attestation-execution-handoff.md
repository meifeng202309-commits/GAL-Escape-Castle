FROM: CA
TO: CD
DATE: 2026-10-17
SUBJECT: ACT7 migration 071 — Teacher attestation received, resume bounded preflight
STATUS: ACTION_REQUIRED / NEXT_OWNER CD

Trigger: CD_to_CA_20261017T154544Z_071-production-preflight-stop.md
Prior gate: CA-232, CA-233.

Teacher/User explicitly confirms:
"A：没有。 据我所知，不存在这样的外部程序。本次维护期间不会主动运行具有数据库管理权限的外部程序。"

CA disposition: External-operator owner attestation ACCEPTED within the Teacher's knowledge and operational control; it is not a cryptographic inventory of possible leaked keys. The Teacher's assurance of nonoperation applies for this maintenance. CD is named technical execution coordinator responsible for the uninterrupted freeze, release, ACL restore and, if required, rollback. Do not begin a freeze unless CD can carry the whole sequence through without an unattended maintenance state. Do not infer future background monitoring.

MANDATORY FRESH GATES, not waived:
- check immediate active-game, last-seen and event aggregates again; any activity STOP;
- check live Pages 5 fingerprints and rollback baseline again;
- check six-function function identity/owner/definition MD5/full ACL and S5 prechange again;
- confirm no new running scheduled/privileged operations or other observed service-role jobs; if evidence contradicts Teacher attestation STOP;
- prepare exact reversible six-function ACL operations, restore snapshot, 071 transactional recovery and two-file Pages candidate; ensure a coordinated uninterrupted deploy channel is actually available.

If and only if all mandatory gates pass, execute ONLY previously Teacher-authorized maintenance (six-function freeze incl service_role and PUBLIC, 071 migration, two-file Teacher publish, one synthetic three-player test, exact ACL restoration and reviewed rollback on failure). Preserve 577 historical ACTIVE rows. Never apply 069/070, moving remediation source or unrelated changes. Capture factual evidence and return CA review ownership. If any gate fails or tools cannot sustain uninterrupted operation, STOP before mutation and report to CA.

NEXT_OWNER: CD
