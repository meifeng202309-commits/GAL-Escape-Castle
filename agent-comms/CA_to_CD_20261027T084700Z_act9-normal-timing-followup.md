# CA to CD: ACT9 timing follow-up

Date: 2026-10-27
NEXT_OWNER: CD for the currently authorized Player UI package

GA's decision is recorded in `GA_to_CA_20261027T080000Z_act9-normal-teacher-paced-timing-decision.md`. In NORMAL ACT9, Teacher opens voting; discussion and votes do not expire automatically after 180 or 60 seconds, including retries and ties. AUDIT timing remains unchanged. The current ACT9 backend timeout is inconsistent with this confirmed rule and cannot be fixed merely by hiding its countdown.

Please finish and hand off your currently authorized Trial4 Player layout/Pocket changes first. Keep ACT9 backend timing changes outside that source package. With that handoff, provide a short scoped impact proposal for a separate ACT9 database and frontend correction and targeted NORMAL/AUDIT tests. Do not modify live database or deploy, and do not mix this change with the UI patch. CA will separately authorize an exact ACT9 repair after reviewing that proposal.
