import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import * as slop from './slop.mjs';
import * as plain from './plain.mjs';

test('both email implementations preserve filtering and ordering', () => {
  const users = [
    { active: true, email: ' Ada@Example.com ' },
    { active: true, email: 'ada@example.com' },
    { active: false, email: 'inactive@example.com' },
    { active: true, email: null },
    { active: true, email: ' ' },
  ];
  assert.deepEqual(slop.activeEmails(users), ['ada@example.com']);
  assert.deepEqual(plain.activeEmails(users), ['ada@example.com']);
});

test('the direct order calculation keeps the layered version behavior', () => {
  const orders = [
    { status: 'paid', totalCents: 100 },
    { status: 'paid', totalCents: 250 },
    { status: 'pending', totalCents: 9000 },
  ];
  assert.deepEqual(slop.summarizeOrders(orders), { count: 2, totalCents: 350 });
  assert.deepEqual(plain.summarizeOrders(orders), { count: 2, totalCents: 350 });
});

test('truthiness loses zero; a nullish default preserves the contract', () => {
  assert.equal(slop.readLimit({ limit: 0 }), 20);
  assert.equal(plain.readLimit({ limit: 0 }), 0);
});

test('catch-all defaults hide malformed files; the plain version rejects them', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'plaincode-museum-'));
  try {
    const path = join(directory, 'broken.json');
    await writeFile(path, '{broken');
    assert.deepEqual(await slop.loadPreferences(path), { theme: 'system' });
    await assert.rejects(plain.loadPreferences(path), SyntaxError);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
