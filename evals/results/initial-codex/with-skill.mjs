import { readFile } from 'node:fs/promises';

export function activeEmails(users) {
  const emails = [];
  const seenEmails = new Set();

  for (const user of users) {
    if (user.active !== true || typeof user.email !== 'string') {
      continue;
    }

    const email = user.email.trim().toLowerCase();
    if (email === '' || seenEmails.has(email)) {
      continue;
    }

    seenEmails.add(email);
    emails.push(email);
  }

  return emails;
}

export function readLimit(config) {
  return config.limit ?? 20;
}

export async function loadPreferences(path) {
  let contents;

  try {
    contents = await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { theme: 'system' };
    }

    throw error;
  }

  return JSON.parse(contents);
}

export function createNotifier(transports) {
  return {
    async send(channel, message) {
      if (channel !== 'email' && channel !== 'sms') {
        throw new Error(`Unknown notification channel: ${String(channel)}`);
      }

      return transports[channel].send(message);
    },
  };
}

export function summarizeOrders(orders) {
  let count = 0;
  let totalCents = 0;

  for (const order of orders) {
    if (order.status !== 'paid') {
      continue;
    }

    count += 1;
    totalCents += order.totalCents;
  }

  return { count, totalCents };
}