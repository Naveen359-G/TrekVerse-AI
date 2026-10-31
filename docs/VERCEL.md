# Deploy TrekVerse AI on Vercel

## Deployment scope

The main application is a static React/Vite site. Vercel serves the built HTML, JavaScript, CSS and public images; no long-running Node server is required.

This configuration deploys **TrekVerse AI only**. It does not deploy the optional Express API, component sandbox or `/trekverse-deck/` presentation. Do not assume those separate Replit artifacts exist on the Vercel domain.

No API key, database, `SESSION_SECRET`, Replit identity or authentication service is required for the current local-first application.

## Import settings

Push the repository to your Git provider, then import that repository into Vercel.

| Setting | Required value |
| --- | --- |
| Root Directory | Repository root (`.`); leave the Root Directory field empty if it already means repository root |
| Framework Preset | Vite |
| Node.js | 24.x, also declared in root `package.json` |
| Package manager | pnpm 10.26.1 |
| Install Command | `npx --yes pnpm@10.26.1 install --frozen-lockfile --prod=false` |
| Build Command | `pnpm run build:vercel` |
| Output Directory | `artifacts/trekverse-ai/dist/public` |
| Required environment variables | None |

Root `vercel.json` supplies the framework, commands, output path, SPA rewrite and basic response headers. Avoid conflicting dashboard overrides. **Do not set Root Directory to `artifacts/trekverse-ai`**: the app depends on root workspace catalogs, overrides and shared packages.

The explicit install command prevents an older pnpm version from being chosen for the custom command. It installs the pinned version through npm's `npx`; no global pnpm or Corepack opt-in is required on Vercel. `--prod=false` ensures build-time devDependencies are present even if the install environment uses `NODE_ENV=production`.

## Files that must be included in Git

- `vercel.json`, root `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`
- `tsconfig.base.json` and relevant workspace package manifests/source
- `artifacts/trekverse-ai/`, including source, Vite config, HTML and `public/`
- Shared `lib/` packages referenced by workspace dependencies or TypeScript references

Keep the monorepo structure intact. Do not replace the lockfile, use npm to install workspace dependencies, disable supply-chain safeguards, or remove native build-tool dependencies to make installation look successful.

Build dependencies currently reside in `devDependencies`, which is normal for Vite. Do **not** set `NPM_CONFIG_PRODUCTION=true` or use `pnpm install --prod`: Vite, TypeScript, Tailwind and their build tooling must be installed.

## Environment and build behavior

`vite.config.ts` now defaults to `BASE_PATH=/` and development port `5173` when values are absent. Replit workflows can continue supplying their managed values. Vercel does not run the development server and does not need `PORT`.

Do not copy a Replit-specific `BASE_PATH` into Vercel. The configured app is served at the Vercel domain root. Replit development overlay/banner plugins are excluded from production builds.

The Vercel build runs the app typecheck and Vite production build, not the root recursive build. This avoids unrelated API/database/slide build requirements. It is not a substitute for running the regression suite before releasing a product change.

## Routing and assets

The rewrite sends non-file requests to `/index.html` so a refresh or direct SPA URL does not produce a host-level 404. Existing static files are served normally.

The current module tabs use application state, not nine distinct URL pages. A rewrite does not create a new page or preserve the selected tab across reloads. `/api/*` is not a working backend on this static deployment.

Public images and the favicon are bundled from the app's `public/` directory. Generated PowerPoint files in `docs/` are not included in the website output.

## Optional external services

These requests originate in the user's browser; no Vercel server function or secret is involved:

- Nominatim: explicitly requested city lookup.
- Overpass/OpenStreetMap: explicitly requested nearby map research.
- Frankfurter/ECB: optional exchange-rate refresh.
- Google Fonts: hosted typography, with CSS fallback fonts.

Network policy, provider availability, quotas, CORS changes and blockers can affect these services independently of a successful deployment. Preserve the existing offline/error states. Do not mark map candidates as verified routes or rate responses as guaranteed retail quotes.

## Browser-local data

Replit, Vercel preview deployments and the final custom domain are different browser origins. Saved adventures, preferences, progress and cached results **do not automatically migrate** between them. Each origin has its own browser storage.

Choose a stable production domain for ongoing use. Do not delete existing Replit data to test Vercel, and do not promise account-based synchronization or backup.

## Pre-release and smoke checks

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run build:vercel
pnpm --filter @workspace/trekverse-ai run test
pnpm --filter @workspace/trekverse-ai run typecheck:tests
```

After Vercel finishes:

1. Open the generated deployment URL; check for an error overlay or missing assets.
2. Confirm onboarding, city validation and the offline Hyderabad demo work.
3. Select a destination, save it and reload on the **same origin**.
4. Verify images/CSS and a direct URL refresh.
5. Test optional city research and rate refresh separately; if a provider fails, confirm the local planner remains usable.
6. Check the browser console and Vercel build logs for actionable errors.

The local production build can be verified here. An actual Vercel deployment still needs to be run and its URL smoke-tested; no deployment has been performed on the user's behalf by this configuration task.

## Troubleshooting

| Symptom | Likely cause / action |
| --- | --- |
| `catalog:` / `workspace:` protocol error | npm or wrong root directory; use repository root and the configured pnpm install |
| Frozen lockfile mismatch | Commit matching manifests and lockfile; reproduce installation locally, not `--no-frozen-lockfile` in production |
| Vite or TypeScript missing | Production-only dependency installation; include devDependencies at build time |
| `PORT` / `BASE_PATH` exception | Old revision or wrong artifact config; deploy the updated web Vite config |
| Missing output directory | Wrong build command/root; expected `artifacts/trekverse-ai/dist/public/index.html` |
| Blank page or wrong asset URLs | Remove an imported Replit-specific base path; inspect failed network requests |
| API 404 / HTML parsed as JSON | The Express scaffold is not hosted; current app should not depend on it |
| Old trips missing on Vercel | Expected origin isolation, not automatic data loss from the Replit origin |
| Online search/rates fail | Inspect provider/network error; the curated planner must remain usable |

## Official references

- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Build configuration](https://vercel.com/docs/builds/configure-a-build)
- [Package managers](https://vercel.com/docs/package-managers)
- [Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
