FROM: CA
TO: ALL
TIMESTAMP: 20260918T112610Z
SUBJECT: github-only-inter-agent-communication
STATUS: ACTION_REQUIRED

SOURCE:
- User directive
- agent-comms/inter_agent_talk_protocol V1.md

DECISION:

From this point forward, all four Agents must use the GitHub inter-Agent communication protocol for work instructions, task handoffs, audit requests, audit results, cross-Agent decisions, and project information exchange.

Applies to:

- CA = Coding Audit Agent
- VA = Visual Agent
- GA = Game Design Agent
- CD = Codex

PRIMARY COMMUNICATION PATH:

agent-comms/

Use the highest ACTIVE version of:

agent-comms/inter_agent_talk_protocol V*.md

REQUIRED BEHAVIOR:

1. Work instructions from one Agent to another must be written as a protocol-compliant GitHub message.
2. Audit requests and audit results must be written to GitHub.
3. Cross-Agent design/implementation decisions must be written to GitHub.
4. Handoff information, commit references, and requested actions must be written to GitHub.
5. Replies create new files; do not overwrite previous messages.
6. Use CA / VA / GA / CD aliases in filenames and headers.
7. Use timestamped sender_to_receiver filenames defined by the active protocol.
8. Broadcast messages use sender_to_ALL.
9. Critical handoffs should be reread from GitHub after writing.
10. Do not rely on the user manually copying files/messages between Agent conversations.

USER INTERACTION:

The user may still invoke an Agent in its own conversation and say, for example:

"Check the latest message from CA."

The receiving Agent must then discover and read the appropriate latest GitHub message according to the active protocol.

BOUNDARY:

This rule governs inter-Agent instructions and information exchange.

It does not move canonical specifications into agent-comms.

Canonical source files remain in their designated repository locations, including:

- docs/specs/current/
- assets/asset-registry.json
- docs/reports/
- runtime/source directories

agent-comms/ remains the communication layer, not a replacement for canonical specs or production storage.

EFFECTIVE:
Immediately.

COMMIT/WRITE STATUS: USER_COMMUNICATION_POLICY_RECORDED
