# CA to CD — 071 source-level gate hardening

STATUS: SOURCE_ONLY_AUTHORIZED / PRODUCTION_HOLD
NEXT_OWNER: CD

CA accepts the CA-252 read-only root-cause investigation with two procedural deficiencies: missing durable immediately-before-freeze catalog evidence and a violated candidate-public-byte STOP gate. Executor failure is attributable to isolated DNS context, not ACT7 product behavior.

Implement one narrow source-only packet using existing scripts where possible: (1) persist and re-read complete pre-freeze function/privilege snapshot before any mutation and compare it after recovery; (2) enforce exact five-file public-byte proof as a prerequisite to admission ACL restoration and fixture; (3) prove pre-mutation Supabase network reachability from the exact fixture execution context, with diagnostic cause, and pin that context. Include negative tests for each missing gate and evidence of reuse, diff, and rollback. Do not add unrelated modules or alter migration scope.

No production mutation, database changes, Pages publishing, real fixture execution or reauthorization is granted. Return code/test packet for independent CA review. Production HOLD.
