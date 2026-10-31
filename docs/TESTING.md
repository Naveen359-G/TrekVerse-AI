# Testing and verification

Baseline: **2026-10-31**. Record the code scope and date with every result. Test definitions, prior browser evidence and current successful execution are different things.

## Commands

From repository root:

```sh
pnpm --filter @workspace/trekverse-ai run typecheck
pnpm --filter @workspace/trekverse-ai run typecheck:tests
pnpm --filter @workspace/trekverse-ai run test
# Just the saved-trip migration and persistence regressions:
pnpm --filter @workspace/trekverse-ai run test:persistence
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/trekverse-ai run build
```

The product declares `tsx` as a direct development dependency. Its scripts use `tsconfig.test.json` for TypeScript paths and automatic JSX transformation, fixing the former native Node extensionless-import blocker. Use these scripts rather than the old `node --experimental-strip-types` invocation. Node 24 is the workspace runtime; the installed jsdom requires Node 22.22.2+, 24.15.0+, or 26+.

The named validation `trekverse-regressions` runs the full test suite and the test typecheck as a repeatable completion gate.

## Saved-trip regression harness

`tests/persistence.test.mts` mounts the actual `App.tsx` with React DOM in an isolated jsdom document. It clicks rendered controls, dispatches native input/change events, lets React effects run through `act`, and checks the serialized `tv-adventure`, `tv-adventures` and `tv-prefs` records. Reload means unmounting and mounting a fresh app tree against retained storage, so lazy migration loaders run again. No production storage, server, credentials or external requests are required.

The 11 cases cover:
- Kuala Lumpur and Singapore legacy active/saved/prior records without currency: INR defaults, unchanged amounts, idempotent reload, open/save and restore.
- A legacy record with no preference context: destination origin is recovered without inferring monetary units. The active loader must not prefill starter preferences before migration sees the raw record.
- Search-currency switches and independently owned INR/MYR/SGD plans.
- Save/update/open/reload/duplicate in all three currencies, mixed member units, and adding a member to a duplicate without rewriting the original or other saved trips.
- PlanB budget preview/rejection, acceptance, explicit save/reopen/reload, successive member-cancellation revision, and restoration of the original currency, budgets, members and budget breakdown.
- Historical rate ownership during open/duplicate/reload/PlanB/restore, independently of browsing rates.

These are DOM integration tests, not real-browser layout, cross-tab, network-provider or storage-quota tests. PlanB coverage targets budget/member-cancellation money preservation, not every disruption's full state propagation.

## Evidence log

| Date | Scope | Outcome |
| --- | --- | --- |
| 2026-10-31 | Earlier origin-filtering implementation: 12 planning tests | Passed before the currency merge; historical evidence only |
| 2026-10-31 | Earlier origin-switch browser journey, desktop and 390px | Passed: country guidance, Malaysian-only results, saved KL origin retained after Hyderabad search, unsupported city empty state |
| 2026-10-31 | Current merged app: product typecheck | Passed during this documentation update |
| 2026-10-31 | Current merged app: direct Node invocation of both test files | Blocked before assertions by `ERR_MODULE_NOT_FOUND` for `src/lib/currency` |
| 2026-10-31 | Current merged app: browser currency and complete PlanB regression pass | Not run in this documentation update |
| 2026-10-31 | Updated nine-slide project deck | Slide validation, deck typecheck and production build passed; `/allslides` rendered nine 1920×1080 frames with loaded images and no intersecting text blocks; updated cover captured |
| 2026-10-31 | Saved-trip regression change: `pnpm --filter @workspace/trekverse-ai run test` | Passed: 39 tests (12 planning, 7 currency, 9 discovery, 11 persistence) |
| 2026-10-31 | Saved-trip regression change: product and test typechecks; production build using commands above | Passed |
| 2026-10-31 | Saved-trip regression change: restarted product workflow and captured `/` | Running cleanly; onboarding rendered with no browser errors. This is not a saved-trip browser pass |

Earlier rows are historical evidence. The saved-trip regression change executes all 39 current tests through the supported runner; it does not retroactively turn earlier blocked runs into passes.

## Coverage inventory

Planning definitions cover origin aliases/country handling, candidate-pool isolation, optimizer origin, non-relaxable mismatch, itinerary origin, catalog integrity, hard limits, group budgets/time/access, compatibility factors, mood/return timing, late readiness, checkpoints and budget totals.

Currency definitions cover INR legacy defaults, dated conversion/reference pairs, agreement across ranking/compatibility/readiness, mixed-currency members, category totals, invalid/zero budget behavior and percentage budget reduction.

## Required acceptance journeys

| Journey | Checks | Current automation/evidence |
| --- | --- | --- |
| Recommendation constraints | Hard limits, same-origin pool, explicit exclusion reasons | Logic definitions; earlier origin browser pass |
| GroupSync | Explain factors, separate votes, lowest member budget | Partial logic coverage; browser regression needed after relevant edits |
| PlanB | Reject is inert; apply updates itinerary/budget/context; restore recovers prior state | DOM integration coverage for budget reduction, cancellation, chained revisions and monetary restoration in INR/MYR/SGD; other scenarios still need targeted coverage |
| Digital Twin | Start/pause/resume, pace, checkpoint boundaries, one timer, reload | Manual acceptance required; no dedicated timer automation recorded |
| Local saved data | Save/open/update/duplicate/delete, reload, old units and origins | Automated DOM save/open/update/duplicate/reload/migration checks; delete, storage failures and real-browser behavior are not covered by this suite |
| QuestTrail / Impact | No duplicate XP, dated self-reports, persistence | Manual acceptance required; no dedicated automated suite recorded |
| Navigation/mobile | All nine screens reachable; controls fit narrow viewport | Earlier origin journey at 390px; not blanket verification of every screen |

## Edge cases to preserve

Empty, unknown or country-only city; no eligible destination; blank/zero/negative budget; mixed currencies; member removal; late departure; no PlanB candidate; reload after save; malformed older data; repeated quest action; browser storage unavailable.

Run tests in an isolated browser profile. Never clear a user's storage to manufacture a passing outcome. A documentation-only change does not justify another full browser test.
