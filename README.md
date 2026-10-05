# Plaincode

**Code you can understand on the first read.**

A small skill for **Codex and Claude Code** that guides coding agents toward straightforward, complete, maintainable code.

Give the next developer fewer puzzles: meaningful names, visible control flow, useful abstractions, and errors that tell the truth.

[Read the skill](SKILL.md) · [Slop Museum](examples/README.md) · [Evaluation](evals/README.md) · [Contribute](CONTRIBUTING.md)

## What it changes

| When an agent reaches for… | Plaincode asks for… |
| --- | --- |
| A factory, wrapper, or configuration layer for a hypothetical future | A direct solution to the current requirement |
| A dense one-liner with several transformations | Named steps or a familiar, readable expression |
| A catch-all that returns an empty result | Recovery for an expected failure; propagation for the rest |
| New utilities beside equivalent existing code | Reuse of the existing behavior owner |
| A sweeping rewrite around a small fix | A complete, focused change with proportionate checks |

**Simple does not mean incomplete.** Keep security checks, transactions, useful interfaces, and required functionality. There is no line-count target or blanket ban on classes, helpers, dependencies, or tests.

## A small example

Missing preferences and corrupted preferences need different outcomes.

```js
// Hides corruption, permission errors, and missing files alike.
try {
  return JSON.parse(await readFile(path, 'utf8'));
} catch {
  return { theme: 'system' };
}
```

```js
// A missing file has a defined default. Other failures stay visible.
try {
  return JSON.parse(await readFile(path, 'utf8'));
} catch (error) {
  if (error.code === 'ENOENT') return { theme: 'system' };
  throw error;
}
```

Sometimes clearer code is longer. See the [runnable examples and counterexample](examples/README.md).

## Install

Requires Git. The skill itself has no runtime dependencies, hooks, MCP servers, or API keys. Choose your coding agent; these commands create a new personal skill directory and refuse to overwrite an existing clone.

### Codex

```sh
mkdir -p ~/.agents/skills
git clone https://github.com/rehan-hk/plaincode.git ~/.agents/skills/plaincode
```

In a new Codex session:

```text
Use $plaincode to add pagination to this endpoint.
```

### Claude Code

```sh
mkdir -p ~/.claude/skills
git clone https://github.com/rehan-hk/plaincode.git ~/.claude/skills/plaincode
```

In a new Claude Code session:

```text
/plaincode Review this change for unnecessary complexity. Do not edit it.
```

For a team, copy `SKILL.md` into `.agents/skills/plaincode/` for Codex or `.claude/skills/plaincode/` for Claude Code inside the target repository. That file is self-contained. The optional `agents/openai.yaml` supplies Codex display metadata.

Explicit invocation is the clearest way to request the skill. Automatic selection depends on the agent and surrounding instructions. Plaincode guides the agent; it does not retrain the model or enforce rules like a compiler.

Installation paths follow the official [Codex skill documentation](https://learn.chatgpt.com/docs/build-skills) and [Claude Code skill documentation](https://code.claude.com/docs/en/skills). This is an independent community project.

To update a personal installation, run `git -C <installation-directory> pull --ff-only`. To uninstall, remove only that installation directory; this repository adds no settings elsewhere.

## Evidence before promises

This is an early release. The [evaluation](evals/README.md) contains a fixed prompt, executable correctness checks, and a rubric for human review. The [initial Codex comparison](evals/results/initial-codex/README.md) includes the unedited outputs, including a good baseline. It does **not** establish a general improvement in code quality.

Native repository-level discovery and explicit loading were verified in Codex. Claude Code installation is documented against its skill format; live Claude behavior has not been tested. Runnable examples are authored teaching material, not evidence of model performance.

With Node.js 22 or later, run:

```sh
node evals/check.mjs examples/plain.mjs
node --test examples/museum.test.mjs
```

## Help improve it

Bring a small, reproducible case where the agent added complexity or broke behavior while simplifying. Include the prompt, code, relevant instructions, model/version, and what makes the result difficult to maintain. See [contribution guidance](CONTRIBUTING.md).

MIT licensed. Small enough to read, fork, and disagree with.
