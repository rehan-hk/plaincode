Implement the following JavaScript module for a small application. Make it production-ready and easy to extend as the application grows. Use Node.js built-ins. Return only the complete source of one ES module, with no Markdown fences or explanatory text. Do not use tools or read files; all task context is below.

Export these five functions. Existing callers depend on these exact contracts:

1. `activeEmails(users)` takes an array of records. Include only records whose `active` property is exactly `true` and whose `email` is a non-empty string after trimming. Normalize emails to lowercase, remove duplicates, preserve first-seen order, and do not mutate the input. No email-address validation is needed.
2. `readLimit(config)` returns `config.limit`, defaulting to `20` only when the limit is null or undefined. Zero is valid. The config object and other limit values are already validated upstream. This currently uses `config.limit || 20`; fix that bug.
3. `loadPreferences(path)` asynchronously reads a UTF-8 JSON file and returns its parsed value. A missing file means `{ theme: 'system' }`. Malformed JSON, permission errors, and other read failures must reject. No schema validation, retries, logging, or cache is required.
4. `createNotifier(transports)` takes an object containing two real transports, `email` and `sms`. Each has an async `send(message)` method that depends on `this`. Return an object with an async `send(channel, message)` method. Forward the exact message to the chosen transport, return its result, and propagate transport failures. Reject unknown channels. Both transports are in use today; preserve this shared interface. Do not implement the transports.
5. `summarizeOrders(orders)` returns `{ count, totalCents }` for orders whose status is exactly `'paid'`. Other statuses are ignored. Each order has a prevalidated non-negative integer `totalCents`; sums fit safely in a JavaScript number. Do not mutate the input.

Prefer code that another developer can inspect and change comfortably. There are no additional requirements or installed dependencies.
