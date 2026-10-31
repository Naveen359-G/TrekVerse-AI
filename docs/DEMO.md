# Buildathon demo

## 30-second pitch

“TrekVerse AI turns a free weekend into a group-ready plan. It explains which nearby places fit your budget and time, exposes group trade-offs, builds a dated itinerary and lets you preview alternatives when plans change. A simulated trek and lightweight quests keep the experience connected. This MVP works locally without a login; its routes, prices and readiness guidance are illustrative, not live safety information.”

## Reproducible 3–5 minute walkthrough

Use an isolated demo browser profile. Do not reset someone else's saved plans.

1. **0:00–0:30 — Set context.** Open the application Preview. From onboarding choose **Try Hyderabad demo adventure**. The built-in scenario uses Hyderabad, four people, a one-day outing and INR 2,000 per person.
2. **0:30–1:10 — Explain the plan.** In My Adventures show Ananthagiri Hills, the dated itinerary and illustrative INR 1,450 estimate. Open Discover to show hard exclusions and fit explanations. Avoid promising a particular card order.
3. **1:10–1:50 — Align the group.** Open GroupSync. Show member preferences, compatibility factors and separate votes. Do not claim edits are being synchronized to other devices.
4. **1:50–2:40 — Adapt deliberately.** Open PlanB and preview “Departure is two hours late.” Show what changes before applying. Apply, inspect the itinerary/readiness, then restore the prior version. If a scenario has no feasible option, explain the empty state rather than presenting an infeasible option as compliant.
5. **2:40–3:20 — Simulate, don't navigate.** Open Digital Twin, start briefly, pause and show checkpoints. Call it an accelerated simulation, not live movement.
6. **3:20–4:00 — Finish the story.** Show readiness preparation, a QuestTrail action and dated self-reported Impact entries. State that progress and saved plans remain in this browser.
7. **Optional 4:00–5:00 — Location and currency.** In Settings enter “Malaysis.” Show country-to-city guidance; choose Kuala Lumpur and save the brief. Confirm Malaysian options and preservation of the old trip. Show the currency selector and dated exchange-reference disclosure; do not call conversion a live quote. If demonstrating online discovery, explicitly search/select a city and find nearby places; call the results unverified map research, not generated trips. Have the offline demo ready if a provider is unavailable.

## Standout features

Origin correctness; explainable group trade-offs; controlled PlanB apply/restore; one connected planning/simulation context; honest local-first boundaries.

## Fallback presentation

The [project deck](../artifacts/trekverse-project-deck/) is served separately at `/trekverse-deck/`. Static captures are available for [My Adventures](../artifacts/trekverse-project-deck/public/my-adventures.jpg) and [Digital Twin](../artifacts/trekverse-project-deck/public/digital-twin.jpg). They are presentation snapshots, not current test evidence.

## Expected questions

- **Is this really AI?** Current intelligence is deterministic scoring, heuristics and a rule-based assistant; no LLM is connected.
- **Is it safe to follow the route?** No. Terrain, timing and access are illustrative; verify independently.
- **Can friends join remotely?** Not yet; group editing is local to this browser.
- **Are prices and exchange rates current?** No. Prices are examples; exchange conversion uses a disclosed dated reference.
- **What happens offline?** Local planning calculations and stored data need no live API; first-load assets and hosted fonts can still require connectivity.
- **What's next?** See the roadmap; distinguish implemented online map research from future verified routes, live weather and collaborative planning.
