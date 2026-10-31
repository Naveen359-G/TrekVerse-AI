---
name: TrekVerse MVP scope
description: Local-first implementation boundaries and safety language for TrekVerse AI.
---

Keep the MVP usable without mandatory external APIs or authentication. Trip data stays local to the browser unless the product scope is explicitly changed. Destination, cost, route, weather, access, and safety information must be labeled illustrative when not verified; never imply a route is safe or open.

**Why:** The product brief prioritizes a working, self-contained MVP and explicitly rejects mandatory API or auth dependencies; its sample destination data is not live-verified.

**How to apply:** Preserve local persistence and clear demo-data disclaimers when adding planning, recommendation, route, or readiness features. Treat live services as optional future integrations.
