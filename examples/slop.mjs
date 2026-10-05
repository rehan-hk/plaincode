// Authored teaching fixtures. Some preserve behavior; others deliberately contain bugs.
import { readFile } from 'node:fs/promises';

export const activeEmails = users => [...new Set(users.filter(u => u.active === true && typeof u.email === 'string' && u.email.trim()).map(u => u.email.trim().toLowerCase()))];

export function readLimit(config) {
  return config.limit || 20;
}

export async function loadPreferences(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return { theme: 'system' };
  }
}

class PaidOrderFilter {
  apply(orders) {
    return orders.filter(order => order.status === 'paid');
  }
}

class OrderSummaryCalculator {
  calculate(orders) {
    return {
      count: orders.length,
      totalCents: orders.reduce((total, order) => total + order.totalCents, 0),
    };
  }
}

class OrderSummaryService {
  constructor(filter, calculator) {
    this.filter = filter;
    this.calculator = calculator;
  }

  summarize(orders) {
    return this.calculator.calculate(this.filter.apply(orders));
  }
}

export function summarizeOrders(orders) {
  const service = new OrderSummaryService(new PaidOrderFilter(), new OrderSummaryCalculator());
  return service.summarize(orders);
}
