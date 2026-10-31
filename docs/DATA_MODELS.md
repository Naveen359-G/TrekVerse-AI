# Data models

Current contracts: `artifacts/trekverse-ai/src/App.tsx`, `src/lib/planning.ts` and `src/lib/currency.ts`. This is a browser-local model, not a server database schema. `?` below means optional.

| Entity | Fields / representation |
| --- | --- |
| Adventure | `id?: string`, `destinationId: string`, `title/status: string`, `progress/checkpoint/xp/impact: number`, `checklist/tasks: string[]`, `votes: Record<string,string>`, `members: Member[]`; optional date, duration, departureTime, elapsedMinutes, twinFitness, revision, scenarioLabel, itinerary, budgetBreakdown, preferences, contributions, history, completedQuestIds, questHistory, earnedBadges, previousPlan |
| Destination | `id/name/region/difficulty/kind: string`, `drive/hours/cost: number`, `mood: string[]`; UI adds image/desc; optional originCity, durationDays, minGroup, maxGroup, highlights, hazards, preparation, dataStatus; planning contract also permits currency |
| GroupMember | Named `Member` in UI / `PlanningMember` in calculations: name, fitness, budget; optional currency, activity, availableHours, mobility |
| Preferences | city, date, duration, group, fitness, budget, travel, activity, mood, needs; UI stores most input values as strings; currency is INR/MYR/SGD |
| Vote | A named member's string value inside the adventure's votes record; not an independent persisted entity |
| ItineraryItem | `id: string`, `day: number`, `time: string`, `title: string`, `detail: string`, `durationMinutes: number` |
| BudgetItem | Rendered category rows, not a stored item table; `budgetBreakdown` groups transport, food, stay, other and total values |
| SimulationCheckpoint | Route profile checkpoint: name, distanceKm and elevationM; associated with a sample profile's distance and duration |
| DisruptionScenario | UI scenario ID plus preview logic, not a standalone persisted model; IDs: rain, late, budget, cancel, fitness, unavailable |
| Quest | UI-defined quest actions plus persisted completion IDs, history, XP and badges; not a server quest catalog |
| ImpactEntry | Named `Contribution`: `id/kind/date: string`, `amount: number`, `reported: boolean` |

## Units and relationships

- Destination IDs connect active and saved adventures to the local catalog.
- `drive` is an illustrative distance in kilometers from that destination's origin; `hours` is the travel-time estimate used by planning.
- Route progress is a percentage, elapsed time is simulated minutes, profile elevations are illustrative meters.
- Budgets are per-person inputs; member currency can differ from the preference currency and must be converted before comparison.
- Destination sample costs without a currency are INR. Never relabel a number as MYR/SGD solely because its place is international.
- `previousPlan` stores prior destination/context plus selected roster, vote, checklist, task and simulation fields for explicit restore. It is not an unlimited revision archive.

## Example preferences

```json
{
  "currency": "INR",
  "city": "Hyderabad",
  "date": "2026-11-01",
  "duration": "1 day",
  "group": "4",
  "fitness": "Easy",
  "budget": "2000",
  "travel": "5",
  "activity": "Any",
  "mood": "curious",
  "needs": ""
}
```

Example only; runtime onboarding chooses a future date rather than fixing the date above.

## Browser storage

| Key | Value |
| --- | --- |
| `tv-prefs` | Current preference object as JSON |
| `tv-adventure` | Active adventure as JSON |
| `tv-adventures` | Saved adventure array as JSON |
| `tv-saved` | Bookmarked destination ID array as JSON |
| `tv-onboard` | Completion marker `done` |
| `tv-discovery-v1:*` | Optional city/place result caches with fetch timestamps and a 24-hour validity window |

Online discovery has separate `DiscoveredCity` (id, label, country, lat, lon, sourceUrl), `NearbyPlace` (id, name, kind, lat, lon, distanceKm, sourceUrl) and `DiscoveryResult<T>` (items, fetchedAt, cached) contracts in `src/lib/discovery.ts`. A map candidate is not a `Destination` with known travel/cost/grade assumptions.

Normalization supports older local records. Missing currency means INR in preferences, members and restored contexts; preserve that interpretation even when the origin is international. There is no documented stable external API or versioned database schema for these objects.
