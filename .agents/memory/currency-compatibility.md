---
name: Legacy trip currencies
description: Why missing currency must always mean INR, even for international saved trips.
---

Legacy international trips and their member budgets were authored in INR, including Malaysia and Singapore. A missing currency must never be inferred from the city.

**Why:** Local-currency support was added after those catalogs and saved plans existed. Guessing currency from the country would silently change the value of stored budgets.

**How to apply:** Keep legacy amounts in INR. Convert only explicitly selected planning amounts with visible dated provenance; keep search currency changes separate from existing saved plans. Preserve the offline, illustrative nature of prices.
