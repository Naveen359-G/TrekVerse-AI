# Feature status

Baseline: **2026-10-31**, after merged multi-currency support and optional online discovery. In-progress work on other branches is not included.

## Status vocabulary

- **Not Started:** no implementation verified in the current code.
- **Partial:** some capability exists, but the stated scope is incomplete.
- **Implemented:** current code provides the listed behavior.
- **Tested:** the listed behavior has explicit dated verification evidence.
- **Blocked:** verification or delivery cannot currently proceed as described.

“Implemented” does not mean live data, production certification or current end-to-end coverage.

| Module / capability | Status | What exists | Simulation, gap or next action |
| --- | --- | --- | --- |
| EscapeOS: brief and Discover | Implemented | Ten origin-specific catalogs; budget, travel, duration and group constraints; explanations, comparison and bookmarks | Curated examples, not worldwide discovery; activity and mood influence fit rather than universal hard exclusions |
| Origin correctness | Tested | Country/typo guidance, no unrelated fallback, origin-preserving saved plans | Desktop/mobile browser journey passed before the currency merge on 2026-10-31; rerun if related code changes |
| My Adventures | Implemented | Dated itinerary, budget breakdown, local save/open/update/duplicate/delete | No cloud backup or cross-device sync |
| GroupSync | Implemented | Member inputs, six compatibility factors, optimization and separate votes | One browser edits the group; no invitations or real-time multi-user collaboration |
| TrekTwin / Digital Twin | Implemented | Timer, pause/resume, pace, checkpoints and retained progress | Sample profiles and synthetic terrain; not a navigable digital replica or GPS tracker |
| TrailIQ / Trail Intelligence | Implemented | Checklist and contextual readiness factors | No live weather, verified access, hazard feed or safety guarantee |
| PlanB | Implemented | Six scenario types; preview/reject/apply/restore connected plans | No verified forecast or closures; dedicated regression coverage for full state propagation remains desirable |
| QuestTrail | Implemented | One-time XP, completion history and badges | Local game mechanics, not independently verified trail completion |
| TrekForGood / Impact | Implemented | Dated self-reported activity records | No impact verification, charity transfer or environmental measurement |
| Assistant | Implemented | Keyword/rule-based contextual replies and actions | Not LLM-backed; no autonomous external actions |
| INR / MYR / SGD | Implemented | Currency selection, conversion, formatting, consistent budget calculations and INR legacy compatibility | Bundled 2025-01-02 default with optional refreshed references for new plans; not retail rates or live destination quotes |
| Planning/currency test execution | Blocked | Twelve planning and seven currency test definitions are present | Direct Node command stops before assertions on an extensionless `currency` import; see [testing](TESTING.md) |
| Optional online place discovery | Implemented | Explicit city search/disambiguation via Nominatim, nearby OSM candidates via Overpass, source attribution, 24-hour cache and error/empty states | Research only within 25 km; straight-line distances, not verified trips; no fitness ranking or itinerary generation for online candidates |
| Optional exchange-rate refresh | Implemented | Manual Frankfurter/ECB retrieval with provider, date, status and explicit errors; saved-trip historical snapshots | No automatic refresh or live retail quotes; saved amounts remain unchanged |
| Authentication and cloud sharing | Not Started | No login required | Optional future capability, not an MVP prerequisite |
| Booking, payments, emergency response | Not Started | No connected implementation | Exploratory only |
| Project deck | Implemented | Nine-slide overview at `/trekverse-deck/`, including discovery, currency and connected architecture/documentation | Earlier product captures are labeled sample views; no unsupported current test-pass counts |

## Open issues and checks

1. Repair or standardize the test runner before claiming all current planning, currency and discovery cases pass.
2. Verify saved-trip currency switching, PlanB restore and mixed-currency group budgets in the browser after relevant changes.
3. Keep online map research separate from curated trip planning; do not imply map candidates have verified costs, grades or routes.
4. Expand automation for timer behavior, quests, local persistence failure and full PlanB apply/restore propagation.

Update this file with each merged feature, and label the scope/date of new evidence rather than carrying old “Tested” claims forward automatically.
