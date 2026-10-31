# Working on TrekVerse AI

## Scope and source of truth

Read `README.md`, `docs/FEATURE_STATUS.md` and the relevant source before editing. This is a pnpm monorepo; the product web app is `artifacts/trekverse-ai`, not the repository root. Preserve working functionality and existing artifact boundaries. Do not modify unrelated artifacts or another agent's in-progress work.

The source is authoritative for current behavior. Documentation must distinguish implemented, tested, simulated, planned and blocked work. Never describe an accepted or in-progress task as shipped before its changes are merged and inspected.

## Product guardrails

- Keep the MVP usable without mandatory authentication, external API keys or database access.
- Never fabricate live weather, verified routes, precise terrain, closures, availability, bookings or emergency assistance.
- Do not imply the deterministic assistant is an LLM or a trained prediction system.
- Simulated progress is not GPS tracking; readiness is not safety clearance.
- Recommend places matching the entered starting city. Ask for a city when given a country; never silently substitute Hyderabad.
- Searching another origin must not rewrite a saved trip's origin, destination or monetary units.
- Missing legacy currency means INR, including international trips. Never infer old stored currency from a location or silently relabel amounts.
- Votes remain separate from compatibility. Reward a quest only once. Impact is self-reported, not independently verified.
- Never delete or reset user browser data to make a change or a test appear successful.

## Structure and conventions

- `src/App.tsx`: navigation, shared trip state, persistence and screen handlers.
- `src/lib/planning.ts`: matching, compatibility, itinerary, budgets, readiness and sample route profiles.
- `src/lib/currency.ts`: supported currencies, dated conversion reference and formatting.
- `src/lib/regional-destinations.ts`: origin-specific illustrative catalogs.
- `src/components/`: reusable inputs and budget presentation.
- `src/index.css`: theme and responsive styling.
- `tests/*.test.mts`: planning and currency logic tests.

Paths above are relative to `artifacts/trekverse-ai`. Prefer focused helpers/components over expanding the large app component. Retain React/TypeScript/Vite and existing libraries unless a change requires otherwise. Use pnpm; do not add a second package manager or lockfile.

For API changes, inspect `lib/api-spec/openapi.yaml` first, update the contract and regenerate clients/schemas rather than hand-editing generated output. Do not introduce persistence infrastructure without explicit scope.

## Verification

Run the product typecheck and affected logic checks. Build when runtime code or packaging changes. Use the product's explicit tsx test scripts documented in `docs/TESTING.md`, not the older native Node invocation. Do not report unexecuted assertions as passing.

For UI changes, verify the relevant screen and mobile layout. Use proportionate browser testing for changed saved-data, authentication or payment journeys; documentation-only work does not require a browser test. Restart the existing managed workflow after runtime changes, not after Markdown edits.

## Required documentation maintenance

For every product change:

1. Update `docs/FEATURE_STATUS.md` with actual behavior, evidence, limitations and remaining actions.
2. Update `CHANGELOG.md` under Unreleased for meaningful user-visible changes.
3. Update `docs/ARCHITECTURE.md` when shared state, module dependencies or change propagation changes.
4. Update `docs/DATA_MODELS.md` when stored shapes, currencies, units or migration behavior changes.
5. Update relevant test cases and `docs/TESTING.md`; record date, scope, command and outcome, including blockers.
6. Update requirements, user flows, demo, limitations or roadmap when the change affects them.

Keep links valid, examples aligned with real types and claims backed by observed behavior. Do not invent release versions, test results or published URLs.
