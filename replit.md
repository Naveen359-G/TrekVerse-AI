# TrekVerse AI

Local-first weekend adventure planning with explainable recommendations, group compatibility, simulated routes and controlled replanning.

Read [AGENTS.md](AGENTS.md) for coding guardrails and required documentation maintenance. [README.md](README.md) indexes the project documentation.

## Run & Operate

- Existing workflow `artifacts/trekverse-ai: web` — run the product preview; managed workflows supply `PORT` and `BASE_PATH`
- `pnpm --filter @workspace/trekverse-ai run typecheck` — product typecheck
- `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/trekverse-ai run build` — product build
- `pnpm --filter @workspace/api-server run dev` — optional API scaffold; not the current planning backend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The local-first web MVP requires no database or API credentials. Database-backed workspace packages have their own environment requirements.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Product: React + Vite, browser-local storage, deterministic TypeScript planning and currency helpers
- API scaffold: Express 5
- Database scaffold: PostgreSQL + Drizzle ORM; not currently used for trip persistence
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: Vite for the web application; other workspace packages have separate build tooling

## Where things live

- `artifacts/trekverse-ai/` — product application and tests
- `artifacts/trekverse-project-deck/` — six-slide project presentation
- `artifacts/api-server/` and `lib/` — backend/shared workspace scaffolding
- `docs/` — requirements, architecture, feature status, demo, models, verification and limitations

## Architecture decisions

See [docs/DECISIONS.md](docs/DECISIONS.md): local-first persistence, deterministic intelligence, illustrative terrain, optional external services, and origin/currency preservation.

## Product

Discover, My Adventures, GroupSync, Digital Twin, Trail Intelligence, PlanB, QuestTrail, Impact and Settings. See [docs/FEATURE_STATUS.md](docs/FEATURE_STATUS.md) for actual implementation and verification boundaries.

## User preferences

Maintain project Markdown files alongside implementation changes. Update feature status for features, architecture for shared-state changes, and relevant tests/evidence for behavior changes; see AGENTS.md.

## Gotchas

- Never present sample routes, estimated costs, heuristic readiness or simulated terrain as live verified guidance.
- Never substitute another city's destinations or silently reinterpret stored monetary units.
- The current native Node test invocation is blocked by extensionless module resolution after the currency change. See [docs/TESTING.md](docs/TESTING.md); do not claim an unexecuted suite passes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
