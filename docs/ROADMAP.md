# Roadmap

Baseline: 2026-10-31. This file distinguishes current work from ideas; it is not a delivery-date commitment.

## Current MVP stabilization

- **Required:** Restore a reproducible planning/currency test command.
- **Implemented:** Origin-correct catalog matching and explicit unsupported-city guidance.
- **Implemented:** INR/MYR/SGD support using a dated offline reference.
- **Queued separately:** Exchange-rate refresh without silently changing saved budgets; saved-trip currency regression work.
- **Implemented:** Optional online city/disambiguation and nearby map discovery beyond the ten offline catalogs; research-only points, not complete planned adventures.
- **Maintenance:** Preserve documentation, saved-data semantics and truthful simulation labels.

## Candidate next release — trusted discovery

Build on implemented optional map discovery with independently sourced route/access information before considering promotion into planned adventures. Retain disambiguation, source attribution, caching, timeouts and explicit coverage limits. Add optional weather only with timestamps, provenance and unavailable/stale states. Neither a place listing nor a forecast certifies trail access or safety.

## Future — collaborative planning

Optional identity, group invitations, shared votes/preferences, permissions, conflict resolution and backup/migration. Keep local planning usable and explain what is synchronized.

## Future — verified route experiences

Licensed route geometry, elevation provenance and richer simulation. GPS navigation and emergency functions require separate reliability and safety design; they are not implied by the current twin.

## Exploratory — grounded AI and commerce

An optional LLM assistant with grounded sources and controlled actions; booking partnerships; subscriptions or other monetization. These are ideas, not implemented integrations or approved business models.

Prioritize work by user value and evidence rather than adding impressive labels to simulated capabilities.
