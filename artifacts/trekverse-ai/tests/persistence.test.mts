import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { change, click, clickElement, element, mount, navigate, openSaved, reload, stored, unmount } from './support/app-harness.mts';
import { convertBudget, exchangeReference, type Currency } from '../src/lib/currency.ts';
import { regionalDestinations } from '../src/lib/regional-destinations.ts';
import { buildBudgetBreakdown } from '../src/lib/planning.ts';

afterEach(unmount);

const currencies: Currency[] = ['INR', 'MYR', 'SGD'];
const destination = regionalDestinations.find(item => item.id === 'kl-frim')!;
const singapore = regionalDestinations.find(item => item.originCity === 'Singapore')!;
const prefs = (currency: Currency = 'INR', city = 'Kuala Lumpur') => ({
  currency, city, date: '2099-11-01', duration: '1 day', group: '2',
  fitness: 'Easy', budget: convertBudget('12000', 'INR', currency),
  travel: '12', activity: 'Any', mood: 'curious', needs: '',
});
const plan = (currency: Currency, id = `saved-${currency}`) => ({
  id, title: `${currency} weekend`, destinationId: destination.id,
  date: '2099-11-01', duration: '1 day', departureTime: '06:00',
  preferences: prefs(currency),
  members: [
    { name: 'You', fitness: 'Easy', budget: convertBudget('10000', 'INR', currency), currency, activity: 'Any' },
    // Mixed member units must survive persistence, not be relabeled with the plan unit.
    { name: 'Sam', fitness: 'Easy', budget: '9000.50', currency: 'INR' as Currency, activity: 'Nature' },
  ],
  votes: { You: 'yes', Sam: 'maybe' },
  budgetBreakdown: buildBudgetBreakdown(destination, 1, currency),
});

function money(record: any) {
  return {
    currency: record.preferences.currency,
    budget: record.preferences.budget,
    rates: record.preferences.exchangeRates,
    members: record.members.map(({ name, currency, budget }: any) => ({ name, currency, budget })),
    budgetBreakdown: record.budgetBreakdown,
  };
}

for (const city of ['Kuala Lumpur', 'Singapore']) {
  test(`legacy ${city} active, saved and prior records migrate to INR without changing amounts`, async () => {
    const legacy: any = plan('INR', `legacy-${city}`);
    legacy.destinationId = city === 'Singapore' ? singapore.id : destination.id;
    legacy.title = `Legacy ${city}`;
    legacy.preferences.city = city;
    delete legacy.preferences.currency;
    delete legacy.budgetBreakdown;
    for (const member of legacy.members) delete member.currency;
    legacy.previousPlan = {
      destinationId: legacy.destinationId, preferences: { ...legacy.preferences },
      members: structuredClone(legacy.members), votes: { ...legacy.votes },
    };
    const original = structuredClone(legacy);
    await mount({ 'tv-prefs': prefs('SGD', 'Singapore'), 'tv-adventure': legacy, 'tv-adventures': [legacy] });
    for (const migrated of [stored(), stored('tv-adventures')[0]]) {
      assert.equal(migrated.preferences.currency, 'INR');
      assert.equal(migrated.preferences.budget, original.preferences.budget);
      assert.deepEqual(migrated.members.map((m: any) => [m.budget, m.currency]),
        original.members.map((m: any) => [m.budget, 'INR']));
      assert.equal(migrated.previousPlan.preferences.currency, 'INR');
      assert.deepEqual(migrated.previousPlan.members.map((m: any) => [m.budget, m.currency]),
        original.members.map((m: any) => [m.budget, 'INR']));
    }
    const normalized = stored();
    await reload();
    assert.deepEqual(stored(), normalized, 'migration must be idempotent');
    await openSaved(legacy.title);
    assert.match(element('.saved-plan-open').textContent!, /INR/);
    await click('Update saved plan');
    await reload();
    assert.equal(stored().preferences.currency, 'INR');
    assert.deepEqual(stored().members, normalized.members);
    assert.equal(stored().budgetBreakdown.currency, 'INR');
    await navigate('PlanB');
    await click('Restore prior plan');
    assert.equal(stored().preferences.currency, 'INR');
    assert.equal(stored().preferences.budget, original.preferences.budget);
    assert.deepEqual(stored().members.map((m: any) => [m.budget, m.currency]),
      original.members.map((m: any) => [m.budget, 'INR']));
  });
}

test('legacy record without any preference context uses its destination origin but never its local currency', async () => {
  const legacy: any = plan('INR');
  delete legacy.preferences;
  delete legacy.budgetBreakdown;
  for (const member of legacy.members) delete member.currency;
  await mount({ 'tv-prefs': prefs('MYR'), 'tv-adventure': legacy, 'tv-adventures': [legacy] });
  assert.equal(stored().preferences.city, 'Kuala Lumpur');
  assert.equal(stored().preferences.currency, 'INR');
  assert.deepEqual(stored().members.map((m: any) => m.budget), legacy.members.map((m: any) => m.budget));
  await openSaved(legacy.title);
  await click('Update saved plan');
  assert.equal(stored().budgetBreakdown.currency, 'INR');
});

test('all search currency switches convert only the search budget and leave every stored trip untouched', async () => {
  const records = currencies.map(currency => plan(currency));
  await mount({ 'tv-prefs': prefs(), 'tv-adventure': records[0], 'tv-adventures': records });
  const active = stored();
  const saved = stored('tv-adventures');
  await navigate('Settings');
  let previous: Currency = 'INR';
  let expected = stored('tv-prefs').budget;
  for (const next of ['MYR', 'SGD', 'INR', 'SGD', 'MYR'] as Currency[]) {
    expected = convertBudget(expected, previous, next);
    await change('[aria-label="Planning currency"]', next);
    assert.equal(stored('tv-prefs').budget, expected);
    assert.equal(stored('tv-prefs').currency, next);
    assert.deepEqual(stored(), active);
    assert.deepEqual(stored('tv-adventures'), saved);
    previous = next;
  }
  await reload();
  assert.equal(stored('tv-prefs').currency, previous);
  assert.deepEqual(stored(), active);
  assert.deepEqual(stored('tv-adventures'), saved);
  for (const currency of currencies) {
    await openSaved(`${currency} weekend`);
    assert.deepEqual(money(stored()), money(saved.find((p: any) => p.id === `saved-${currency}`)));
    assert.equal(stored('tv-prefs').currency, currency);
    assert.ok([...document.querySelectorAll('.notice > strong')]
      .some(label => label.textContent === `Planning currency: ${currency}`));
  }
});

for (const currency of currencies) {
  test(`${currency} save/update/open/reload/duplicate preserves trip and mixed-member amounts`, async () => {
    const seed = plan(currency);
    const other = plan(currency === 'SGD' ? 'INR' : 'SGD');
    const unsaved = { ...seed, id: undefined };
    await mount({ 'tv-prefs': prefs('MYR'), 'tv-adventure': unsaved, 'tv-adventures': [other] });
    const expected = money(stored());
    assert.equal(expected.currency, currency);
    assert.equal(expected.budget, seed.preferences.budget);
    assert.deepEqual(expected.members, seed.members.map(({ name, currency, budget }) => ({ name, currency, budget })));
    assert.deepEqual(expected.budgetBreakdown, seed.budgetBreakdown);
    const otherExpected = stored('tv-adventures')[0];
    await navigate('My Adventures');
    await click('Save this plan');
    const originalId = stored().id;
    assert.ok(originalId);
    assert.equal(stored('tv-adventures').length, 2);
    assert.deepEqual(money(stored('tv-adventures')[0]), expected);
    await click('Update saved plan');
    assert.equal(stored('tv-adventures').length, 2, 'update must not append a duplicate');
    await openSaved(other.title);
    await reload();
    await openSaved(seed.title);
    assert.equal(stored().id, originalId);
    assert.deepEqual(money(stored()), expected);
    await click('Duplicate');
    const duplicateId = stored().id;
    assert.notEqual(duplicateId, originalId);
    assert.equal(stored('tv-adventures').length, 3);
    assert.deepEqual(money(stored()), expected);
    await reload();
    assert.deepEqual(money(stored()), expected);
    await navigate('GroupSync');
    await change('#new-member-name', 'Lee');
    await change('#new-member-budget', '123.45');
    await click('Add to demo group');
    assert.deepEqual(stored().members.slice(0, 2), stored('tv-adventures')[0].members);
    assert.equal(stored().members[2].budget, '123.45');
    assert.equal(stored().members[2].currency, currency, 'member uses the trip unit, not the search unit');
    await navigate('My Adventures');
    await click('Update saved plan');
    await reload();
    assert.equal(stored().members[2].budget, '123.45');
    await openSaved(seed.title);
    assert.deepEqual(money(stored()), expected, 'editing the duplicate must not change the original');
    assert.deepEqual(stored('tv-adventures').find((p: any) => p.id === other.id), otherExpected);
  });

  test(`${currency} PlanB preview/reject/apply/save/reload/restore retains original budgets and historical currency`, async () => {
    const seed = plan(currency);
    await mount({ 'tv-prefs': prefs(currency === 'INR' ? 'SGD' : 'INR'), 'tv-adventure': seed, 'tv-adventures': [seed] });
    const original = stored();
    const originalMoney = money(original);
    await navigate('PlanB');
    // Scenario controls include explanatory text; match their headings.
    const scenario = async (title: string) => {
      const heading = [...document.querySelectorAll('button')].find(b => b.querySelector('strong')?.textContent === title);
      assert.ok(heading, `Missing scenario ${title}`);
      await clickElement(heading);
    };
    await scenario('Group budget drops by 30%');
    assert.deepEqual(stored(), original, 'preview is inert');
    await click('Reject · keep current plan');
    assert.deepEqual(stored(), original, 'reject is inert');
    await scenario('Group budget drops by 30%');
    await click('Apply this revision');
    const revised = stored();
    const lowest = Math.min(Number(original.preferences.budget),
      ...original.members.map((m: any) => Number(convertBudget(m.budget, m.currency, currency))));
    const cap = Math.round(Math.round(lowest * 100) * 70 / 100) / 100;
    assert.equal(revised.preferences.budget, String(cap));
    assert.equal(revised.preferences.currency, currency);
    assert.deepEqual(revised.members, original.members);
    assert.equal(revised.budgetBreakdown.currency, currency);
    assert.deepEqual(revised.previousPlan.preferences, original.preferences);
    assert.deepEqual(revised.previousPlan.members, original.members);
    assert.deepEqual(stored('tv-adventures')[0], original, 'PlanB only changes the active plan until explicitly saved');
    await navigate('My Adventures');
    await click('Update saved plan');
    await reload();
    await openSaved(revised.title);
    assert.equal(stored().preferences.budget, String(cap));
    await navigate('PlanB');
    await scenario('One member cancels');
    await click('Apply this revision');
    assert.equal(stored().members.length, 1);
    assert.deepEqual(stored().previousPlan.preferences, original.preferences, 'successive revisions keep the first snapshot');
    await reload();
    await navigate('PlanB');
    await click('Restore prior plan');
    assert.deepEqual(money(stored()), originalMoney);
    assert.equal(stored().previousPlan, undefined);
    await navigate('My Adventures');
    await click('Update saved plan');
    await reload();
    assert.deepEqual(money(stored()), originalMoney);
    assert.deepEqual(money(stored('tv-adventures')[0]), originalMoney);
  });
}

test('opening, duplicating and restoring a trip retain its historical rates independently of browsing rates', async () => {
  const historical = { ...exchangeReference, perEUR: { ...exchangeReference.perEUR } };
  const browsing = { ...exchangeReference, perEUR: { INR: 100, MYR: 5, SGD: 2 } };
  const seed = { ...plan('MYR'), preferences: { ...prefs('MYR'), exchangeRates: historical } };
  await mount({
    'tv-prefs': { ...prefs('SGD'), exchangeRates: browsing },
    'tv-adventure': seed, 'tv-adventures': [seed],
  });
  await openSaved(seed.title);
  assert.deepEqual(stored('tv-prefs').exchangeRates, browsing);
  assert.deepEqual(stored().preferences.exchangeRates, historical);
  await click('Duplicate');
  await reload();
  assert.deepEqual(stored().preferences.exchangeRates, historical);
  assert.deepEqual(stored('tv-prefs').exchangeRates, browsing);
  await navigate('PlanB');
  const cancel = [...document.querySelectorAll('button')]
    .find(button => button.querySelector('strong')?.textContent === 'One member cancels');
  assert.ok(cancel);
  await clickElement(cancel);
  await click('Apply this revision');
  await reload();
  await navigate('PlanB');
  await click('Restore prior plan');
  assert.deepEqual(stored().preferences.exchangeRates, historical);
  assert.deepEqual(stored('tv-prefs').exchangeRates, browsing);
});
