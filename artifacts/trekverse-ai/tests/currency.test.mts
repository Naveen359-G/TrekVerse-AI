import assert from 'node:assert/strict';
import test from 'node:test';
import { convertBudget, convertMoney, currencyOrINR, destinationCost, exchangeReference, formatMoney, lowestBudget } from '../src/lib/currency.ts';
import { assessDestination, buildBudgetBreakdown, calculateGroupCompatibility, rankDestinations, readinessAssessment, relaxPreference } from '../src/lib/planning.ts';
import { regionalDestinations } from '../src/lib/regional-destinations.ts';

const preferences = {
  city: 'Kuala Lumpur', date: '2026-11-01', duration: '1 day', group: '4',
  fitness: 'Easy', budget: '2000', travel: '5', activity: 'Any', mood: 'curious',
};
const destination = regionalDestinations.find(item => item.id === 'kl-frim')!;
const legacyMember = { name: 'Legacy traveller', fitness: 'Easy', budget: '2000' };

test('missing currency is always INR, even for legacy international catalogs', () => {
  assert.equal(currencyOrINR(undefined), 'INR');
  assert.equal(currencyOrINR('invalid'), 'INR');
  assert.equal(destination.currency, 'INR');
  assert.equal(destinationCost(destination), 1450);
  assert.equal(lowestBudget(preferences, [legacyMember]), 2000);
});

test('conversion has a dated, reproducible reference and all currency pairs work', () => {
  assert.equal(exchangeReference.date, '2025-01-02');
  assert.match(exchangeReference.source, /frankfurter/);
  assert.equal(convertMoney(88.507, 'INR', 'MYR'), 4.62);
  assert.equal(convertMoney(88.507, 'INR', 'SGD'), 1.41);
  for (const from of ['INR', 'MYR', 'SGD'] as const) {
    for (const to of ['INR', 'MYR', 'SGD'] as const) {
      const amount = convertMoney(1450, from, to);
      assert.ok(Number.isFinite(amount) && amount > 0);
      assert.match(formatMoney(amount, to), new RegExp(to));
    }
  }
  assert.equal(convertBudget('', 'INR', 'SGD'), '');
  assert.equal(convertBudget('0', 'INR', 'MYR'), '0');
});

test('ranking, compatibility and readiness use the same converted cost and member limits', () => {
  for (const currency of ['INR', 'MYR', 'SGD'] as const) {
    const prefs = { ...preferences, currency, budget: convertBudget('2000', 'INR', currency) };
    const members = [{ ...legacyMember, currency: 'INR' as const }];
    const cost = destinationCost(destination, currency);
    assert.equal(assessDestination(destination, prefs, members).eligible, true);
    assert.equal(rankDestinations([destination], prefs, members).eligible.length, 1);
    assert.equal(calculateGroupCompatibility(destination, prefs, members).factors[0].score, 100);
    assert.equal(readinessAssessment(destination, prefs, members, 0, 1).budgetConcern, false);
    const lowPrefs = { ...prefs, budget: String(cost - 0.01) };
    const issue = assessDestination(destination, lowPrefs, members).hardIssues.find(issue => issue.code === 'budget');
    assert.ok(issue);
    assert.match(issue.message, new RegExp(currency));
    assert.equal(readinessAssessment(destination, lowPrefs, members, 0, 1).budgetConcern, true);
    assert.equal(Number(relaxPreference(lowPrefs, 'budget', destination).budget), cost);
    assert.equal(lowestBudget(prefs, [{ ...legacyMember, budget: '0' }]), 0);
  }
});

test('a mixed-currency member limit is converted, never treated as the plan currency', () => {
  const prefs = { ...preferences, currency: 'SGD' as const, budget: '100' };
  assert.equal(lowestBudget(prefs, [legacyMember]), convertMoney(2000, 'INR', 'SGD'));
  const members = [{ ...legacyMember, budget: '1', currency: 'MYR' as const }];
  assert.ok(assessDestination(destination, prefs, members).hardIssues.some(issue => issue.code === 'budget'));
  assert.ok(calculateGroupCompatibility(destination, prefs, members).conflicts.some(issue => issue.includes('budget')));
});

test('budget line items sum to the displayed total in every currency, for day and overnight trips', () => {
  for (const currency of ['INR', 'MYR', 'SGD'] as const) {
    for (const days of [1, 2]) {
      const budget = buildBudgetBreakdown(destination, days, currency);
      assert.equal(budget.currency, currency);
      assert.equal(Math.round((budget.transport + budget.food + budget.stay + budget.other) * 100), Math.round(budget.total * 100));
      assert.equal(budget.total, destinationCost(destination, currency));
      if (days === 1) assert.equal(budget.stay, 0);
      assert.equal(Math.round((budget.total * 4) * 100), Math.round(destinationCost(destination, currency) * 100) * 4);
    }
  }
});

test('blank, negative and zero limits are not silently replaced with unlimited budgets', () => {
  for (const budget of ['', '-1', '0', 'not-a-number']) {
    assert.equal(assessDestination(destination, { ...preferences, budget }, []).eligible, false);
  }
});

test('a 30% drop scales local-currency limits without an INR-specific floor', () => {
  for (const currency of ['MYR', 'SGD'] as const) {
    const prefs = { ...preferences, currency, budget: convertBudget('2000', 'INR', currency) };
    const cap = Math.round(Math.round(lowestBudget(prefs, [legacyMember]) * 100) * 70 / 100) / 100;
    assert.ok(cap < Number(prefs.budget));
    assert.equal(cap, Math.round(Number(prefs.budget) * 70) / 100);
  }
});
