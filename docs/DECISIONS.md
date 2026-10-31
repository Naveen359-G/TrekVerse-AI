# Architecture decisions

Baseline recorded 2026-10-31. These document existing choices, not invented release history.

## ADR-001 — Browser-local persistence

**Decision:** Keep the MVP's trip data in browser localStorage.

**Why:** Planning should work without credentials or backend setup.

**Alternatives/trade-offs:** Cloud persistence enables shared groups and backup but adds identity, permissions, conflict handling and operations. Local storage lacks those guarantees.

**Revisit when:** Real cross-device or multi-user collaboration is approved. Define migration/backup behavior first.

## ADR-002 — Deterministic intelligence

**Decision:** Use explainable scoring, compatibility rules, scenario transforms and a rule-based assistant.

**Why:** Predictable, inspectable operation without mandatory LLM access.

**Trade-offs:** Less flexible conversation and no autonomous reasoning over verified external data.

**Revisit when:** An optional grounded AI feature has a clear user benefit, evaluation and failure policy.

## ADR-003 — Illustrative terrain and readiness

**Decision:** Use clearly disclosed sample profiles and contextual readiness heuristics.

**Why:** Verified trail geometry, hazards and live access information are not connected.

**Trade-offs:** The simulation cannot be used as navigation or safety clearance.

**Revisit when:** Licensed, attributable route data and current advisories are available with appropriate validation.

## ADR-004 — No mandatory live service

**Decision:** Catalog-based planning remains independent of mandatory APIs.

**Why:** The MVP must remain usable without keys, login or provider availability.

**Trade-offs:** Coverage is limited and prices/weather/access are not live.

**Revisit when:** Optional global discovery or weather is integrated with explicit timeouts, attribution and offline/no-results handling.

## ADR-005 — Origin and currency are stored context

**Decision:** A search change must not relabel an existing trip; missing legacy monetary units mean INR, not an inferred country currency.

**Why:** City-dependent estimates and monetary values lose their meaning if only their labels change.

**Trade-offs:** Migration and edit handlers must distinguish a discovery brief from trip snapshots.

**Revisit when:** A deliberate versioned migration or explicit user conversion is designed; never reinterpret legacy values silently.
