# Teacher V5 P0 module repair release evidence

Date: 2026-11-05

Owner: CD

Authority: `agent-comms/CA_to_CD_20261105T_p0_missing_module_and_show_button.md`

## Disposition

PASS. The approved one-file Pages repair restored the missing Teacher static-module dependency. Create Room, Teacher Token Show/Hide, and Player Join passed against the canonical public site. The disposable fixture was removed and has zero residual room rows.

## Exact release

- previous Pages head: `61fbb08291ccf1796a9051c5f61264bf43870157`
- recovery ref: `safety/pages-before-p0-module-repair-20261105` -> `61fbb08291ccf1796a9051c5f61264bf43870157`
- repaired Pages head: `a2e54cabcaf43f588d83069ecb736fe1138753d6`
- only tree delta: add `src/trace/performance-trace.js`
- Git blob: `e82c1e5c3c1fca01381d156069d15fe1561ec547`
- bytes: `5580`
- SHA-256: `96aec16c859863342cf03803fcc97a156901514f7b0118109219f5fea72b2739`

All other released frontend files and the production database were preserved.

## Deployment and canonical public byte

GitHub Pages run [42050447318](https://github.com/meifeng202309-commits/GAL-Escape-Castle/actions/runs/42050447318) completed `success`, attempt 1, against exact head `a2e54cabcaf43f588d83069ecb736fe1138753d6`.

The canonical URL `https://meifeng202309-commits.github.io/GAL-Escape-Castle/src/trace/performance-trace.js` returned:

- HTTP 200
- `application/javascript; charset=utf-8`
- 5580 bytes
- SHA-256 exactly `96aec16c859863342cf03803fcc97a156901514f7b0118109219f5fea72b2739`
- `Cache-Control: max-age=600`

No query-parameter or cache-busting substitute was used for the canonical-byte receipt.

## Public browser regression

On the canonical public Teacher page:

1. Teacher Token initially had input type `password` and button label `Show`.
2. First click changed it to type `text` and label `Hide`.
3. Second click restored type `password` and label `Show`.
4. Create Room with disposable room `P0FIX5X` completed and displayed `Watching room P0FIX5X` plus `0/3 connected`.
5. The canonical Player page joined with the generated Gitte code and displayed `Gitte · P0FIX5X`, `Waiting for formal run`, and `You are connected`.
6. Browser console contained no error or warning entries during these checks.

CD deleted only room `P0FIX5X` using the generated teacher-token hash as an additional predicate. The delete returned that exact room code; post-cleanup count was `0`.

No layout, product logic, SQL schema, grant, migration, or unrelated database work was performed.

NEXT_OWNER: CA
