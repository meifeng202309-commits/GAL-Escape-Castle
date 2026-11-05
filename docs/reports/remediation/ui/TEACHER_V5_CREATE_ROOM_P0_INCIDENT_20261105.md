# Teacher V5 Create Room P0 incident diagnosis

Date: 2026-11-05

Owner: CD

Authority: `agent-comms/CA_to_CD_20261105_teacher_create_room_p0_live_failure.md`

## Disposition

ROOT CAUSE CONFIRMED; production repair awaiting CA approval.

The released Teacher entrypoint statically imports `../trace/performance-trace.js`, but Pages commit `61fbb08291ccf1796a9051c5f61264bf43870157` does not contain `src/trace/performance-trace.js`. The browser therefore fails module linking before `teacher-console.js` installs any button listeners. Create Room remains visually inert and sends no RPC.

This is a release-artifact dependency-closure defect, not a join-code validation, CORS, API-key, migration074, grant, or `s1_create_room` schema defect.

## Reproduction evidence

On the canonical public Teacher page, CD entered generated disposable values and clicked Create Room. Across immediate, 50 ms, 250 ms, and 1000 ms samples:

- button text remained `Create room`;
- button remained enabled;
- `#teacherStatus` remained empty;
- no room `P0D1105X` was created.

The production Git tree comparison is decisive:

- Pages `61fbb082...` contains `src/supabase/client.js`, `src/supabase/config.js`, and `src/utils/html.js`;
- Pages `61fbb082...` does **not** contain `src/trace/performance-trace.js`;
- validated source `f08c04a...` contains the dependency;
- the missing dependency originated in source commit `0a81276`.

The focused regression test recursively traverses relative static imports from `src/teacher/teacher-console.js`. It reproduces exactly one missing module at the incident Pages ref and a complete five-module closure at the validated source ref.

## Direct API control

Using repository-configured public Supabase credentials and generated disposable values, a direct POST to `/rest/v1/rpc/s1_create_room` returned HTTP 200:

```json
{"ok": true, "room_code": "P0API5X"}
```

CD then deleted only that exact fixture using both room code and the generated teacher-token hash as the predicate. A final query showed zero residual `P0API5X` or browser-attempt `P0D1105X` rooms.

## Minimal repair envelope

No product logic or database change is needed. The minimal production repair is a one-file additive Pages deployment:

- path: `src/trace/performance-trace.js`
- source: `f08c04a8b7f0d4e4af3d04a3d0bfd03e22f174d2`
- Git blob: `e82c1e5c3c1fca01381d156069d15fe1561ec547`
- bytes: `5580`
- SHA-256: `96aec16c859863342cf03803fcc97a156901514f7b0118109219f5fea72b2739`

The repair must preserve the current three released frontend blobs and migration074. Before production mutation, require CA approval, exact deploy-tree module-closure PASS, recovery ref verification, Pages success, canonical public byte match for the added module, and a disposable Create Room/Player join smoke followed by cleanup of only the new fixture.

## Tests

- `node tests/teacher-v5-pages-module-closure.test.mjs` — PASS
- `node tests/teacher-console-v5-static-check.js` — PASS
- `node tests/teacher-v5-option-b-static-check.js` — PASS
- existing browser suite launch — environment BLOCKED waiting for local CDP `DevToolsActivePort`; canonical public browser reproduction above supplied the incident behavior evidence

No Pages, SQL, schema, grant, product runtime, or unrelated layout change was made during diagnosis.

NEXT_OWNER: CA
