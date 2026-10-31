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
} from '../src/lib/planning.ts';

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
