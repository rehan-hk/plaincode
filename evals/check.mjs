import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const candidatePath = process.argv[2];
if (!candidatePath) {
  console.error('Usage: node evals/check.mjs /path/to/candidate.mjs');
  process.exit(1);
}
const candidate = await import(pathToFileURL(resolve(candidatePath)).href);

await test('activeEmails filters, normalizes, deduplicates, and preserves its input', () => {
  const users = Object.freeze([
    { active: true, email: ' Ada@Example.com ' },
    { active: false, email: 'inactive@example.com' },
    { active: true, email: 'ada@example.com' },
    { active: true, email: 'Grace@example.com' },
    { active: true, email: ' ' },
    { active: true, email: null },
    { active: true },
    { active: 1, email: 'truthy@example.com' },
  ].map(Object.freeze));
  assert.deepEqual(candidate.activeEmails(users), ['ada@example.com', 'grace@example.com']);
  assert.deepEqual(candidate.activeEmails([]), []);
});

await test('readLimit preserves zero and defaults only nullish limits', () => {
  assert.equal(candidate.readLimit({ limit: 0 }), 0);
  assert.equal(candidate.readLimit({ limit: 7 }), 7);
  assert.equal(candidate.readLimit({ limit: null }), 20);
  assert.equal(candidate.readLimit({}), 20);
});

await test('loadPreferences defaults missing files but exposes corruption and read failures', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'plaincode-check-'));
  try {
    const valid = join(directory, 'valid.json');
    const broken = join(directory, 'broken.json');
    const folder = join(directory, 'folder');
    await writeFile(valid, '{"theme":"dark","fontSize":16}');
    await writeFile(broken, '{bad json');
    await mkdir(folder);
    assert.deepEqual(await candidate.loadPreferences(valid), { theme: 'dark', fontSize: 16 });
    assert.deepEqual(await candidate.loadPreferences(join(directory, 'missing.json')), { theme: 'system' });
    await assert.rejects(candidate.loadPreferences(broken), SyntaxError);
    await assert.rejects(candidate.loadPreferences(folder));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

await test('createNotifier preserves both transports, receiver binding, results, and errors', async () => {
  const calls = [];
  const failure = new Error('delivery failed');
  const message = Object.freeze({ text: 'Hello' });
  const transports = {
    email: { prefix: 'email', async send(value) { calls.push(value); return this.prefix; } },
    sms: { prefix: 'sms', async send(value) { calls.push(value); return this.prefix; } },
  };
  const notifier = candidate.createNotifier(transports);
  assert.equal(await notifier.send('email', message), 'email');
  assert.equal(await notifier.send('sms', message), 'sms');
  assert.equal(calls.length, 2);
  assert.equal(calls[0], message);
  assert.equal(calls[1], message);
  await assert.rejects(notifier.send('push', message));
  await assert.rejects(notifier.send('toString', message));
  const failing = candidate.createNotifier({
    email: { async send() { throw failure; } },
    sms: transports.sms,
  });
  await assert.rejects(failing.send('email', message), error => error === failure);
});

await test('summarizeOrders totals paid orders, including zero, without mutation', () => {
  const orders = Object.freeze([
    { status: 'paid', totalCents: 1200 },
    { status: 'pending', totalCents: 9000 },
    { status: 'paid', totalCents: 0 },
    { status: 'paid', totalCents: 350 },
  ].map(Object.freeze));
  assert.deepEqual(candidate.summarizeOrders(orders), { count: 3, totalCents: 1550 });
  assert.deepEqual(candidate.summarizeOrders([]), { count: 0, totalCents: 0 });
});
