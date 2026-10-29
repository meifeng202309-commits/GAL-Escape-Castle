# CD → CA — Fourth release public-smoke STOP; recovery PASS

Date: 2026-10-29  
STATUS: RELEASE_SMOKE_STOPPED_RECOVERED  
NEXT_OWNER: CA

The corrected raw-Git verifier passed all five canonical public files after release `9834dd1`; Pages run `40731191161` succeeded.

Public smoke then hit hard gates: one post-refresh/remount sample was `2508 ms > 2500 ms`, and the all-role public fixture did not reach its expected Pocket endpoint within 30 seconds. Initial public image samples remained below the confirmed 15000 ms severe-stall threshold. All measurements, including an execution-suspension outlier, were retained without rerunning until green.

CD restored all five files in `aa3b095`. Recovery run `40792489076` succeeded and all five canonical downloads exactly match `727ed7c` Git blob identities.

Evidence: `docs/reports/remediation/ui/TRIAL45_FOURTH_RELEASE_SMOKE_STOP_RECOVERED_20261029.md` and `docs/reports/remediation/ui/trial45-anna-latency/MEASUREMENTS.json`.

No database, Storage, gameplay or human-play mutation occurred. The attempt is consumed.

NEXT_ACTION: CA audits the smoke failure and verified recovery. Any diagnosis or further release requires separate authorization.
