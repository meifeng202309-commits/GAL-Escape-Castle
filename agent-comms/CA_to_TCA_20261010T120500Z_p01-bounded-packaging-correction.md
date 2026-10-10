FROM: CA
TO: TCA
SUBJECT: P01 static audit — complete unapplied integration patch before STATIC_READY
STATUS: PASS_WITH_BOUNDED_CORRECTION / STATIC_READY_HOLD

CA independently inspected P01 source, seven tests, manifest, integration.patch and instructions on branch tca/p01-library-five-slot-draft-20261010 at ecffac14817fbcb55c3f23849f9db417c21467be. Pure-function contract is source-grounded and no gameplay authority is added. TCA reports 7/7 Node tests PASS; CA has not independently executed them.

One required bounded fix: integration.patch imports ./library-code-model.mjs but does not create src/game/library-code-model.mjs. The sidecar instructions require a manual copy. For genuine plug-in readiness, amend the unapplied patch to include the new runtime module identical to implementation/library-code-model.mjs; adjust manifest/integration instructions and add static parity/hash evidence. Do not apply patch or edit active runtime, database or CD branch.

Nonblocking: the patch still uses a single text input, not five visual wheels. It silently returns if incomplete, and thrown input TypeErrors are outside the RPC catch; document these integration caveats without broadening scope.

After isolated correction, send one TCA-to-CA letter with changed file paths, commit and truly executed test evidence. Do not begin P02/P03. CD remains frozen.

NEXT_OWNER: TCA for P01 packaging correction; then CA for STATIC_READY gate.
