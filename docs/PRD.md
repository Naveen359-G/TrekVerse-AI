# Product requirements

## Vision and users

TrekVerse AI helps friends, beginners and mixed-fitness groups turn a free weekend into a nearby, understandable and adaptable outing.

Primary jobs: compare feasible ideas, understand group trade-offs, keep a shared plan in one place, rehearse a route and revise the plan when assumptions change.

## MVP scope and module requirements

| Module | User story | Acceptance criteria |
| --- | --- | --- |
| EscapeOS | As an organizer, I want nearby options that respect my brief | Only the selected origin's catalog is considered; countries request a city; unsupported origins have explicit empty states; hard exclusions explain their reasons |
| My Adventures | I want to retain more than one trip | Save, open, update, duplicate and delete locally; reload preserves stored data; changing search origin never relabels an existing trip |
| GroupSync | I want an explainable compromise | Consider budgets, availability, fitness, activity, group size and access needs; votes do not alter compatibility; infeasible compromises remain visibly flagged |
| TrekTwin | I want to rehearse progress | Simulate elapsed time, pace and checkpoints; pause/resume/reset; clearly disclose synthetic terrain and lack of GPS |
| TrailIQ | I want preparation and readiness guidance | Reflect checklist, group and timing context; explain concerns; never claim a route is safe or open |
| PlanB | I want controlled alternatives | Preview before applying; rejection leaves the trip unchanged; acceptance updates related calculations; restore recovers the prior stored plan context |
| QuestTrail | I want lightweight motivation | Persist completion and history; prevent duplicate XP for an already completed quest |
| TrekForGood | I want to record contributions | Save dated self-reported entries; avoid unverifiable environmental claims |
| Currency | I want understandable international budgets | INR, MYR and SGD formatting and calculations agree; distinguish dated conversion assumptions from prices; missing legacy units remain INR |

## Nonfunctional requirements

- Local-first operation without mandatory accounts, credentials or paid services.
- Responsive navigation with usable mobile inputs and clear empty/error states.
- Explainable deterministic calculations; no unsupported AI claims.
- Preserve browser-local data and migration semantics.
- Label estimated cost, terrain, duration and access information honestly.
- Maintain the Markdown documentation alongside behavior and tests.

## Proposed success metrics

These are targets, **not measured results**:

- No destination suggestions from an unrelated starting-city catalog.
- No silent monetary-unit or origin changes when opening old saved trips.
- An organizer can complete the core demo without credentials.
- A user can distinguish a previewed PlanB from the accepted trip.
- Users understand that readiness and simulation are not safety or navigation services.

Analytics collection and quantitative targets require a separate privacy-conscious implementation.

## Out of scope

Live collaboration, verified trail navigation, current weather/closures, emergency response, booking and payments are not completed MVP features. Global discovery and exchange refresh must be evaluated separately from current catalog/conversion behavior. See [roadmap](ROADMAP.md).
