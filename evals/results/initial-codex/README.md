# Initial Codex smoke comparison

Date: 2026-10-05. These are two **unedited agent outputs**, one per condition. They are a small integration/behavior check, not evidence of a general improvement.

## Setup

- Codex CLI: `0.160.0`.
- Model reported by the CLI: `gpt-6.1-sol`.
- Reasoning effort reported by the CLI: `none` in both runs.
- Same [task prompt](../../prompt.md), same temporary working directory, fresh ephemeral sessions.
- User configuration ignored, project documents disabled with `project_doc_max_bytes=0`, read-only sandbox.
- No tools were used by either generation. The task supplied all required context.
- Baseline received the task only. The skill condition received `Apply the following coding skill to the task below.`, then the full root `SKILL.md`, then `TASK` and the same task prompt.
- The surrounding Codex system instructions were not controlled or audited. A later native-discovery check showed existing personal coding guidance remained available despite ignoring user configuration and disabling project documents. This is a CLI comparison, not a raw-model experiment with a proven empty instruction environment.
- Correctness checks ran on Node.js `26.5.0`, macOS. CI also runs the saved artifacts on Node.js 22, Linux.

The generation command for each arm was:

```sh
codex exec --ignore-user-config --ephemeral --skip-git-repo-check \
  --sandbox read-only -c project_doc_max_bytes=0 \
  -C <temporary-directory> --output-last-message <candidate.mjs> -
```

The respective prompt was passed through stdin. No model override was supplied; the CLI selected the model recorded above. Pin the same model explicitly if reproducing after defaults change. The skill used here is the version committed with these artifacts; use Git history if the root skill later changes.

## Results

| Candidate | Behavior checks | Observation |
| --- | --- | --- |
| [Baseline](baseline.mjs) | 5/5 passed | Already direct; uses one `Set` for email deduplication. |
| [With Plaincode](with-skill.mjs) | 5/5 passed | Preserves contracts; uses both an array and a `Set` for emails. |

Both preserve zero, surface malformed JSON, keep the notifier interface, preserve transport receiver binding, and calculate paid-order totals correctly.

**No improvement demonstrated.** The baseline is already readable. The skill output introduces separate email-output and deduplication state where the baseline uses one ordered set. That is a concrete reason not to claim the skill always simplifies code. The skill output also uses an early `continue` for unpaid orders; preferring that over the baseline's positive branch is a style judgment.

These observations come from the authoring agent, with labels visible. No blind human review, repeated sampling, statistical analysis, independent agent review, or live Claude run was performed. The test task influenced the initial skill design and is not held out.

The checker was also run against a temporary copy of the reference with `??` changed back to `||`; it correctly rejected that zero-limit regression. That validates one sensitivity of the checker, not the skill's effectiveness.

## Run the checks

From the repository root:

```sh
node evals/check.mjs evals/results/initial-codex/baseline.mjs
node evals/check.mjs evals/results/initial-codex/with-skill.mjs
```

CI replays correctness checks on these saved files. It does not make fresh model calls or measure readability.

## Native Codex discovery check

Separately, `SKILL.md` and `agents/openai.yaml` were copied into `.agents/skills/plaincode/` in a new temporary Git repository. A fresh Codex session was asked to invoke `$plaincode` and review the zero-limit bug without editing files.

The first attempt acknowledged Plaincode but read an existing personal coding skill instead. This did not verify that Plaincode loaded. A second attempt explicitly requested only Plaincode and required reading its discovered `SKILL.md` before the review. The tool trace then showed a successful read of `<temporary-repository>/.agents/skills/plaincode/SKILL.md`, and the response identified the zero-limit bug and suggested `??`. No files were edited. The path here is abbreviated to avoid publishing machine-specific directories.

This confirms repository-level discovery and an explicit load on the tested Codex version. It also demonstrates why an acknowledgment alone is insufficient evidence of skill use. It does not establish automatic activation reliability or verify a live Claude installation.
