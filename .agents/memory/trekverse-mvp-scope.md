---
name: TrekVerse MVP scope
description: Local-first implementation boundaries and safety language for TrekVerse AI.
---

Keep the MVP usable without mandatory external APIs or authentication. Trip data stays local to the browser unless the product scope is explicitly changed. Destination, cost, route, weather, access, and safety information must be labeled illustrative when not verified; never imply a route is safe or open.

**Why:** The product brief prioritizes a working, self-contained MVP and explicitly rejects mandatory API or auth dependencies; its sample destination data is not live-verified.

**How to apply:** Preserve local persistence and clear demo-data disclaimers when adding planning, recommendation, route, or readiness features. Treat live services as optional future integrations.

## Starting-city correctness

“The system is supposed to show the places of the entered starting city.” Never substitute Hyderabad destinations or relabel their travel estimates when a different origin is entered. A country is not a starting city; request a city instead. Be explicit when a location has no catalog.

**Why:** The user reported that entering a different starting location still returned Hyderabad-area places.

**How to apply:** Apply origin matching to recommendations and alternatives, not just headings. Changing search preferences must not rewrite the origin of an existing saved trip.
