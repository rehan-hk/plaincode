---
name: plaincode
description: Use when writing, fixing, reviewing, or refactoring code where readability and maintainability matter, especially when a small task risks unnecessary abstractions, scattered logic, clever expressions, or silent error handling.
license: MIT
---

# Plaincode

Write the simplest complete solution a maintainer can comfortably follow. Optimize for understanding and safe changes, not minimum line count. Follow the language's idioms and the repository's conventions.

## Understand the change

Read the applicable instructions, current changes, relevant implementation, and affected callers. Identify the requested behavior and the contracts it must preserve. Reuse an existing owner of the behavior before adding another path.

Honor the requested mode: a review produces findings; implementation changes code. Preserve unrelated work. Ask only when a missing fact prevents a correct solution; otherwise state a reasonable assumption and proceed within scope.

## Make the code read directly

- Name values after their meaning: `paidOrders`, `retryDelayMs`, `totalCents`. Keep units and state visible.
- Keep related logic together. Use early returns, ordinary loops, or familiar collection operations when they make the flow easier to follow. Split dense expressions into named steps.
- Add a helper when it names a meaningful operation, isolates a difficult detail, or removes meaningful current duplication. Keep its inputs and outputs clear.
- Add an abstraction when current callers need it. A shared interface with multiple real implementations can reduce complexity. A wrapper that only forwards one call usually adds a step to reading.
- Use the standard library, native platform features, and existing dependencies. Add a dependency only when its concrete benefit justifies owning it.
- Comment on intent, constraints, or surprising behavior. Let names and control flow explain routine mechanics.

## Keep the whole contract

Preserve validation at trust boundaries, authorization, resource cleanup, error behavior, compatibility, and data integrity. Keep transactions and duplicate protection where concurrent or repeated operations require them.

Catch an error when the caller can recover, translate it meaningfully, or clean up. A failed operation must remain a failure; an empty result or success-shaped fallback must not hide it.

Do the requested work completely. Include dependent callers and types when a contract changes. Keep adjacent cleanup, speculative features, and future configuration out of the diff. Arbitrary limits on files, functions, or lines must not leave the task incomplete.

## Review and verify

Read the changed path as its next maintainer:

- Can the behavior be followed without unnecessary jumps or hidden side effects?
- Does each new helper, dependency, and option serve a current requirement?
- Did simplification preserve failure paths and meaningful edge cases such as zero, empty, and missing values?
- Does every changed file contribute to the request or its verification?

Run the relevant existing checks and required repository checks. Add focused behavior tests for uncovered changes or regressions; scale them to the risk. Test outcomes, not private structure or source wording.

Finish with what changed, what was actually checked, and any material limits. Stop when the requested behavior is verified.
