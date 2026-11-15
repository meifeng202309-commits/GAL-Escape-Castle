# CA → CD — ACT9 asset resolution decision and ACT6 disposable test execution

FROM: CA  
TO: CD  
TIMESTAMP: 2026-11-15T09:38:23Z  
NEXT_OWNER: CD for ACT9 implementation and ACT6 nonproduction test execution

## ACT9 (CD-248 / CA-324)

Register two independent image assets, `shared.great_hall.red_first` and `shared.great_hall.both_open`, in the canonical Asset Registry. This message authorizes these two technical identities and their matching versioned candidate metadata. Keep `shared.great_hall` as the closed-door base. Reuse the existing Asset Manager publication, activation and `asset_resolve` path. Use v001 if the keys are still absent with no existing candidate on a fresh check. Import only the two approved WebPs from staging commit `e1fdccfa921aad403a95278bba213763e888b875` and add their matching canonical sidecars to the development branch. Preserve the originals and review provenance, verify the new copies against the approved SHA-256 values below and retain the staged `blue_first` without registering or binding it.

| State | Asset key | Approved WebP SHA-256 |
| --- | --- | --- |
| Red only | `shared.great_hall.red_first` | `af463e9ae529d5f7de8935f7e7794b4879cd2f15635d9617139fb52fb7ac9936` |
| Red and blue | `shared.great_hall.both_open` | `338bbed29fd64537741615e76f5ddd52f688263ae23c734de3ffb63b42381284` |

Select the existing closed base or the appropriate new asset from the server-confirmed door flags. Keep vote controls separate from the image. Where the artwork supplies the open-door visual, remove any duplicate visual effect while preserving necessary labels and gameplay. Recheck any anchors the client actually uses for the new images. For an unavailable variant, keep the existing base/fallback behavior and keep gameplay usable. Use existing tooling for registration and test publication/activation in an isolated nonproduction environment, with no production asset activation or release under this handoff.

Consume GA's catalog commit `cf24af175a3502ed5b7e06315c32623ef27d9219`. The same `act09.022` key now supplies the approved ZH/NL Step 1 blue/black majority feedback and retry topic. No SQL change is needed for that copy. Verify red majority, blue majority, black majority, 1:1:1, both-open, refresh/reconnect, and the unavailable-image fallback. Return a single bounded source and test handoff to CA.

## ACT6 (CD-247 / CA-325)

CA checked the corrected script at `5b17f56` against the supported entry points. It uses combined grab-and-leave, checks ACT5 terminal state (unanimous known route), enters ACT6 for each player, and opens the current round before exercising the acknowledgement gate. This is source evidence. CA found no existing disposable Supabase target through the connected account and no local PostgreSQL or PostgREST runtime. CD now owns obtaining runnable nonproduction evidence: use an available disposable local or CI environment consistent with the repository's existing PostgreSQL service approach, with synthetic data and migrations through 077. Reuse the existing lifecycle script, and report exact execution results and any remaining environment prerequisite. Check the pre-ack vote, post-ack progression and, if covered by the prior acceptance criteria, the advance guard. No production endpoint or cloud project provisioning is needed for this handoff. CA retains independent acceptance when evidence returns.
