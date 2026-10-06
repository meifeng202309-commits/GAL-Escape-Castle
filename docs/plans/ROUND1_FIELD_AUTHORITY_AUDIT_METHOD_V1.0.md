# Round-1 Field Authority Audit Method V1.0

Date: 2026-10-06  
Owner: GA  
Status: Teacher-approved working method; architecture analysis only  
Implementation authorization: NONE

## 1. Objective

Determine where each persistent fact is stored and used **before** implementation resumes.

CD must not decide authority ad hoc while coding.

## 2. Evidence layers

### Layer A — Unique field inventory

Every current persistent field receives a permanent identifier:

`table_name#field_sequence`

A global `Fxxxx` identifier is also recorded for sorting/reference.

Column-name equality does not imply semantic equality.

### Layer B — Read/write/reference inventory

For every field, record:
- script path;
- function/method/context;
- line;
- access class;
- confidence.

Mechanical scan distinguishes where possible:
- WRITE;
- READ;
- non-SQL consumer REFERENCE;
- unresolved trigger/client reference.

No semantic conclusion is inferred merely from a textual occurrence.

### Layer C — semantic matching

Review fields in this order:

1. same-name groups;
2. only after those are settled, possible same-meaning/different-name groups.

Every candidate relationship must be classified as:
- `SAME_FACT`;
- `DIFFERENT_FACT`;
- `UNRESOLVED`.

No CD discretion is permitted for `UNRESOLVED`.

## 3. Single Canonical Slot Rule

For fields confirmed as `SAME_FACT`:

> If the fact has a clear first formal persistent creation point during one game run, that storage location can completely represent the fact, and it is not a prototype/cache/log/compatibility artifact, that location is the preferred canonical slot.

Then:
- later normal mutations write back to the canonical slot;
- later duplicate storage must not create an independent truth;
- later consumers read through JOIN / VIEW / server projection / Core Resolver where practical;
- a retained physical duplicate is SUPPORT_ONLY until retirement.

## 4. Exceptions requiring explicit GA/CA decision

The "first formal creation" rule is not automatic when:

1. the earlier field and later field are actually different facts/scopes;
2. the earlier storage cannot represent the complete later fact/provenance;
3. the earlier source is prototype/test/cache/event/compatibility support;
4. two independent formal writers create competing truths;
5. migration to a newer canonical structure is intentionally required.

These cases are architecture decisions and block implementation until resolved.

## 5. Data-lineage use

Data-lineage evidence may record objective relations such as:

- function F reads Field A;
- function F writes Field B;
- SQL explicitly assigns `B = A`;
- trigger T reads/writes a field.

It is **not** an authority decision engine.

If a source relationship requires inference rather than direct code evidence:

`SOURCE_RELATION = UNKNOWN`

Do not guess.

## 6. Current automatic classifications

Allowed automatic conclusions:

- no active dependency found → `DEAD_CANDIDATE` only, never automatic delete;
- explicit copy from an already-approved canonical field → duplicate may be `SUPPORT_ONLY / COPY`;
- append-only event/history representation → `SUPPORT_ONLY / EVIDENCE`;
- confirmed SAME_FACT later duplicate → `SUPPORT_ONLY` once canonical slot is frozen.

Not allowed automatically:

- same column name → SAME_FACT;
- different column name → DIFFERENT_FACT;
- oldest migration field → AUTHORITY;
- newest field → AUTHORITY;
- unique name + single historical writer → final AUTHORITY.

## 7. Required output before authority freeze

For every final fact cluster:

- member Field IDs;
- semantic classification;
- canonical slot;
- first formal creation point;
- current writers;
- current readers;
- later duplicate/support locations;
- migration/normalization requirement if any;
- conflict behavior;
- CA concurrence.

Only then may the Authority Registry be frozen for CD.
