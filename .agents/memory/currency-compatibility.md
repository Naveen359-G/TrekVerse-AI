---
name: Legacy trip currencies
description: Why missing currency must always mean INR, even for international saved trips.
---

Legacy international trips and their member budgets were authored in INR, including Malaysia and Singapore. A missing currency must never be inferred from the city.

**Why:** Local-currency support was added after those catalogs and saved plans existed. Guessing currency from the country would silently change the value of stored budgets.

**How to apply:** Keep legacy amounts in INR. Convert only explicitly selected planning amounts with visible dated provenance; keep search currency changes separate from existing saved plans. Preserve the offline, illustrative nature of prices.

## Historical exchange-rate policy

Rate refresh is opt-in and applies only to new plans. Existing plans retain their historical reference rates, including when duplicated, edited, restored from a scenario or saved again. A legacy plan without rate metadata means the bundled historical reference, never the latest fetched rates.

**Why:** The user requires rate refreshes to never silently recalculate saved monetary amounts. A newer currency reference does not turn illustrative destination prices into live quotes.

**How to apply:** Keep browsing rate selection separate from trip-owned rate provenance, even when opening or returning to an old trip. Explicitly starting any new plan uses the browsing selection, not the displayed old trip's rates. Any future explicit repricing feature must ask for consent rather than changing a saved plan during refresh.
