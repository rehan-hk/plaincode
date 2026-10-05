# Evaluating Plaincode

The goal is **correct code that a maintainer finds easier to understand and change**. Passing tests, fewer lines, fewer files, or a model calling its own output "clean" cannot establish that alone.

## Included smoke test

- [prompt.md](prompt.md): five function contracts, including a real reason to keep an abstraction.
- [check.mjs](check.mjs): executable behavior checks using Node.js built-ins.
- [initial Codex comparison](results/initial-codex/README.md): unedited outputs and the limits of a single pair of runs.

The prompt contains mild pressure to make the code "production-ready" and "easy to extend." Both arms receive the same wording. No prompt demands deliberately bad code. This small, public case can check compliance and regressions; it is not a representative benchmark or a held-out evaluation.

## Reproduce a comparison

1. Use two fresh sessions of the same agent/model with identical settings. Keep repository files, other instructions, tools, and budgets the same. Record what was loaded; existing simplicity skills can affect the baseline.
2. **Baseline:** send `prompt.md` without Plaincode installed, invoked, or included.
3. **With skill:** send the same prompt, preceded by the contents of `SKILL.md` and an instruction to apply it. This tests the instructions. Separately test native installation and explicit invocation when assessing integration.
4. Save each response verbatim as a `.mjs` file. If it contains fences, prose, or invalid code, record that as an output-format failure. Do not repair the candidate before scoring it.
5. Inspect candidate code before executing it. Run unknown candidates in an isolated environment without secrets or network access. The checker imports the module and therefore executes its top-level code.
6. Run `node evals/check.mjs /path/to/candidate.mjs`. Record exit status and output, including failures.
7. Have a reviewer compare anonymously labeled outputs against the rubric below. Preserve their notes before revealing which used the skill.

Repeat across several runs, tasks, and both agents before claiming an improvement. Include feature work and refactoring in real repositories, failure paths, existing conventions, and cases where decomposition is necessary. Keep a held-out set out of skill development. Publish failures and ties as well as wins.

## Review rubric

Correctness is a gate: do not prefer a readable implementation that drops a requirement. For candidates that satisfy the contract, record **A / B / tie** for each dimension with concrete code evidence:

| Dimension | What to inspect |
| --- | --- |
| Reading effort | Can a maintainer trace the behavior without avoidable jumps or decoding dense expressions? |
| Names and data flow | Do names expose meaning and units? Are state changes and side effects visible? |
| Necessary structure | Does each layer or option serve an existing requirement? Are useful boundaries retained? |
| Failure behavior | Are expected recovery and actual failures distinguishable? |
| Scope | Does the solution satisfy the task without unrelated features or cleanup? |

Do not mechanically penalize a helper, class, dependency, or extra line. Their usefulness depends on the task. Do not collapse these judgments into a made-up "slop score."

## Limits of the checker

It exercises filtering, defaults, real file reads and malformed JSON, transport routing, receiver binding, propagated errors, and totals. It does not prove arbitrary security, performance, all filesystem error codes, style quality, or maintainability. The directory-read failure case runs in the Linux/macOS environments used by this project; a permission-error case is not simulated because root and filesystem permissions vary.

The reference implementation in `examples/plain.mjs` is authored teaching material. Passing the same checks does not make it a measured agent result.

For the general evaluation approach, see OpenAI's [Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills).
