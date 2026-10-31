# Testing and verification

Baseline: **2026-10-31**. Record the code scope and date with every result. Test definitions, prior browser evidence and current successful execution are different things.

## Commands

From repository root:

```sh
pnpm --filter @workspace/trekverse-ai run typecheck
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/trekverse-ai run build
```

Current direct test command:

```sh
node --experimental-strip-types --test artifacts/trekverse-ai/tests/*.test.mts
```

**Known blocker:** this command currently stops before assertions because `planning.ts` imports `./currency` without an extension, which native Node ESM resolution does not resolve here. The checked API workspace also has no `tsx` executable. Do not document `pnpm exec tsx` as a working alternative until a supported runner is installed/configured and verified. Repairing the runner is separate from this documentation update.

## Evidence log

| Date | Scope | Outcome |
| --- | --- | --- |
| 2026-10-31 | Earlier origin-filtering implementation: 12 planning tests | Passed before the currency merge; historical evidence only |
| 2026-10-31 | Earlier origin-switch browser journey, desktop and 390px | Passed: country guidance, Malaysian-only results, saved KL origin retained after Hyderabad search, unsupported city empty state |
| 2026-10-31 | Current merged app: product typecheck | Passed during this documentation update |
| 2026-10-31 | Current merged app: direct Node invocation of both test files | Blocked before assertions by `ERR_MODULE_NOT_FOUND` for `src/lib/currency` |
| 2026-10-31 | Current merged app: browser currency and complete PlanB regression pass | Not run in this documentation update |
| 2026-10-31 | Updated nine-slide project deck | Slide validation, deck typecheck and production build passed; `/allslides` rendered nine 1920×1080 frames with loaded images and no intersecting text blocks; updated cover captured |

There are **12 planning, 7 currency and 9 discovery test definitions** after the optional discovery merge. The discovery cases were not executed during the slide refresh. Do not report all 28 as passing until a working runner executes the relevant assertions.

## Coverage inventory

Planning definitions cover origin aliases/country handling, candidate-pool isolation, optimizer origin, non-relaxable mismatch, itinerary origin, catalog integrity, hard limits, group budgets/time/access, compatibility factors, mood/return timing, late readiness, checkpoints and budget totals.

Currency definitions cover INR legacy defaults, dated conversion/reference pairs, agreement across ranking/compatibility/readiness, mixed-currency members, category totals, invalid/zero budget behavior and percentage budget reduction.

## Required acceptance journeys

| Journey | Checks | Current automation/evidence |
| --- | --- | --- |
| Recommendation constraints | Hard limits, same-origin pool, explicit exclusion reasons | Logic definitions; earlier origin browser pass |
| GroupSync | Explain factors, separate votes, lowest member budget | Partial logic coverage; browser regression needed after relevant edits |
| PlanB | Reject is inert; apply updates itinerary/budget/context; restore recovers prior state | Full apply/restore not covered by a dedicated current end-to-end suite |
| Digital Twin | Start/pause/resume, pace, checkpoint boundaries, one timer, reload | Manual acceptance required; no dedicated timer automation recorded |
| Local saved data | Save/open/update/duplicate/delete, reload, old units and origins | Earlier origin browser pass; currency browser regression outstanding |
| QuestTrail / Impact | No duplicate XP, dated self-reports, persistence | Manual acceptance required; no dedicated automated suite recorded |
| Navigation/mobile | All nine screens reachable; controls fit narrow viewport | Earlier origin journey at 390px; not blanket verification of every screen |

## Edge cases to preserve

Empty, unknown or country-only city; no eligible destination; blank/zero/negative budget; mixed currencies; member removal; late departure; no PlanB candidate; reload after save; malformed older data; repeated quest action; browser storage unavailable.

Run tests in an isolated browser profile. Never clear a user's storage to manufacture a passing outcome. A documentation-only change does not justify another full browser test.
