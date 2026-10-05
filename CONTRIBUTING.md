# Contributing

The most useful contribution is a concrete example of a bad coding decision, with enough context to reproduce it.

## Report a case

Open an issue with:

- The task prompt and relevant existing code, stripped of secrets and private data.
- Agent, model, version, and any other skills or repository instructions in use.
- The actual output and the behavior it must preserve.
- Why the code is difficult to understand or change, and a clearer alternative if you have one.

Include successful baselines and counterexamples. An abstraction can be the right solution. A shorter implementation can be wrong.

## Change the skill

Keep `SKILL.md` self-contained and portable. Prefer a decision rule grounded in a recurring failure over another universal prohibition. Preserve user scope, existing conventions, correctness, and security. Avoid tool-specific hooks and extra dependencies unless a demonstrated problem requires them.

For behavioral changes, run the same task with and without the changed skill in fresh sessions. Keep the model and settings fixed, save the unedited outputs, and distinguish correctness results from human readability judgments. Repeat before claiming a trend. See [the evaluation protocol](evals/README.md).

For code examples, run:

```sh
node evals/check.mjs examples/plain.mjs
node --test examples/museum.test.mjs
```

The deliberately flawed examples are fixtures. Tests should demonstrate their limitation alongside the corrected behavior, rather than treating them as production implementations.

Keep pull requests focused. Explain the observed problem, the new decision rule or example, and what you actually checked. Do not add fabricated benchmark scores, star badges, or claims that the skill guarantees good code.
