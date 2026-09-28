# Parkour Vibe Coding — 7 Skills + 1 Permanent Habit

## Purpose

The Parkour game is used as one continuously evolving project. Students do not learn Vibe Coding through isolated exercises. Instead, each round introduces one new Vibe Coding skill and applies it to improve the same game.

Three students work independently from the same current official version. They run and verify their own versions, demonstrate them online, compare the results, and vote for the best candidate. The teacher checks the winning version. If accepted, the teacher submits it for publication as the next official version, which becomes the common starting point for the next round.

Git/GitHub operations are not part of the student-facing workflow. Students work locally and send the winning version to the teacher. The teacher controls publication of official versions.

---

## Permanent Habit — Verification

Verification is **not a separate late-stage lesson**. It begins in the first round and is repeated throughout the entire course.

Core loop:

**Run → Test → Compare with the intended result → Fix if necessary**

Before a modification, students should understand what currently works. After a modification, they should check both:

1. whether the intended change works; and
2. whether previously working functions still work.

The sophistication of verification should increase as the game becomes more complex.

---

## Skill 1 — Modify

### Goal
Learn that an existing AI-generated program can be deliberately changed rather than regenerated from scratch.

### Typical Parkour task
Modify visible or easily measurable properties such as:
- colors;
- running speed;
- jump height;
- obstacle frequency.

### Vibe Coding focus
Give AI a clear change request, run the result, observe the effect, and iterate.

---

## Skill 2 — Asset Generation & Integration

### Goal
Learn to combine generated visual assets with generated code.

### Typical Parkour task
Use text-to-image tools to create or improve:
- the runner;
- hurdles/obstacles;
- background scenery;
- other visual elements.

Then integrate those assets into the game.

### Vibe Coding focus
Generating an image is only half of the task. Students must make the asset usable by the program and verify that it loads, scales, and appears correctly.

---

## Skill 3 — Specification

### Goal
Learn that AI produces more consistent results when requirements are explicitly defined.

### Typical Parkour task
Create a small specification or visual bible defining such things as:
- visual style;
- character appearance;
- environment;
- dimensions or proportions;
- naming conventions;
- gameplay constraints that should remain stable.

### Vibe Coding focus
Move from repeatedly correcting AI outputs to controlling outputs through specifications.

---

## Skill 4 — Add a Rule

### Goal
Learn to modify the underlying logic of a game rather than only its appearance.

### Typical Parkour task
Introduce one new gameplay rule, for example:
- coins;
- energy;
- scoring conditions;
- lives;
- another simple state-dependent rule.

### Vibe Coding focus
Describe a rule precisely enough that AI can translate it into program logic, then test edge cases as well as normal play.

---

## Skill 5 — Add a Feature

### Goal
Learn to extend a working system with a larger user-facing capability.

### Typical Parkour task
Add a feature such as:
- shield;
- double jump;
- power-up;
- another meaningful gameplay mechanism.

### Vibe Coding focus
Understand the difference between requesting a feature and specifying how that feature interacts with the existing game.

---

## Skill 6 — Debug

### Goal
Learn to use AI to diagnose problems rather than blindly asking it to rewrite code.

### Core debugging description
Students should communicate at least:

- **Expected:** what should happen.
- **Actual:** what actually happens.
- **Reproduce:** how to make the problem happen again.

### Vibe Coding focus
Provide evidence, reproduce the problem, ask AI to identify likely causes, make a targeted repair, and verify the repair.

---

## Skill 7 — Constrained Change

### Goal
Learn to make substantial changes without damaging parts of the program that already work.

### Typical Parkour task
Request an improvement while explicitly stating both:

- **what must change**, and
- **what must not change**.

### Vibe Coding focus
Control the scope of AI-generated modifications and reduce unintended regressions.

---

## Final Challenge — Improve It Yourself

Students independently decide what the Parkour game should become next.

They should:

1. identify an improvement worth making;
2. explain the intended result;
3. decide which of the previously learned skills are needed;
4. use AI to implement the change;
5. verify the result;
6. demonstrate the result to the group;
7. explain important decisions and problems encountered.

The purpose is not merely to produce the most elaborate game. The challenge is to demonstrate that the student can direct AI through an entire improvement cycle.

---

## Standard Round Workflow

Each skill round follows the same basic cycle:

**Teacher releases Current Version → All students download the same version → Play and understand it → Learn the current Vibe Coding skill → Independently modify locally → Verify → Demonstrate candidates → Vote → Teacher checks winner → Accepted winner becomes the next official version**

Important rules:

- All students start each round from the same official version.
- Students do not need to manage Git branches, pull requests, merges, or repository permissions.
- A candidate must work before it can become the next official version.
- Winning the student vote does not automatically make a version official.
- The teacher makes the final publication decision.
- Once published, the new official version becomes the common starting point for the next round.

---

## Course Structure Summary

| Course element | Main learning focus |
|---|---|
| Permanent Habit | Verification: Run → Test → Compare |
| Skill 1 | Modify |
| Skill 2 | Asset Generation & Integration |
| Skill 3 | Specification |
| Skill 4 | Add a Rule |
| Skill 5 | Add a Feature |
| Skill 6 | Debug |
| Skill 7 | Constrained Change |
| Final Challenge | Independently plan, build, verify, and iterate an improvement |

This document defines the current teaching strategy. Detailed lesson tasks may evolve as the Parkour game itself evolves.
