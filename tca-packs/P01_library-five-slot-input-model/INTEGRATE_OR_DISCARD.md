# Integrate or discard P01

**CD remains FROZEN.** Only a future CA-released CD may decide.

1. Verify `src/game/app.js` is still blob `c6d049dececb16af386418253d5dc55103f935a0` or inspect exact semantic drift; verify five-digit and server prefix/RPC invariants.
2. The `integration.patch` is intentionally **not applied**. It demonstrates adding an ESM import, replacing existing renderer dimensions with the model, and preventing incomplete client composition before the pre-existing submit RPC.
3. If CD selects INTEGRATE, then carefully apply/adapt the patch to the current source. **Correction:** the patch already creates `src/game/library-code-model.mjs`; do not duplicate the module during integration. Keep existing RPC/request-id/error/server logic.
4. Run the included unit tests, JS syntax checks, and normal ACT3 five-digit/locked-prefix browser and authoritative RPC regressions. Only CD plus CA can verify runtime integration.
5. DISCARD if source/interface drift is material, server contract changes, equivalent logic exists, or adaptation costs as much as rewriting. No dependence on this draft is mandatory.

Note: the patch keeps the current single suffix `input` field; it is not itself the full five-wheel visual redesign. If an actual five-element input UI is required, CD must perform that separately within an authorized F5/F9 release, not silently enlarge this Pack.

Integration caveats noted by CA: the patch retains one text input rather than rendering five visible wheels; incomplete input returns silently; invalid input can throw `TypeError` outside the existing RPC `try/catch`. CD must assess these during an authorized integration rather than treating this draft as a complete UI/exception-handling implementation.
