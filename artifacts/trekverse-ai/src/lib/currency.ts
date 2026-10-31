export const currencies = ['INR', 'MYR', 'SGD'] as const;
export type Currency = (typeof currencies)[number];
export const currencyOrINR = (value: unknown): Currency =>
  currencies.includes(value as Currency) ? value as Currency : 'INR';

// Frozen ECB reference rates via Frankfurter, retrieved for this exact date.
// The app remains usable offline; these are not current exchange or retail rates.
export type ExchangeRates = {
  date: string;
  source: string;
  provider: 'Frankfurter / ECB';
  retrievedAt: string | null;
  perEUR: Record<Currency, number>;
};
export const exchangeReference: ExchangeRates = {
  date: '2025-01-02',
  source: 'https://api.frankfurter.dev/v1/2025-01-02?base=EUR&symbols=INR,MYR,SGD',
  provider: 'Frankfurter / ECB',
  retrievedAt: null,
  perEUR: { INR: 88.507, MYR: 4.6223, SGD: 1.4091 },
};
const validDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value &&
  value <= new Date().toISOString().slice(0, 10);

export function snapshotRates(value: unknown = exchangeReference): ExchangeRates {
  const rates = value as ExchangeRates | undefined;
  if (!rates || !validDate(rates.date) || rates.provider !== 'Frankfurter / ECB' ||
    typeof rates.source !== 'string' || !rates.source.startsWith('https://api.frankfurter.dev/v1/') ||
    !(rates.retrievedAt === null || (typeof rates.retrievedAt === 'string' && Number.isFinite(Date.parse(rates.retrievedAt)))) ||
    !currencies.every(currency => typeof rates.perEUR?.[currency] === 'number' && Number.isFinite(rates.perEUR[currency]) && rates.perEUR[currency] > 0)) {
    throw new Error('Invalid exchange-rate snapshot. Rates were not changed.');
  }
  return { ...rates, perEUR: { ...rates.perEUR } };
}

export async function refreshExchangeRates(): Promise<ExchangeRates> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('You are offline. Connect and try again; your selected rates and saved trips are unchanged.');
  }
  const source = 'https://api.frankfurter.dev/v1/latest?base=EUR&symbols=INR,MYR,SGD';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(source, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`Rate provider returned HTTP ${response.status}.`);
    const data = await response.json();
    if (data.base !== 'EUR' || !validDate(data.date)) throw new Error('Rate provider returned an invalid base or date.');
    return snapshotRates({
      date: data.date, source, provider: 'Frankfurter / ECB',
      retrievedAt: new Date().toISOString(), perEUR: data.rates,
    });
  } catch (error) {
    const detail = error instanceof Error && error.name !== 'AbortError' ? error.message : 'Request timed out.';
    throw new Error(`Could not refresh rates. ${detail} Your selected rates and saved trips are unchanged. You can continue offline.`);
  } finally {
    clearTimeout(timeout);
  }
}

export function convertMoney(amount: number, from: Currency, to: Currency, rates: ExchangeRates = exchangeReference) {
  if (from === to) return amount;
  return Math.round((amount / rates.perEUR[from]) * rates.perEUR[to] * 100) / 100;
}
export function formatMoney(amount: number, currency: Currency = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-SG', {
    style: 'currency', currency, currencyDisplay: 'code', maximumFractionDigits: 2,
  }).format(amount);
}
export function convertBudget(value: string | number, from: Currency, to: Currency, rates: ExchangeRates = exchangeReference): string {
  if (String(value).trim() === '' || !Number.isFinite(Number(value))) return '';
  if (from === to) return String(value);
  return String(convertMoney(Number(value), from, to, rates));
}
export function destinationCost(destination: { cost: number; currency?: Currency }, currency: Currency = 'INR', rates: ExchangeRates = exchangeReference) {
  return convertMoney(destination.cost, destination.currency ?? 'INR', currency, rates);
}
export function lowestBudget(
  preferences: { budget: string | number; currency?: Currency; exchangeRates?: ExchangeRates },
  members: { budget: string | number; currency?: Currency }[],
) {
  const currency = preferences.currency ?? 'INR';
  const valid = (value: string | number) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
  return Math.min(valid(preferences.budget), ...members.map(member =>
    convertMoney(valid(member.budget), member.currency ?? 'INR', currency, preferences.exchangeRates)));
}
