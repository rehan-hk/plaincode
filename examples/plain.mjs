import { readFile } from 'node:fs/promises';

export function activeEmails(users) {
  const emails = new Set();
  for (const user of users) {
    if (user.active !== true || typeof user.email !== 'string') continue;
    const email = user.email.trim().toLowerCase();
    if (email) emails.add(email);
  }
  return [...emails];
}

export function readLimit(config) {
  return config.limit ?? 20;
}

export async function loadPreferences(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return { theme: 'system' };
    throw error;
  }
}

export function createNotifier(transports) {
  return {
    async send(channel, message) {
      if (channel !== 'email' && channel !== 'sms') {
        throw new Error(`Unknown notification channel: ${channel}`);
      }
      return transports[channel].send(message);
    },
  };
}

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
