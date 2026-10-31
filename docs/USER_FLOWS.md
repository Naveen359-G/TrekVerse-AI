# User flows

## 1. First weekend

Onboarding → starting city → date/time window, budget, currency and group brief → Build my weekend → Discover → review explanations → select destination → My Adventures.

- A country or recognized country typo shows city choices and blocks submission.
- An unsupported city shows catalog coverage and no unrelated recommendations.
- No feasible candidates: display constraint reasons and explicit relaxation actions; do not silently change limits.
- Text/activity/difficulty/mood filters may further reduce the shown set.

## 2. Group agreement

My Adventures → GroupSync → edit member limits and preferences → review compatibility → record votes separately → optimize if desired → review selected plan.

An infeasible closest compromise must remain flagged. These are local member records, not invitations or remote presence.

## 3. Saved adventures

My Adventures → Save this plan → edit/update or duplicate → reopen from saved list → restore that plan's context. Deleting a saved record requires deliberate user interaction; resetting all demo data is broader and requires confirmation.

Settings → different search city → save brief → Discover for new origin. The old active/saved trip retains its own origin. Returning to it restores its context rather than attaching it to the new search city.

Currency changes must convert intended editable amounts and preserve the meaning of older records; a missing stored currency never means “use the country currency.”

## 4. Simulated trek

My Adventures → Digital Twin → start → timer advances simulated elapsed time → checkpoints/progress update → pause/resume or reset.

Progress persists locally. The timer is accelerated and does not represent actual travel, GPS or official trail coordinates.

## 5. Disruption

PlanB → choose scenario → inspect candidate/patch → reject without changing the trip, or apply → inspect itinerary, budget, simulation context and readiness → restore if needed.

No valid candidate: show the limitation and keep the current plan; never claim a rain alternative is verified safe.

## 6. Completion and contribution

QuestTrail → complete an eligible quest → record one-time XP/history → revisit without duplicate reward. Impact → enter contribution → retain dated self-reported record.

## Navigation and failure expectations

Desktop sidebar and mobile navigation expose the same core modules. Tabs are selected through application state, not independent URL routes. A reload loads local trip data but need not reopen the same tab.

Malformed stored records have normalization/fallback handling, but storage denial, quota exhaustion and cross-tab conflicts are not a fully hardened persistence system. Do not promise cloud recovery; see [limitations](LIMITATIONS.md).
