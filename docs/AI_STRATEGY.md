# Intelligence strategy

## What runs today

The MVP uses deterministic TypeScript logic, not an LLM service or trained prediction model. The assistant uses keyword/rule-based replies and known UI actions.

## Recommendation engine

1. Resolve a supported starting city; country and unsupported inputs require explicit handling.
2. Restrict candidates to that origin's catalog.
3. Evaluate hard issues such as budget, travel window, trip duration, group range and member availability/access constraints.
4. Explain weighted fit factors separately from eligibility.

Current recommendation weights: budget 20, travel 15, duration 15, group fitness 20, group size 10, activity 12 and mood 8, summing to 100. A high fit score does not override a hard issue or imply safety.

## GroupSync

Compatibility considers budgets, time, fitness, activities, group size and access needs. Budget comparisons normalize member amounts into the active plan currency. Votes are independent social signals, not hidden scoring inputs. The optimizer prefers eligible options; a closest compromise must remain identified as such.

## Itinerary and replanning

Itinerary generation combines date, departure, destination travel assumptions, duration, mood and pace. PlanB applies deterministic scenario patches, previews candidates, retains prior context and updates connected calculations only when accepted.

## Readiness and simulation

Readiness is a heuristic explanation over timing, group context and preparation. It does not consume verified real-time weather, access or emergency feeds. The twin advances along illustrative route profiles; it is not a physical model validated against a trail.

## Possible future LLM layer

An optional model could explain trade-offs or parse conversational briefs, but must not invent routes, forecasts, prices or permissions. Require grounded provenance, explicit uncertainty, controlled action confirmation, privacy limits and evaluation against deterministic constraints. Keep local planning operational without that model.
