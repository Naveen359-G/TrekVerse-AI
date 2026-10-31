import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assessDestination,
  buildBudgetBreakdown,
  buildItinerary,
  calculateGroupCompatibility,
  getPlannedReturnTime,
  getRouteProfile,
  optimizeForGroup,
  rankDestinations,
  readinessAssessment,
  resolveOrigin,
  destinationOrigin,
  matchesOrigin,
  supportedOrigins,
} from '../src/lib/planning.ts';
import { regionalDestinations } from '../src/lib/regional-destinations.ts';

const preferences = {
  city: 'Hyderabad', date: '2026-11-01', duration: '1 day', group: '4',
  fitness: 'Easy', budget: '2000', travel: '5', activity: 'Any', mood: 'curious', needs: '',
};
const members = [
  { name: 'Organizer', fitness: 'Easy', budget: '2000', activity: 'Trek', availableHours: 12 },
  { name: 'Beginner', fitness: 'Easy', budget: '2000', activity: 'Nature', availableHours: 12 },
  { name: 'Walker', fitness: 'Moderate', budget: '2000', activity: 'Trek', availableHours: 12 },
  { name: 'Explorer', fitness: 'Experienced', budget: '2000', activity: 'Nature', availableHours: 12 },
];
const forest = { id: 'ananthagiri', name: 'Forest', region: 'Sample', drive: 82, hours: 4, difficulty: 'Easy', cost: 1450, kind: 'Forest trek', mood: ['quiet', 'reset'], durationDays: 1, minGroup: 1, maxGroup: 10 };
const nearby = { ...forest, id: 'kondapochamma', name: 'Nearby nature', hours: 3, cost: 950, kind: 'Nature drive' };
const overnight = { ...forest, id: 'laknavaram', name: 'Overnight', hours: 8, cost: 3100, durationDays: 2 };

test('country names and the reported Malaysia typo require a real starting city', () => {
  for (const value of ['Malaysia', 'Malaysis', ' MALAYSIS ', 'India']) {
    assert.equal(resolveOrigin(value).kind, 'country');
    assert.equal(rankDestinations([forest, ...regionalDestinations], { ...preferences, city: value }, members).eligible.length, 0);
    assert.equal(optimizeForGroup([forest, ...regionalDestinations], { ...preferences, city: value }, members), null);
  }
  assert.deepEqual(resolveOrigin('Malaysis').suggestions, ['Kuala Lumpur', 'George Town', 'Johor Bahru']);
});

test('starting city aliases normalize without silently changing unknown locations', () => {
  assert.equal(resolveOrigin('  KUALA LUMPUR, Malaysia ').city, 'Kuala Lumpur');
  assert.equal(resolveOrigin('KL').city, 'Kuala Lumpur');
  assert.equal(resolveOrigin('Bangalore').city, 'Bengaluru');
  assert.equal(resolveOrigin('Penang').city, 'George Town');
  assert.equal(resolveOrigin('Atlantis').kind, 'unsupported');
  assert.equal(resolveOrigin('').kind, 'empty');
  const ranked = rankDestinations([forest, ...regionalDestinations], { ...preferences, city: 'Atlantis' }, members);
  assert.equal(ranked.eligible.length, 0);
  assert.equal(ranked.excluded.length, 0);
});

test('changing the starting city changes both eligible and excluded destination pools', () => {
  const all = [forest, nearby, ...regionalDestinations];
  for (const origin of supportedOrigins) {
    const prefs = { ...preferences, city: origin.city };
    const ranked = rankDestinations(all, prefs, members);
    assert.ok(ranked.eligible.length > 0, `${origin.city} should have a nearby option`);
    for (const item of [...ranked.eligible, ...ranked.excluded]) {
      assert.equal(destinationOrigin(item.destination), origin.city);
    }
    const optimized = optimizeForGroup(all, prefs, members);
    assert.ok(optimized);
    assert.equal(destinationOrigin(optimized.destination), origin.city);
  }
});

test('a mismatched origin is a non-relaxable issue, even with flexible limits', () => {
  const result = assessDestination(forest, { ...preferences, city: 'Kuala Lumpur', budget: '99999', travel: '12' }, members);
  assert.equal(result.eligible, false);
  assert.ok(result.hardIssues.some(issue => issue.code === 'origin' && !issue.canRelax));
  assert.equal(matchesOrigin(forest, 'Kuala Lumpur'), false);
  assert.equal(matchesOrigin(forest, 'HYDERABAD'), true);
});

test('itineraries retain the destination travel origin instead of relabeling unrelated trips', () => {
  const kl = regionalDestinations.find(destination => destination.id === 'kl-frim')!;
  assert.equal(buildItinerary(kl, { ...preferences, city: 'Kuala Lumpur' })[0].title, 'Depart Kuala Lumpur');
  assert.equal(buildItinerary(forest, { ...preferences, city: 'Kuala Lumpur' })[0].title, 'Depart Hyderabad');
});

test('regional catalog has unique destinations and sufficient coverage for each added city', () => {
  assert.equal(new Set(regionalDestinations.map(destination => destination.id)).size, regionalDestinations.length);
  for (const origin of supportedOrigins.filter(origin => origin.city !== 'Hyderabad')) {
    assert.ok(regionalDestinations.filter(destination => destination.originCity === origin.city).length >= 3);
  }
});

test('four-person Sunday brief enforces budget, travel and duration limits', () => {
  const ranked = rankDestinations([forest, nearby, overnight], preferences, members);
  assert.equal(ranked.eligible.length, 2);
  assert.deepEqual(ranked.excluded[0].hardIssues.map(issue => issue.code).sort(), ['budget', 'duration', 'travel']);
  assert.equal(assessDestination(forest, { ...preferences, budget: '1200' }, members).eligible, false);
});

test('the lowest member budget, availability and access needs are honored', () => {
  const lowBudget = [{ ...members[0], budget: '1000' }, ...members.slice(1)];
  assert(assessDestination(forest, preferences, lowBudget).hardIssues.some(issue => issue.code === 'budget'));
  assert(assessDestination(forest, preferences, [{ ...members[0], availableHours: 2 }]).hardIssues.some(issue => issue.code === 'availability'));
  assert(assessDestination(forest, preferences, [{ ...members[0], mobility: 'Step-free access needed' }]).hardIssues.some(issue => issue.code === 'mobility'));
});

test('group compromise is feasible and exposes six compatibility factors', () => {
  const best = optimizeForGroup([forest, nearby, overnight], preferences, members);
  assert(best?.assessment.eligible);
  const fit = calculateGroupCompatibility(forest, preferences, members);
  assert.equal(fit.factors.length, 6);
  assert(fit.factors.some(factor => factor.label === 'Accessibility'));
});

test('itinerary uses mood and calculates arrival home after return travel', () => {
  const itinerary = buildItinerary(forest, { ...preferences, mood: 'quiet' }, '06:00');
  assert(itinerary.some(item => item.title.includes('Quiet nature time')));
  assert.equal(getPlannedReturnTime(forest, preferences, '06:00'), '14:38');
  assert.notEqual(itinerary.at(-1)?.time, getPlannedReturnTime(forest, preferences, '06:00'));
});

test('late departure changes readiness and route profiles have checkpoints', () => {
  const onTime = readinessAssessment(forest, preferences, members, 2, 5, undefined, '06:00');
  const late = readinessAssessment(forest, preferences, members, 2, 5, 'Late departure', '12:00');
  assert.equal(onTime.daylightConcern, false);
  assert.equal(late.daylightConcern, true);
  assert.equal(getRouteProfile(forest).checkpoints.length, 4);
});

test('budget components add up to the destination estimate', () => {
  const budget = buildBudgetBreakdown(forest, 1);
  assert.equal(budget.transport + budget.food + budget.stay + budget.other, budget.total);
});
