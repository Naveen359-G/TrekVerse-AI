# Contributing

Read [README](README.md), [AGENTS](AGENTS.md), [feature status](docs/FEATURE_STATUS.md) and the affected source first.

## Setup and scope

Use Node.js 24 and pnpm from repository root. Install with `pnpm install --frozen-lockfile`; run the web app using the README instructions or its existing managed Replit workflow.

Keep each branch/change focused. Follow the repository's existing review/merge process; no mandatory branch naming scheme or configured CI guarantee is asserted here. Do not overwrite another contributor's work or modify unrelated artifacts.

## Code standards

- Retain TypeScript, React/Vite and the pnpm workspace structure.
- Prefer reusable pure planning helpers and focused components.
- Keep units explicit and normalize currencies before comparisons.
- Preserve older browser records; document migrations before changing their meaning.
- Do not hand-edit generated API files; update OpenAPI contracts and regenerate.
- Do not commit credentials, browser data, generated builds or large temporary captures.
- Preserve truthful labels for simulated, estimated and unverified information.

## Verification and review checklist

- [ ] Typecheck affected packages.
- [ ] Run affected logic tests with a verified runner; disclose blockers.
- [ ] Build after runtime or dependency changes.
- [ ] Check relevant desktop/mobile states after UI changes.
- [ ] Check saved-data preservation after storage, origin or currency changes.
- [ ] State which behavior was verified and which was not.

Commands, current runner limitations and acceptance cases are in [TESTING](docs/TESTING.md).

## Documentation is part of the change

- Feature changes: update `docs/FEATURE_STATUS.md` and `CHANGELOG.md`.
- Shared state or propagation: update `docs/ARCHITECTURE.md`.
- Stored types, units or migration: update `docs/DATA_MODELS.md`.
- Behavior: update relevant tests and dated evidence in `docs/TESTING.md`.
- Product/navigation changes: update PRD, flows and demo as appropriate.
- New assumptions or providers: update decisions, roadmap and limitations.

Use working relative links, real field names and clear implemented/planned distinctions. Never invent test passes, published URLs, public releases or safety claims to complete a checklist.
