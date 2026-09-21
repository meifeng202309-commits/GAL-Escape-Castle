# Independent Audit Proposal v1.0

Project: GAL Escape Castle
Status: Proposal / reserved for future use
Version: 1.0

## 1. Purpose

The normal project flow is specification-driven:

    Canonical specifications
    → CD implementation
    → tests / Devil Check
    → CA audit
    → PASS / FAIL / BLOCKED / NOT VERIFIED

That process remains the primary engineering gate.

A second audit should answer a different question:

> What can still fail, desynchronize, lose evidence, fabricate evidence, or behave unexpectedly even when the implementation appears to comply with the specification?

The independent audit supplements rather than replaces CA.

## 2. Independent audit viewpoint

For a mature product or release candidate, an independent auditor should deliberately avoid simply repeating the historical CA reasoning.

Recommended viewpoints:

1. Black-box adversarial audit
   - duplicate input;
   - stale tabs;
   - reconnect during transitions;
   - simultaneous clients;
   - malformed or client-modified requests;
   - Teacher/player races.

2. State-space / invariant audit
   - First Choice LOCK;
   - missing input is never synthesized;
   - Room is not Run;
   - NORMAL is not AUDIT;
   - system/Teacher resolution is not player behavior;
   - real evidence is never silently rewritten.

3. Failure-first audit
   - disconnects;
   - refreshes;
   - lost responses;
   - timeout races;
   - partial failure and recovery.

4. Data-forensics audit
   - reconstruct the real sequence from persisted evidence alone;
   - distinguish player, system, Teacher and technical causes.

5. Reverse-specification audit
   - derive the actual software rules from code first;
   - compare the derived model to canonical specifications afterwards.

6. Mutation audit
   - deliberately weaken key protections in an isolated environment;
   - determine whether the existing tests actually detect the defect.

7. Cross-layer contract audit
   - UI → client → RPC → database → authoritative state → reconnect → Teacher Console.

8. Release-rehearsal audit
   - physical 3-student + Teacher run under realistic classroom failures.

## 3. Independence rule

Initial independent work should normally use:
- current canonical specifications;
- the frozen implementation;
- runtime/setup instructions.

Historical CA reports and CD explanations should be compared only after independent findings are produced.

## 4. Expected finding format

Each finding should include:
- severity;
- reproduction;
- expected vs observed behavior;
- affected file/function;
- violated invariant or risk;
- proposed owner;
- verification condition for closure.

Recommended severities:
CRITICAL / HIGH / MEDIUM / LOW / OBSERVATION.

## 5. When to use this full proposal

Use the full version when a substantial integrated build or release candidate exists.

For the current incomplete product, use Independent Development Snapshot Audit Protocol v1.0 instead.
