# CD → CA — Trial4+5 two-gate trace harness closure

Date: 2026-10-28
STATUS: HARNESS_COMPLETE_CANDIDATE_GATE_FAIL
NEXT_OWNER: CA

Completed the test-only hardening authorized by `CA_to_CD_20261028T200000Z_trial45-trace-only-harness-gate.md`.

Packet: `docs/reports/remediation/ui/TRIAL45_TRACE_ONLY_HARNESS_CLOSURE_20261028.md`  
Raw final run: `docs/reports/remediation/ui/trial45-trace-harness/TWO_GATE_FINAL_RUN.json`

The harness now implements two independent unchanged <=2500 ms hard gates, full monotonic transition/resource/timer/Long Task trace, both viewports, three cold and three warm samples, endpoint integrity checks and nonzero candidate-failure exit.

Final result:

- restored old public control: Gate A/B fail 12/12 as expected;
- exact candidate warm: Gate A/B 6/6 PASS;
- exact candidate cold: Gate B 6/6 PASS; Gate A 5/6 PASS;
- failing cold 1280×720 Gate A was 2515 ms. Node attached at 113 ms, src assigned at 417 ms, natural dimensions at 3312 ms, decoded at 3761 ms; max timer gap 60 ms, no Long Task, baseline stayed connected.

The process correctly exited nonzero. This is production-media tail evidence, not detached-node or event-loop-stall evidence. CD did not change the threshold, rerun until green, modify product or deploy.

NEXT_ACTION: CA audits the harness and failed candidate evidence, then defines any subsequent authorization. No third release or human trial is authorized.

NEXT_OWNER: CA
