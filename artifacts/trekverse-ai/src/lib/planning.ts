export type FitnessLevel = 'Easy' | 'Moderate' | 'Experienced';

export const supportedOrigins = [
  { city: 'Hyderabad', country: 'India', aliases: ['hyd', 'hyderabad india', 'hyderabad telangana'] },
  { city: 'Kuala Lumpur', country: 'Malaysia', aliases: ['kl', 'kuala lumpur malaysia', 'kuala lumpur city'] },
  { city: 'George Town', country: 'Malaysia', aliases: ['penang', 'georgetown', 'george town penang', 'george town malaysia', 'penang malaysia'] },
  { city: 'Johor Bahru', country: 'Malaysia', aliases: ['jb', 'johor bahru malaysia', 'johor bharu'] },
  { city: 'Bengaluru', country: 'India', aliases: ['bangalore', 'bengaluru india', 'bangalore india'] },
  { city: 'Mumbai', country: 'India', aliases: ['bombay', 'mumbai india'] },
  { city: 'Pune', country: 'India', aliases: ['pune india'] },
  { city: 'Delhi', country: 'India', aliases: ['new delhi', 'delhi india', 'new delhi india'] },
  { city: 'Chennai', country: 'India', aliases: ['madras', 'chennai india'] },
  { city: 'Singapore', country: 'Singapore', aliases: ['singapore city'] },
];

const normalizeCity = (value: string) => value.normalize('NFKC').trim().toLowerCase().replace(/[,.]/g, ' ').replace(/\s+/g, ' ');

export function resolveOrigin(value: string) {
  const key = normalizeCity(value);
  const origin = supportedOrigins.find(item => normalizeCity(item.city) === key || item.aliases.includes(key));
  if (origin) return { kind: 'city' as const, city: origin.city, country: origin.country, message: `Showing sample destinations around ${origin.city}, ${origin.country}. All budgets remain in INR (₹).`, suggestions: [] as string[] };
  if (['malaysia', 'malaysis', 'malasia', 'malyasia', 'malayasia'].includes(key)) {
    return { kind: 'country' as const, city: '', country: 'Malaysia', message: 'Malaysia is a country. Choose your actual starting city so we can show nearby places.', suggestions: ['Kuala Lumpur', 'George Town', 'Johor Bahru'] };
  }
  if (['india', 'bharat'].includes(key)) {
    return { kind: 'country' as const, city: '', country: 'India', message: 'India is a country. Choose your starting city.', suggestions: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Pune', 'Delhi', 'Chennai'] };
  }
  return { kind: key ? 'unsupported' as const : 'empty' as const, city: '', country: '', message: key ? `We do not have a local destination catalog for “${value.trim()}” yet. Choose a listed city; we will not substitute Hyderabad results.` : 'Enter a starting city, not a country.', suggestions: [] as string[] };
}

export const destinationOrigin = (destination: { originCity?: string }) => destination.originCity || 'Hyderabad';
export function matchesOrigin(destination: { originCity?: string }, city: string) {
  const origin = resolveOrigin(city);
  return origin.kind === 'city' && origin.city === destinationOrigin(destination);
}

export type PlanningMember = {
  name: string;
  fitness: string;
  budget: string | number;
  activity?: string;
  availableHours?: number;
  mobility?: string;
};

export type PlanningPreferences = {
  city: string;
  date: string;
  duration: string;
  group: string | number;
  fitness: string;
  budget: string | number;
  travel: string | number;
  activity: string;
  mood: string;
  needs?: string;
};

export type PlanningDestination = {
  id: string;
  name: string;
  region: string;
  drive: number;
  hours: number;
  difficulty: string;
  cost: number;
  kind: string;
  mood: string[];
  durationDays?: number;
  minGroup?: number;
  maxGroup?: number;
  highlights?: string[];
  hazards?: string[];
  preparation?: string[];
  dataStatus?: string;
  originCity?: string;
};

export type ScoreFactor = {
  label: string;
  score: number;
  explanation: string;
};

export type DestinationAssessment<T extends PlanningDestination> = {
  destination: T;
  score: number;
  eligible: boolean;
  hardIssues: { code: string; message: string; canRelax: boolean }[];
  factors: ScoreFactor[];
  reasons: string[];
};

const fitnessRank = (level: string) =>
  level.toLowerCase() === 'easy' ? 1 : level.toLowerCase() === 'moderate' ? 2 : 3;

const difficultyRank = (level: string) =>
  level.toLowerCase() === 'easy' ? 1 : level.toLowerCase() === 'moderate' ? 2 : 3;

const durationDays = (value: string) => Math.max(1, Number.parseInt(value, 10) || 1);
const numeric = (value: string | number, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

function activityMatches(preference: string, kind: string) {
  const wanted = preference.toLowerCase();
  const actual = kind.toLowerCase();
  if (!wanted || wanted === 'any') return true;
  if (wanted === 'nature') return /forest|nature|lake|waterfall|canyon/i.test(actual);
  if (wanted === 'trek') return /trek|hike|trail|walk/i.test(actual);
  if (wanted === 'lake') return /lake|reservoir|water/i.test(actual);
  if (wanted === 'climb') return /climb|fort|rock/i.test(actual);
  return actual.includes(wanted);
}

export function assessDestination<T extends PlanningDestination>(
  destination: T,
  preferences: PlanningPreferences,
  members: PlanningMember[],
): DestinationAssessment<T> {
  const plannedDays = durationDays(preferences.duration);
  const travelLimit = numeric(preferences.travel, 12);
  const statedBudget = numeric(preferences.budget, Number.MAX_SAFE_INTEGER);
  const memberBudgets = members
    .map((member) => numeric(member.budget, statedBudget))
    .filter(Number.isFinite);
  const groupBudget = Math.min(statedBudget, ...memberBudgets);
  const groupSize = numeric(preferences.group, members.length || 1);
  const daysNeeded = destination.durationDays ?? 1;
  const hardIssues: DestinationAssessment<T>['hardIssues'] = [];

  if (!matchesOrigin(destination, preferences.city)) {
    hardIssues.push({ code: 'origin', message: `These travel estimates start from ${destinationOrigin(destination)}, not “${preferences.city}”. Choose a destination from your starting city.`, canRelax: false });
  }
  if (destination.cost > groupBudget) {
    hardIssues.push({
      code: 'budget',
      message: `About ₹${destination.cost.toLocaleString('en-IN')} per person, over the ₹${groupBudget.toLocaleString('en-IN')} group limit.`,
      canRelax: true,
    });
  }
  if (destination.hours > travelLimit) {
    hardIssues.push({
      code: 'travel',
      message: `About ${destination.hours} travel hours, above the ${travelLimit}-hour limit.`,
      canRelax: true,
    });
  }
  if (daysNeeded > plannedDays) {
    hardIssues.push({
      code: 'duration',
      message: `Usually needs ${daysNeeded} day${daysNeeded === 1 ? '' : 's'}, but ${plannedDays} day${plannedDays === 1 ? '' : 's'} are available.`,
      canRelax: true,
    });
  }
  if (destination.maxGroup && groupSize > destination.maxGroup) {
    hardIssues.push({
      code: 'group',
      message: `The illustrative group-size assumption is up to ${destination.maxGroup}; your group has ${groupSize}.`,
      canRelax: false,
    });
  }
  if (destination.minGroup && groupSize < destination.minGroup) {
    hardIssues.push({
      code: 'group',
      message: `The illustrative group-size assumption starts at ${destination.minGroup}; your group has ${groupSize}.`,
      canRelax: false,
    });
  }

  const mobilityRequested =
    /wheelchair|step[- ]free|mobility|limited walking|accessible/i.test(preferences.needs || '') ||
    members.some((member) => Boolean(member.mobility?.trim()));
  if (mobilityRequested) {
    hardIssues.push({
      code: 'mobility',
      message: 'Accessibility details are not verified for this sample destination.',
      canRelax: false,
    });
  }
  const timeLimitedMember = members.find(
    (member) => member.availableHours && destination.hours > member.availableHours,
  );
  if (timeLimitedMember) {
    hardIssues.push({
      code: 'availability',
      message: `${timeLimitedMember.name} has less available time than the illustrative ${destination.hours}-hour travel estimate.`,
      canRelax: false,
    });
  }

  const activityFit = activityMatches(preferences.activity, destination.kind);
  const moodFit = destination.mood.includes(preferences.mood);
  const groupFitness = members.length
    ? members
    : [{ name: 'You', fitness: preferences.fitness, budget: statedBudget }];
  const fitnessFit = Math.round(
    (groupFitness.reduce(
      (total, member) =>
        total +
        (fitnessRank(member.fitness) >= difficultyRank(destination.difficulty)
          ? 100
          : 35),
      0,
    ) /
      groupFitness.length),
  );
  const groupRangeFit =
    groupSize >= (destination.minGroup ?? 1) &&
    groupSize <= (destination.maxGroup ?? 12);

  const factors: ScoreFactor[] = [
    {
      label: 'Budget',
      score: destination.cost <= groupBudget ? 100 : 20,
      explanation:
        destination.cost <= groupBudget
          ? `₹${destination.cost.toLocaleString('en-IN')} estimate fits the lowest group budget of ₹${groupBudget.toLocaleString('en-IN')}.`
          : `₹${destination.cost.toLocaleString('en-IN')} estimate exceeds the lowest group budget of ₹${groupBudget.toLocaleString('en-IN')}.`,
    },
    {
      label: 'Travel',
      score: destination.hours <= travelLimit ? 100 : 20,
      explanation: `${destination.hours} illustrative travel hours from ${destinationOrigin(destination)} against a ${travelLimit}-hour limit.`,
    },
    {
      label: 'Duration',
      score: daysNeeded <= plannedDays ? 100 : 20,
      explanation: `About ${daysNeeded} day${daysNeeded === 1 ? '' : 's'} planned against ${plannedDays} available.`,
    },
    {
      label: 'Group fitness',
      score: fitnessFit,
      explanation:
        fitnessFit === 100
          ? `The illustrative ${destination.difficulty.toLowerCase()} grade is within every member's selected comfort level.`
          : `The ${destination.difficulty.toLowerCase()} grade may be challenging for one or more members; consider an easier option.`,
    },
    {
      label: 'Group size',
      score: groupRangeFit ? 100 : 45,
      explanation: `${groupSize} traveller${groupSize === 1 ? '' : 's'} against an illustrative group range of ${destination.minGroup ?? 1}–${destination.maxGroup ?? 12}.`,
    },
    {
      label: 'Activity',
      score: activityFit ? 100 : 45,
      explanation: activityFit
        ? `Matches the ${preferences.activity === 'Any' ? 'open activity' : preferences.activity} preference.`
        : `The destination is a ${destination.kind.toLowerCase()}, not the selected ${preferences.activity.toLowerCase()} activity.`,
    },
    {
      label: 'Mood',
      score: moodFit ? 100 : 55,
      explanation: moodFit
        ? `Matches the ${preferences.mood} weekend mood.`
        : `Not a direct match for the ${preferences.mood} mood, but may still suit the group.`,
    },
  ];

  const weights = [20, 15, 15, 20, 10, 12, 8];
  const score = Math.round(
    factors.reduce((sum, factor, index) => sum + factor.score * weights[index], 0) / 100,
  );
  const reasons = factors
    .filter((factor) => factor.score >= 80)
    .map((factor) => `${factor.label} fit`);

  return {
    destination,
    score,
    eligible: hardIssues.length === 0,
    hardIssues,
    factors,
    reasons,
  };
}

export function rankDestinations<T extends PlanningDestination>(
  destinations: T[],
  preferences: PlanningPreferences,
  members: PlanningMember[],
) {
  const assessments = destinations.filter(destination => matchesOrigin(destination, preferences.city)).map((destination) =>
    assessDestination(destination, preferences, members),
  );
  const sortByScore = (a: DestinationAssessment<T>, b: DestinationAssessment<T>) =>
    b.score - a.score || a.destination.cost - b.destination.cost;
  return {
    eligible: assessments.filter((item) => item.eligible).sort(sortByScore),
    excluded: assessments.filter((item) => !item.eligible).sort(sortByScore),
  };
}

export function relaxPreference(
  preferences: PlanningPreferences,
  field: string,
  destination: PlanningDestination,
): PlanningPreferences {
  if (field === 'budget') return { ...preferences, budget: String(destination.cost) };
  if (field === 'travel') return { ...preferences, travel: String(destination.hours) };
  if (field === 'duration')
    return { ...preferences, duration: `${destination.durationDays ?? 1} day${(destination.durationDays ?? 1) === 1 ? '' : 's'}` };
  return preferences;
}

export function calculateGroupCompatibility(
  destination: PlanningDestination,
  preferences: PlanningPreferences,
  members: PlanningMember[],
) {
  const group = members.length
    ? members
    : [{ name: 'You', fitness: preferences.fitness, budget: preferences.budget }];
  const budgetCap = Math.min(
    numeric(preferences.budget, Number.MAX_SAFE_INTEGER),
    ...group.map((member) => numeric(member.budget, Number.MAX_SAFE_INTEGER)),
  );
  const budgetFit = destination.cost <= budgetCap ? 100 : Math.max(0, Math.round((budgetCap / destination.cost) * 100));
  const travelLimit = numeric(preferences.travel, 12);
  const sharedTimeFit =
    destination.hours <= travelLimit
      ? 100
      : Math.max(0, Math.round((travelLimit / destination.hours) * 100));
  const memberTimeScores = group.map((member) =>
    member.availableHours
      ? Math.min(100, Math.round((member.availableHours / destination.hours) * 100))
      : 100,
  );
  const timeFit = Math.min(sharedTimeFit, ...memberTimeScores);
  const fitnessFit = Math.round(
    (group.reduce(
      (sum, member) =>
        sum +
        (fitnessRank(member.fitness) >= difficultyRank(destination.difficulty) ? 100 : 35),
      0,
    ) /
      group.length),
  );
  const activityMembers = group.filter((member) =>
    activityMatches(member.activity || 'Any', destination.kind),
  );
  const activityFit = Math.round((activityMembers.length / group.length) * 100);
  const groupSize = group.length;
  const sizeFit =
    groupSize >= (destination.minGroup ?? 1) &&
    groupSize <= (destination.maxGroup ?? 12)
      ? 100
      : 45;
  const accessibilityFit = group.some((member) => member.mobility?.trim()) ||
    /wheelchair|step[- ]free|mobility|limited walking|accessible/i.test(preferences.needs || '')
    ? 40
    : 60;
  const score = Math.round(
    budgetFit * 0.25 +
      timeFit * 0.15 +
      fitnessFit * 0.2 +
      activityFit * 0.15 +
      sizeFit * 0.1 +
      accessibilityFit * 0.15,
  );

  const conflicts = group.flatMap((member) => {
    const issues: string[] = [];
    if (numeric(member.budget, budgetCap) < destination.cost)
      issues.push(`${member.name}: budget is below the estimate`);
    if (fitnessRank(member.fitness) < difficultyRank(destination.difficulty))
      issues.push(`${member.name}: route grade is above their selected comfort level`);
    if (member.availableHours && member.availableHours < destination.hours)
      issues.push(`${member.name}: less time is available than the travel estimate`);
    if (member.mobility)
      issues.push(`${member.name}: mobility needs require local accessibility confirmation`);
    if (!activityMatches(member.activity || 'Any', destination.kind))
      issues.push(`${member.name}: prefers a different activity`);
    return issues;
  });

  return {
    score,
    factors: [
      { label: 'Lowest budget', score: budgetFit, explanation: `Group cap ₹${budgetCap.toLocaleString('en-IN')} per person; estimate ₹${destination.cost.toLocaleString('en-IN')}.` },
      { label: 'Available time', score: timeFit, explanation: `${destination.hours} illustrative travel hours against a ${travelLimit}-hour limit.` },
      { label: 'Fitness', score: fitnessFit, explanation: `${group.filter((member) => fitnessRank(member.fitness) >= difficultyRank(destination.difficulty)).length} of ${group.length} members match the illustrative route grade.` },
      { label: 'Activity', score: activityFit, explanation: `${activityMembers.length} of ${group.length} members selected a matching activity.` },
      { label: 'Group size', score: sizeFit, explanation: `${groupSize} travellers against an illustrative range of ${destination.minGroup ?? 1}–${destination.maxGroup ?? 12}.` },
      { label: 'Accessibility', score: accessibilityFit, explanation: 'Access and mobility information is unverified for every sample destination; a score never confirms accessibility.' },
    ],
    conflicts: [...new Set(conflicts)],
    agreements: [
      `${group.length} people are included in this local demo group.`,
      ...(budgetFit === 100 ? ['The sample cost fits the lowest stated group budget.'] : []),
      ...(fitnessFit === 100 ? ['Every member’s selected comfort meets the illustrative route grade.'] : []),
      `Votes are tracked separately and do not affect the compatibility score.`,
    ],
  };
}

export function optimizeForGroup<T extends PlanningDestination>(
  destinations: T[],
  preferences: PlanningPreferences,
  members: PlanningMember[],
) {
  const scored = destinations.filter(destination => matchesOrigin(destination, preferences.city))
    .map((destination) => ({
      destination,
      compatibility: calculateGroupCompatibility(destination, preferences, members),
      assessment: assessDestination(destination, preferences, members),
    }))
    .sort(
      (a, b) =>
        Number(b.assessment.eligible) - Number(a.assessment.eligible) ||
        b.compatibility.score - a.compatibility.score ||
        a.destination.cost - b.destination.cost,
    );
  return scored[0] ?? null;
}

export type ItineraryItem = {
  id: string;
  day: number;
  time: string;
  title: string;
  detail: string;
  durationMinutes: number;
};

function addTime(time: string, minutes: number) {
  const [hours, mins] = time.split(':').map(Number);
  const total = ((hours * 60 + mins + minutes) % (24 * 60) + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function buildItinerary(
  destination: PlanningDestination,
  preferences: PlanningPreferences,
  departureTime = '06:00',
): ItineraryItem[] {
  const days = Math.min(durationDays(preferences.duration), destination.durationDays ?? 2);
  const driveMinutes = Math.round(destination.hours * 60);
  const outboundMinutes = Math.round(driveMinutes / 2);
  const baseActivityMinutes = getRouteProfile(destination).durationMinutes;
  const pace = preferences.fitness.toLowerCase();
  const activityMinutes = Math.round(
    baseActivityMinutes * (pace === 'easy' ? 1.18 : pace === 'experienced' ? 0.88 : 1),
  );
  const firstArrival = addTime(departureTime, outboundMinutes);
  const activityStart = addTime(firstArrival, 30);
  const returnStart = addTime(activityStart, activityMinutes);
  const moodPlan: Record<string, { title: string; detail: string }> = {
    quiet: { title: 'Quiet nature time', detail: 'Keep the group small and leave space for an unhurried pause.' },
    reset: { title: 'Slow reset loop', detail: 'Build in a shaded break and keep the pace comfortable.' },
    curious: { title: 'Curiosity stop', detail: 'Take time for the local landscape, history and a short learning stop.' },
    bold: { title: 'Big-view outing', detail: 'Choose a clear turnaround point and keep the group together.' },
    challenge: { title: 'Challenge at group pace', detail: 'Set an agreed effort level and turnaround time before starting.' },
  };
  const mood = moodPlan[preferences.mood] ?? moodPlan.curious;
  const itinerary: ItineraryItem[] = [
    { id: 'depart', day: 1, time: departureTime, title: `Depart ${destinationOrigin(destination)}`, detail: `Illustrative outbound travel estimate: about ${outboundMinutes} minutes.`, durationMinutes: outboundMinutes },
    { id: 'arrival', day: 1, time: firstArrival, title: 'Arrival and local check-in', detail: 'Confirm access, permissions, weather and the group turnaround plan locally.', durationMinutes: 30 },
    { id: 'activity', day: 1, time: activityStart, title: `${mood.title} · ${destination.kind}`, detail: `${destination.name}: ${mood.detail} Keep the pace within the group's comfort and take breaks.`, durationMinutes: activityMinutes },
  ];

  if (days === 1) {
    itinerary.push({
      id: 'return',
      day: 1,
      time: returnStart,
      title: 'Return journey',
      detail: `Illustrative return travel estimate: about ${outboundMinutes} minutes. Planned return around ${addTime(returnStart, outboundMinutes)}; check daylight and local conditions.`,
      durationMinutes: outboundMinutes,
    });
  } else {
    itinerary.push(
      { id: 'overnight', day: 1, time: '17:30', title: 'Rest and overnight stay', detail: 'Accommodation is not booked or verified by this demo.', durationMinutes: 0 },
      { id: 'day-two', day: 2, time: '07:30', title: mood.title, detail: `A ${preferences.mood} morning near ${destination.name}; verify access and conditions locally.`, durationMinutes: 120 },
      { id: 'return', day: 2, time: '13:00', title: 'Return journey', detail: 'Allow for stops and confirm the return route before departure.', durationMinutes: outboundMinutes },
    );
  }
  return itinerary;
}

export function getPlannedReturnTime(
  destination: PlanningDestination,
  preferences: PlanningPreferences,
  departureTime = '06:00',
): string {
  const finalItem = buildItinerary(destination, preferences, departureTime).at(-1);
  return finalItem ? addTime(finalItem.time, finalItem.durationMinutes) : '18:00';
}

export function buildBudgetBreakdown(destination: PlanningDestination, days: number) {
  const total = destination.cost;
  const transport = Math.round(total * 0.36);
  const food = Math.round(total * 0.27);
  const stay = days > 1 ? Math.round(total * 0.22) : 0;
  const other = Math.max(0, total - transport - food - stay);
  return { transport, food, stay, other, total };
}

export function readinessAssessment(
  destination: PlanningDestination,
  preferences: PlanningPreferences,
  members: PlanningMember[],
  checklistDone: number,
  checklistTotal: number,
  scenario?: string,
  departureTime = '06:00',
  fitnessAssumption?: string,
) {
  const group = members.length
    ? members
    : [{ name: 'You', fitness: preferences.fitness, budget: preferences.budget }];
  const fitnessConflicts = group.filter(
    (member) => fitnessRank(member.fitness) < difficultyRank(destination.difficulty),
  );
  const returnTime = getPlannedReturnTime(destination, preferences, departureTime);
  const daylightConcern = durationDays(preferences.duration) === 1 && returnTime > '19:00';
  const lowestBudget = Math.min(Number(preferences.budget) || 0, ...group.map((member) => Number(member.budget) || 0));
  const budgetConcern = destination.cost > lowestBudget;
  const factors = [
    { label: 'Route grade', status: fitnessConflicts.length ? 'Review' : 'Within selected comfort', explanation: fitnessConflicts.length ? `${fitnessConflicts.map((member) => member.name).join(', ')} selected a lower comfort level than this illustrative grade.` : `The illustrative ${destination.difficulty.toLowerCase()} grade matches the group's selected comfort levels.` },
    { label: 'Daylight', status: daylightConcern ? 'Review' : 'Plan a local check', explanation: daylightConcern ? `The sample schedule returns around ${returnTime}; allow for daylight and delays.` : `The sample schedule returns around ${returnTime}; verify local daylight and travel time.` },
    { label: 'Budget', status: budgetConcern ? 'Review' : 'Within current estimate', explanation: budgetConcern ? `The ₹${destination.cost.toLocaleString('en-IN')} estimate exceeds the lowest current group limit of ₹${lowestBudget.toLocaleString('en-IN')}.` : `The ₹${destination.cost.toLocaleString('en-IN')} estimate is within the lowest current group limit of ₹${lowestBudget.toLocaleString('en-IN')}.` },
    { label: 'Date and duration', status: `${preferences.date} · ${preferences.duration}`, explanation: `The sample itinerary is generated for ${preferences.date}, ${preferences.duration}, with a ${departureTime} departure.` },
    { label: 'Simulation pace', status: fitnessAssumption || preferences.fitness, explanation: `The route simulation assumes a ${fitnessAssumption || preferences.fitness} pace; it is not an individual fitness or medical assessment.` },
    { label: 'Weather and access', status: 'Unverified', explanation: 'No live forecast, official closure or access status is connected.' },
    { label: 'Preparation', status: checklistDone === checklistTotal ? 'Checklist complete' : `${checklistTotal - checklistDone} remaining`, explanation: `${checklistDone} of ${checklistTotal} demo preparation checks are complete.` },
    { label: 'Scenario', status: scenario || 'No disruption selected', explanation: scenario ? `Reassess conditions after the "${scenario}" planning assumption.` : 'This is the current illustrative plan.' },
  ];
  const status =
    fitnessConflicts.length || daylightConcern || budgetConcern
      ? 'Review route, timing or budget'
      : checklistDone < checklistTotal
        ? 'Preparation checks remain'
        : 'Continue local verification';
  return { status, factors, returnTime, daylightConcern, fitnessConflicts: fitnessConflicts.map((member) => member.name), budgetConcern };
}

export type RouteCheckpoint = {
  name: string;
  distanceKm: number;
  elevationM: number;
};

export type RouteProfile = {
  distanceKm: number;
  durationMinutes: number;
  checkpoints: RouteCheckpoint[];
};

const routeProfiles: Record<string, RouteProfile> = {
  ananthagiri: { distanceKm: 6.4, durationMinutes: 210, checkpoints: [{ name: 'Trailhead', distanceKm: 0, elevationM: 520 }, { name: 'Forest gate', distanceKm: 1.8, elevationM: 590 }, { name: 'Ridge lookout', distanceKm: 4.1, elevationM: 735 }, { name: 'Return junction', distanceKm: 6.4, elevationM: 560 }] },
  bhongir: { distanceKm: 3.8, durationMinutes: 180, checkpoints: [{ name: 'Base approach', distanceKm: 0, elevationM: 410 }, { name: 'Fort steps', distanceKm: 1.1, elevationM: 485 }, { name: 'Rock saddle', distanceKm: 2.5, elevationM: 575 }, { name: 'Return gate', distanceKm: 3.8, elevationM: 430 }] },
  koilkonda: { distanceKm: 5.2, durationMinutes: 225, checkpoints: [{ name: 'Village trailhead', distanceKm: 0, elevationM: 390 }, { name: 'Lower gateway', distanceKm: 1.4, elevationM: 455 }, { name: 'Upper ridge', distanceKm: 3.5, elevationM: 610 }, { name: 'Return junction', distanceKm: 5.2, elevationM: 420 }] },
  medak: { distanceKm: 4.6, durationMinutes: 180, checkpoints: [{ name: 'Lake entry', distanceKm: 0, elevationM: 350 }, { name: 'Scrub path', distanceKm: 1.3, elevationM: 365 }, { name: 'Shore lookout', distanceKm: 3, elevationM: 355 }, { name: 'Return point', distanceKm: 4.6, elevationM: 350 }] },
  mallela: { distanceKm: 5.8, durationMinutes: 270, checkpoints: [{ name: 'Forest entry', distanceKm: 0, elevationM: 500 }, { name: 'Upper descent', distanceKm: 1.6, elevationM: 460 }, { name: 'Falls viewpoint', distanceKm: 3.6, elevationM: 340 }, { name: 'Return climb', distanceKm: 5.8, elevationM: 495 }] },
  laknavaram: { distanceKm: 5, durationMinutes: 210, checkpoints: [{ name: 'Lake approach', distanceKm: 0, elevationM: 280 }, { name: 'Forest path', distanceKm: 1.5, elevationM: 310 }, { name: 'Island viewpoint', distanceKm: 3.3, elevationM: 290 }, { name: 'Return point', distanceKm: 5, elevationM: 280 }] },
  kondapochamma: { distanceKm: 3.2, durationMinutes: 135, checkpoints: [{ name: 'Shore entry', distanceKm: 0, elevationM: 470 }, { name: 'Open path', distanceKm: 0.9, elevationM: 480 }, { name: 'Water outlook', distanceKm: 2.1, elevationM: 475 }, { name: 'Return point', distanceKm: 3.2, elevationM: 470 }] },
  gandikota: { distanceKm: 6.8, durationMinutes: 255, checkpoints: [{ name: 'Fort approach', distanceKm: 0, elevationM: 320 }, { name: 'Fort wall', distanceKm: 1.9, elevationM: 350 }, { name: 'Canyon lookout', distanceKm: 4.6, elevationM: 315 }, { name: 'Return trailhead', distanceKm: 6.8, elevationM: 325 }] },
};

export function getRouteProfile(destination: PlanningDestination): RouteProfile {
  return routeProfiles[destination.id] ?? {
    distanceKm: 4,
    durationMinutes: destination.difficulty.toLowerCase() === 'easy' ? 150 : 210,
    checkpoints: [
      { name: 'Trailhead', distanceKm: 0, elevationM: 400 },
      { name: 'First rest point', distanceKm: 1.2, elevationM: 430 },
      { name: 'Viewpoint', distanceKm: 2.8, elevationM: 470 },
      { name: 'Return junction', distanceKm: 4, elevationM: 410 },
    ],
  };
}
