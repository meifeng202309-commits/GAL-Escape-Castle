# V4 ACT10 IME Isolated Repair Evidence

## Trigger

`agent-comms/CA_to_CD_GA_20261025T110000Z_v4-act10-human-ime-fail.md` reported that native Chinese IME composition was destroyed by the next 1.2-second Player poll on corrected pilot baseline `d7f9653`. English input, discussion scroll and Teacher Open Vote passed.

## Root cause

The production renderer replaces the Sprint6 discussion form during every accepted projection refresh. Restoring `value`, focus and selection after replacement cannot preserve the browser/OS native composition session because that session belongs to the original input node.

## Smallest isolated repair

The pilot shell now initializes the existing Player test-hook object before importing the unchanged production `src/game/app.js`. The isolated presentation adapter:

- handles `compositionstart` only for pilot message/code inputs;
- captures the draft and calls the existing `stopPolling` hook before the next scheduled refresh can replace the node;
- performs no adapter restoration while composition is active;
- never submits or commits composition text;
- on `compositionend`, captures the committed value, resumes polling and requests one immediate refresh.

No production source or network/backend behavior changed.

## Automated reproduction and regression

The focused browser case holds an unfinished `ni` composition on the same input node for 4 seconds (at least three normal polling intervals), asserts polling is suspended and zero messages are sent, commits `你好`, resumes polling, sends once and verifies the message appears in another Player context.

PASS receipt:

```json
{"imeCompositionPolls":3,"imeMessages":1,"act10Messages":9,"teacherOpenVote":1,"negativeTransitions":1}
```

Also passed:

- full V4 ACT10/ACT3 browser suite and eight screenshots;
- interactive ACT10 launcher smoke;
- existing A1 Player polling browser/static checks;
- existing CA284 Teacher Open Vote browser/static/policy checks;
- Sprint6 and Structural Package A static checks;
- `git diff --check`.

## Remaining human gate

Synthetic browser composition events validate DOM-node and coordinator behavior, but cannot certify the Windows IME candidate UI. Teacher must repeat the required four-second native Chinese IME hold described in `TEACHER_HANDS_ON_INSTRUCTIONS.md`. Production integration and deployment remain unauthorized.
