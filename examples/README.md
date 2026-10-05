# The Slop Museum

Small exhibits of unnecessary complexity and misleading simplicity. These are **authored teaching examples**, not captured model failures or benchmark wins. The contracts come from the [evaluation prompt](../evals/prompt.md).

Read the complete [before](slop.mjs) and [after](plain.mjs) modules. Run the exhibits with:

```sh
node --test examples/museum.test.mjs
node evals/check.mjs examples/plain.mjs
```

## 1. The enterprise order total

**Before:** `summarizeOrders → OrderSummaryService → PaidOrderFilter + OrderSummaryCalculator`.

**After:**

```js
export function summarizeOrders(orders) {
  let count = 0;
  let totalCents = 0;
  for (const order of orders) {
    if (order.status !== 'paid') continue;
    count += 1;
    totalCents += order.totalCents;
  }
  return { count, totalCents };
}
```

The task has one filtering rule and one calculation. The classes add navigation without isolating a changing policy. Both versions give the same result; the direct version keeps the operation visible. Separate strategies could earn their place if several real callers needed different policies.

## 2. The one-line obstacle course

```js
const activeEmails = users => [...new Set(users.filter(u => u.active === true && typeof u.email === 'string' && u.email.trim()).map(u => u.email.trim().toLowerCase()))];
```

The [plain version](plain.mjs) names `user` and `email`, separates eligibility from normalization, and uses a set for deduplication. Both implementations meet the contract. Collection methods are useful; this exhibit is about packing too many decisions into one expression. Formatting the chain into readable steps is another valid solution.

## 3. The reassuring empty catch

```js
try {
  return JSON.parse(await readFile(path, 'utf8'));
} catch {
  return { theme: 'system' };
}
```

The app appears resilient while hiding corrupted preferences and inaccessible files. The fix defaults only a missing file (`ENOENT`) and lets other failures reach the caller. The test writes malformed JSON to a real temporary file and demonstrates the difference.

## 4. The almost-correct default

```js
return config.limit || 20; // Replaces a valid zero.
return config.limit ?? 20; // Defaults only null or undefined.
```

The caller has already validated the object and value. Fixing the operator solves the actual bug without inventing a configuration framework or duplicating validation.

## 5. The abstraction that stays

`createNotifier` in the [plain module](plain.mjs) exposes one interface over email and SMS. Both transports exist, and callers need to select between them. Removing the shared interface would spread routing into callers.

The correctness check verifies both channels, the original receiver binding (`this`), exact message forwarding, results, and failures. Plaincode should preserve this abstraction. A useful boundary earns its place through current behavior.
