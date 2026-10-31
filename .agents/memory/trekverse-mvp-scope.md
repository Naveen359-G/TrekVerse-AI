---
name: TrekVerse MVP scope
description: Local-first implementation boundaries and safety language for TrekVerse AI.
---

Keep the MVP usable without mandatory external APIs or authentication. Trip data stays local to the browser unless the product scope is explicitly changed. Destination, cost, route, weather, access, and safety information must be labeled illustrative when not verified; never imply a route is safe or open.

**Why:** The product brief prioritizes a working, self-contained MVP and explicitly rejects mandatory API or auth dependencies; its sample destination data is not live-verified.

**How to apply:** Preserve local persistence and clear demo-data disclaimers when adding planning, recommendation, route, or readiness features. Live discovery must remain opt-in and must not become a prerequisite for curated planning.

## Map discovery is not trip verification

Treat map-sourced nearby places as research candidates, separate from graded/scored trip plans, until route, timing, costs and access have their own evidence. A mapped peak or park is not evidence of a hiking route, fitness grade, public entry, or safety clearance.

**Why:** Global place sources provide locations and feature tags, not the route and access evidence needed to make those claims. Reusing the sample itinerary or route-profile defaults would invent those details.

**How to apply:** Keep unknowns explicit and preserve source links. Do not pass raw map candidates into sample planning/scoring machinery just to make them selectable as complete trips.

## Starting-city correctness

“The system is supposed to show the places of the entered starting city.” Never substitute Hyderabad destinations or relabel their travel estimates when a different origin is entered. A country is not a starting city; request a city instead. Be explicit when a location has no catalog.

**Why:** The user reported that entering a different starting location still returned Hyderabad-area places.

**How to apply:** Apply origin matching to recommendations and alternatives, not just headings. Changing search preferences must not rewrite the origin of an existing saved trip.

## Dual hosting

Support the application on both Replit and Vercel.

**Why:** The user said they will host the application on Vercel as well.

**How to apply:** Preserve the Replit preview while maintaining a portable production build. Do not introduce a mandatory Replit-only runtime dependency without addressing the Vercel deployment.
