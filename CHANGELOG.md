# Changelog

Meaningful changes are recorded here. The package currently reports `0.0.0`; no public release sequence is asserted.

## [Unreleased]

### Added

- Repository-root Vercel configuration, pinned Node/pnpm metadata and an app-only deployment build command.
- Static-host Vite defaults and a Vercel guide covering monorepo installation, routing, external providers and browser-origin data isolation.

- Repeatable saved-trip currency/migration regressions against the actual React app, with isolated storage and coverage for INR/MYR/SGD save/open/reload/duplicate, PlanB acceptance/restoration and mixed member budgets.
- Product test scripts and the `trekverse-regressions` validation gate using an explicit TypeScript/JSX runner.
- Origin-specific sample catalogs for ten cities with explicit country-to-city guidance.
- Explainable recommendations, GroupSync, dated itineraries, locally saved adventures and connected PlanB previews/revisions.
- Simulated route progress, one-time quest rewards and dated self-reported impact.
- INR, MYR and SGD budget selection, conversion and formatting with a disclosed fixed-date reference.
- Structured product, technical, demo, testing and safety Markdown documentation.
- Optional Nominatim city search and Overpass nearby map research with disambiguation, attribution, 24-hour caching and explicit research-only boundaries.
- Expanded project deck from six to nine slides, covering city discovery, multi-currency planning and connected architecture/documentation.

### Changed

- Legacy active trips without preferences recover their destination origin before starter defaults are applied; missing currency still means INR and stored amounts remain unchanged.
- Destination pools and alternatives use the selected origin instead of only changing the displayed city.
- Existing trip context is retained when the discovery origin changes.
- Missing currency in legacy records retains INR semantics.
- Agent/contributor guidance requires documentation maintenance alongside features.

### Fixed

- Unrelated Hyderabad recommendations after entering another supported starting city.
- Silent city-based relabeling risk for existing trip origins.

### Known issues

- Native Node test execution is blocked by extensionless module resolution after the currency change.
- Online map research is available beyond offline catalogs, but does not provide verified routes, costs or full trip planning for discovered points.
- Exchange rates default to the bundled 2025-01-02 reference. Optional manual refresh selects the latest published Frankfurter/ECB reference for new plans, with dated provenance and explicit errors. Saved trips retain historical rate snapshots and amounts; opening them does not replace the new-plan rate selection.
- Route geometry, costs, access and readiness are illustrative; no live safety service is connected.

Documentation snapshot: 2026-10-31. See [feature status](docs/FEATURE_STATUS.md) and [testing](docs/TESTING.md) for evidence and unfinished verification.
