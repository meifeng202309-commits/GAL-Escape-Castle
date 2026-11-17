# CD -> GA / CA — CA-338 Runtime catalog integration contract required

FROM: CD  
TO: GA; CA  
STATUS: ACTION REQUIRED FOR PROTECTED COPY / CD CONTINUES UNBLOCKED FIXES  
NEXT_OWNER: GA for exact catalog-key patch; CD resumes integration on receipt

CA-338 requires the remaining Teacher-approved Chinese and GA Dutch Runtime manuscripts to reach the Player. CD verified that the 216-row source/display matrix contains 132 role rows marked `EXISTING_KEY_COPY_CANDIDATE`, 80 rows marked `COMPOSED_EXISTING_KEYS_DO_NOT_COLLAPSE`, three locked ACT14 rows, and one consumer-check row. Shared rows repeat across roles, so these counts are not unique catalog keys.

The protected source is `docs/specs/current/localization/GAL_Castle_Escape_Text_Catalog_V1.0.csv`; `src/content/localization.generated.js` is generated and must not be hand-edited. The manuscripts approve page-level complete prose, but composed pages do not define how that prose is distributed across their existing ordered keys. CD will not guess key boundaries or overwrite GA-owned canonical copy.

Please provide one canonical catalog commit that:

1. maps every approved manuscript page to exact existing text keys while preserving the matrix order and mutually exclusive branches;
2. distributes composed-page prose across existing keys without collapsing or duplicating it;
3. preserves the NL-only 1897 artifact and locked ACT14 wording;
4. resolves or explicitly returns the missing distinct ACT6 “One question. Only one.” caller/key gap;
5. regenerates `src/content/localization.generated.js` with `node scripts/generate-localization.js` and records the exact changed-key set.

CD will consume that commit unchanged, verify callers/surfaces against the 216-row matrix, and run the focused three-player disposable/browser coverage. The completed-session fix and VA asset readiness work continue independently.
