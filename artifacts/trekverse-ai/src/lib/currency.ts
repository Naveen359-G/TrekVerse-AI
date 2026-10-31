export const currencies = ['INR', 'MYR', 'SGD'] as const;
export type Currency = (typeof currencies)[number];
export const currencyOrINR = (value: unknown): Currency =>
  currencies.includes(value as Currency) ? value as Currency : 'INR';

// Frozen ECB reference rates via Frankfurter, retrieved for this exact date.
// The app remains usable offline; these are not current exchange or retail rates.
export const exchangeReference = {
  date: '2025-01-02',
  source: 'https://api.frankfurter.dev/v1/2025-01-02?base=EUR&symbols=INR,MYR,SGD',
  perEUR: { INR: 88.507, MYR: 4.6223, SGD: 1.4091 },
};
export function convertMoney(amount: number, from: Currency, to: Currency) {
  return Math.round((amount / exchangeReference.perEUR[from]) * exchangeReference.perEUR[to] * 100) / 100;
}
export function formatMoney(amount: number, currency: Currency = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-SG', {
    style: 'currency', currency, currencyDisplay: 'code', maximumFractionDigits: 2,
  }).format(amount);
}
export function convertBudget(value: string | number, from: Currency, to: Currency): string {
  if (String(value).trim() === '' || !Number.isFinite(Number(value))) return '';
  return String(convertMoney(Number(value), from, to));
}
export function destinationCost(destination: { cost: number; currency?: Currency }, currency: Currency = 'INR') {
  return convertMoney(destination.cost, destination.currency ?? 'INR', currency);
}
export function lowestBudget(
  preferences: { budget: string | number; currency?: Currency },
  members: { budget: string | number; currency?: Currency }[],
) {
  const currency = preferences.currency ?? 'INR';
  const valid = (value: string | number) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
  return Math.min(valid(preferences.budget), ...members.map(member =>
    convertMoney(valid(member.budget), member.currency ?? 'INR', currency)));
}
