# Trial 8 supervised Chrome DevTools network capture guide

Authority: `CA_to_CD_devtools_plan_20261030.md`. Use this during the next **natural supervised test** for one Player; Teacher capture is optional. Do not add actions, repeat clicks, throttle the network, disable cache, enable custom GAL tracing, change product/database state beyond normal play, or deploy anything for this capture.

## Before the target interaction

1. Join normally, then open Chrome DevTools (`F12` or `Ctrl+Shift+I`) and select **Network**. Open it before the interaction, but after unrelated login/join setup where practical.
2. Confirm the round Record button is red. Check **Preserve log**. Leave **Disable cache** unchecked and leave Network throttling at **No throttling**.
3. Select **Fetch/XHR** and filter `rest/v1/rpc/`. Clear the Network list once the Player is stable and ready for the next normal action.
4. Start a local note with pseudonymous role only, for example `Player-A`; do not write names, room/join codes, tokens, clue text, message text or vote/choice content.

## During the natural interaction

Do not change the way the game is played. Record these wall-clock observations with timezone or UTC:

- Player input dispatched: what kind of control only (`button`, `Send`, `Continue`), not its private value.
- Teacher gate opened, if this interaction waits for one.
- Next expected Action became visibly usable, or the exact visible error category/status.
- Any tab switch, minimize, offline event or reload. `Preserve log` keeps requests across reloads, but the event still needs to be noted.

Keep capture running from about 30 seconds before the action until the next Action is visible or an error occurs, plus about 10 seconds. For an optional Teacher capture, use the same settings and record only the corresponding gate window.

## Inspect the relevant RPC sequence

For the mutation and following projection RPCs, retain only this metadata:

| Area | Safe fields to record | Meaning and limit |
|---|---|---|
| Request row | RPC path/name, method, start UTC, status, duration, Initiator | Status `4xx/5xx/(failed)` is an error fact; it is not automatically a latency cause. |
| **Timing** tab | Queueing, Stalled, DNS, Initial connection, SSL, Request sent, Waiting for server response/TTFB, Content download | TTFB combines client network, CDN/gateway and upstream work. It is not pure database time. |
| Response headers, if present | `date`, `cf-ray`, `sb-request-id`, `sb-gateway-version`, `x-envoy-upstream-service-time`, `x-kong-proxy-latency`, `x-kong-upstream-latency` | Missing headers are recorded as missing. Do not estimate a missing value. IDs correlate browser evidence with Supabase gateway logs. |
| Visible result | noted Player/Teacher wall time and whether the next Action was usable | Browser click and visible times are observational unless a DevTools Performance trace separately provides precise marks. |

Do not copy request payloads, Response/Preview bodies, full URLs with query values, or **Copy as cURL/fetch/PowerShell**. Those representations can contain credentials and private game data.

## Distinguish the wait

- **Human/Teacher wait:** no required gate/action has occurred yet. Keep it separate from transport time.
- **Client scheduling:** a known input precedes request start, or Network shows Queueing/Stalled. A tab visibility/minimize event must be reported rather than inferred.
- **Gateway/network/server-response wait:** request has started and TTFB is long. Use request IDs and safe response headers to correlate with Supabase; do not call TTFB “database time.”
- **Client refresh/render wait:** relevant responses have completed, but the next usable Action appears later.
- **Participant barrier:** other required Players have not completed. Report it as a barrier, not an RPC delay.

## Export without exposing game data

Chrome's default **sanitized HAR** removes `Cookie`, `Set-Cookie` and `Authorization`, but it can still retain `apikey`, POST bodies, response bodies, room/player identifiers, session tokens, messages, codes, votes and private clues. Therefore **never publish, commit, email or upload an unreviewed HAR**, including one labelled sanitized.

1. Stop Network recording (`Ctrl+E` with Network focused).
2. Keep the `rest/v1/rpc/` filter. Right-click a listed request and choose **Copy → Save all listed as HAR (sanitized)**. Never enable “Allow to generate HAR with sensitive data” and never select “with sensitive data.”
3. Keep the original only on the supervised test device. Make a copy for review.
4. In the review copy, remove request `postData`, response `content.text`, cookies and any header/value containing `authorization`, `apikey`, `p_session_token`, `p_teacher_token`, `token`, `session`, `join_code`, `room_code`, `p_code`, `message`, `clue`, `choice`, `vote`, names or free text. Search case-insensitively for each term after editing.
5. Re-import the redacted copy into DevTools. Confirm the relevant request rows, status, Timing and safe correlation headers remain, while payload/response/private values do not.
6. Name it with role and UTC only, for example `player-a-network-20261031T090000Z.redacted.har`. The audit package is the redacted HAR plus the compact evidence table below. Do not commit the original.

## Evidence table to return

| Role | Input UTC | Teacher gate UTC | Mutation RPC/status/start/duration/TTFB | Projection RPC statuses and durations | Safe request/Ray IDs | Next Action visible UTC | Visibility/network/error note |
|---|---|---|---|---|---|---|---|
| Player-A | | | | | | | |

Official references: [Chrome Network reference and sanitized HAR export](https://developer.chrome.com/docs/devtools/network/reference/), [Supabase gateway log fields](https://supabase.com/docs/guides/observability/log-field-reference), [Supabase API Gateway and PostgREST reports](https://supabase.com/docs/guides/observability/reports).
