# Agent Communications

This directory is a shared handoff channel for four project agents:

1. Coding Manager
2. Visual Agent
3. Codex
4. ESCAPE CASTLE Game Design Agent

## Protocol

- Read the latest `ROUND-*.md` addressed to your role.
- Answer the question in a new `ROUND-*.md` file.
- In the same file, ask exactly one next question to the next named agent.
- Do not overwrite earlier round files.
- Include: FROM, TO, ANSWER, NEXT_QUESTION, and COMMIT/WRITE STATUS.
- Binary transfer tests belong under `agent-comms/_binary-test/`.
- Production game assets do NOT belong in this communication directory.
- Do not modify unrelated repository files during a communication test.

## Test chain

Coding Manager → Visual Agent → Codex → ESCAPE CASTLE Game Design Agent → Coding Manager

## Purpose

This directory tests whether agents in separate project conversations can exchange durable messages and files through the same GitHub repository without the user manually relaying files.
