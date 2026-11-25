# CA-343 / CA-338 consolidated release-readiness packet

Status: PREPARED FOR CA FOCUSED CHECK — PRODUCTION NOT AUTHORIZED
Owner after this packet: CA

## CA-348 final candidate addendum (2026-11-23)

The GA owner gap described in the original packet is now resolved by GA-151/GA-152 and CD candidate `e17c243a77fa2364e8dc9e41e7bfa98d587de4a3`. The exact coherent Player Pages payload is now these **four changed files**, published together with the repository's unchanged transitive modules:

| Changed file | SHA-256 |
|---|---|
| `src/game/app.js` | `555cae01ceafdce2b9b1aac32e37c46c20a9ac2aea080e3b512a429fc4b92001` |
| `src/styles/app.css` | `1c1b5630c945fc2cd97a453145ea48fa746545ce22156934c9648b23e0c27c05` |
| `src/content/localization.generated.js` | `e3508548c3ed6b1c0348a3a3dae5ce8bb138a3282536924a89e4ec85d10c0ae5` |
| `src/content/runtime-page-text.generated.js` | `b0a98399c4ad0f01014a5050c31f2f06e07fbc97437ec8f79c528cdc11cd1c77` |

The existing recursive module-closure gate traverses ten Player modules from `src/game/app.js`, explicitly includes the new Runtime module, and reports zero missing dependencies. Production is currently through migration 078; additive migration `079_ca347_runtime_consumer_integration.sql` must be applied and verified before this Pages payload. This addendum does not authorize or perform either production operation.

GA-152 provides exact owner copy for 92 Page-ID appearances; GA-151 supplies the protected catalog additions. The old Runtime-owner blocker below is retained as historical packet context and is superseded by this addendum.

On 2026-11-25 Teacher approved immutable Linda watch-back v003 (Option C), superseding the disputed v002 for this release. CD staged the exact VA-prepared 872×1125 lossless WebP (`ca9a31b2bd7b880f88b4dfabcfcb5d973b4c19a3dc9d482796afa60b83320469`, 1,060,604 bytes) with its APPROVED sidecar. Registry source now records latest v3 while preserving active v1. The coherent visual candidate set is therefore nine images; v001 and v002 remain immutable history.

## 1. Exact source baseline

The Player implementation baseline is `48567890fcb7ab53404c73bac89ab0f42ad0e6e1`; later commits through this packet add only tests, evidence and coordination records. Current deployable file hashes are:

| File | SHA-256 | Status |
|---|---|---|
| `src/game/app.js` | `bdfa1b4a683ece8172c1c5b95a0de8bbfd2c3b9cc97dbad484fb2bcf07e22f97` | CA-338 replay/Main Gate and CA-341 Library mapping implemented and browser-tested |
| `src/styles/app.css` | `15d4ec18eaa945ff3a52d20d10a48bf1ef04a3dbef6f2b98b0d946ed623f01c6` | Main Gate/finale support implemented |
| `src/content/localization.generated.js` | `1a6c612511e316ea0e4b4d46dfb13c11bb48e9d86c62320496e62c1cc88fdbb7` | Current partial canonical output only; not the outstanding 216-page GA completion |

No migration beyond production 078 is required by the ready visual/source subset. Pages publication must use one coherent reviewed three-file payload; it must not silently present the current generated localization as full manuscript completion.

## 2. Ready approved visual set

All existing-key callers are version-independent. Main Gate v003 and Library ajar have targeted source/browser coverage. These nine candidates can be grouped into one bounded visual release after CA/Teacher authorization:

| Asset/version | Exact SHA-256 | Current registry | Required production outcome |
|---|---|---|---|
| `prop_gitte_castle_map` v002 | `428ec257d67493b30f5821ae3b56e3b63840b587a1242f0eb9c07248a8623f83` | latest 2 / active 1 | publish and activate v2 |
| `prop_gitte_number_note_front` v002 | `4ce14eff58783665f6fcbe5626fc8afe62b87b1a1d8a38f261161b2be88402` | latest 2 / active 1 | publish and activate v2 |
| `prop_gitte_number_note_back` v002 | `61a57c7937444bca85c2a1a0e3def5213f480c612dbd9214553322a3402e7fd0` | latest 2 / active 1 | publish and activate v2 |
| `prop_anna_diary_open` v002 | `c4373391c48cadce8cb1baca1019466e603618a3d0c76bd2558629ce39f2cc37` | latest 2 / active 1 | publish and activate v2 |
| `prop_linda_closure_order` v002 | `c1b3b9dc7f8b3d39f18de0e5306fd42be592b2aed7efae5484a2a2788b9a06fd` | latest 2 / active 1 | publish and activate v2 |
| `prop.library_clock_clue_note` v002 | `5f4998c57e51a147b414714860307785230276bae41c49e951c2a42c581f8f93` | latest 2 / active 1 | publish and activate v2 |
| `shared.main_gate` v003 | `f68ea8c1f86a1fa3345fbb2e7842fd34e8e66c1256d71030c993366ea5068de4` | latest 3 / active 2 | publish and activate v3; use v3 embedded-label behavior |
| `shared.library.hidden_door_ajar` v001 | `44592196fbc7462b9d00345262b44e7316cde88334ec29af0c6d906a828e419a` | absent | add immutable 31st identity, publish/activate v1 |
| `prop_linda_watch_back` v003 | `ca9a31b2bd7b880f88b4dfabcfcb5d973b4c19a3dc9d482796afa60b83320469` | latest 3 / active 1 | publish and activate v3 only under final release authority; retain v001/v002 |

ACT9 `shared.great_hall.red_first` and `shared.great_hall.both_open` remain active v1 and unchanged. Blue-first remains deferred. Original `shared.library` remains active v2. All six authorized audio identities and versions must remain unchanged.

## 3. Owner-blocked items

### Runtime manuscript

The 216-row matrix contains 132 role rows marked `EXISTING_KEY_COPY_CANDIDATE`, 80 `COMPOSED_EXISTING_KEYS_DO_NOT_COLLAPSE`, three `LOCKED_ACT14_NO_COPY_CHANGE_WITHOUT_OWNER`, and one `REMOVE_DEVICE_DISCOVERY_AFTER_CONSUMER_CHECK`. The concrete visible examples still include GITTE-002 map consequence, ANNA-002 diary consequence and ACT2 weak-signal/call guidance. Page-level CN/NL manuscripts do not authorize CD to invent the exact split across composed existing keys.

GA still owns the requested protected catalog/key-split commit, the distinct ACT6 utterance disposition, and regeneration of `src/content/localization.generated.js`. Until that owner-first commit arrives, the Runtime manuscript portion is **not release-ready**.

### Linda watch back

The v002 checksum mismatch remains preserved as historical evidence and v002 must not be activated. Teacher resolved the release choice through Option C: immutable v003 is the approved candidate listed above. No v001/v002 file was overwritten.

## 4. Deployable apply and recovery sequence

1. Fresh preflight: require production migrations through 078, expected Pages head, no active trial rooms/runs, exact current 30-row registry, original Library v2, ACT9 variants and all six audio resolver/object hashes unchanged. Any drift stops the release.
2. Verify every local WebP against the table and sidecar. Upload the nine ready objects to unique versioned `game-assets/<asset-key>/vNNN/` paths without overwriting existing objects.
3. Download/read back each public Storage URL and require byte-for-byte SHA-256 equality before registry activation.
4. Build an exact 31-row planned registry projection: preserve every unrelated row and six audio activations; activate the eight existing-key successors (including watch v003); add `shared.library.hidden_door_ajar` latest/active v1.
5. Import each candidate, submit for review, record independent APPROVED review, mark the verified unique Storage path published, then activate each unpaired identity separately. Re-read candidates, projection and resolver paths/versions; download and hash resolved objects again.
6. After migration079 verification, publish the exact reviewed four-file changed Player Pages payload in the CA-348 addendum with its complete unchanged transitive module tree. Public smoke must cover first Join, completed-run replay/switch, original Library before resolution, ajar only after resolved Inspect First and after reconnect, Main Gate v003 A/B/C/WATCHER controls, all changed props and preserved ACT9/audio.
7. Recovery keeps all uploaded immutable objects and candidate records. Restore the eight existing keys to their prior active versions, including Main Gate v2 and watch v1, and retain the 31st ajar registry identity with `active_version=null`. Restore the prior Pages head. Re-resolve and re-hash original Library, ACT9 and six audio.

Disposable proof `45104960594` validates the ajar 31-row activation/inactive recovery and preservation invariants; it is not evidence of live upload, URL readability or real-room behavior.

## 5. Minimal realistic grouping and authorization

Preferred coherent trial-oriented release is one CA-reviewed packet containing: GA's owner-authored catalog/generated output; the nine ready visuals above including approved watch v003; migration079; and the four-file Player Pages payload including replay/Main Gate/Library fixes. The disputed watch v002 is excluded and retained only as immutable history. Absence of a final production decision is not authorization.

Actual production Storage upload, registry registration/publication/activation, Pages publication and any rollback require a new explicit Teacher/CA production gate with exact planned/recovery payload digests and the frozen public-smoke checklist. This document performs none of those writes.
