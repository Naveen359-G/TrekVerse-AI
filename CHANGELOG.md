# Changelog

Meaningful changes are recorded here. The package currently reports `0.0.0`; no public release sequence is asserted.

## [Unreleased]

### Added

- Origin-specific sample catalogs for ten cities with explicit country-to-city guidance.
- Explainable recommendations, GroupSync, dated itineraries, locally saved adventures and connected PlanB previews/revisions.
- Simulated route progress, one-time quest rewards and dated self-reported impact.
- INR, MYR and SGD budget selection, conversion and formatting with a disclosed fixed-date reference.
- Structured product, technical, demo, testing and safety Markdown documentation.

### Changed

- Destination pools and alternatives use the selected origin instead of only changing the displayed city.
- Existing trip context is retained when the discovery origin changes.
- Missing currency in legacy records retains INR semantics.
- Agent/contributor guidance requires documentation maintenance alongside features.

### Fixed

- Unrelated Hyderabad recommendations after entering another supported starting city.
- Silent city-based relabeling risk for existing trip origins.

### Known issues

- Native Node test execution is blocked by extensionless module resolution after the currency change.
- Global discovery is in progress separately; the merged catalog is not worldwide coverage.
- Exchange rates are frozen to 2025-01-02, not current rates.
- Route geometry, costs, access and readiness are illustrative; no live safety service is connected.

Documentation snapshot: 2026-10-31. See [feature status](docs/FEATURE_STATUS.md) and [testing](docs/TESTING.md) for evidence and unfinished verification.
