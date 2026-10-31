# Design system

Source of truth: `artifacts/trekverse-ai/src/index.css`. This document describes the existing theme; it does not introduce a second token source.

## Visual language

Forest-green navigation, warm cream surfaces, lime emphasis, nature imagery and compact editorial labels. Preserve readable contrast and clear hierarchy over decorative density.

| Token | Existing value / role |
| --- | --- |
| Background | `hsl(42 29% 95%)` — warm paper |
| Foreground | `hsl(158 26% 13%)` — deep green text |
| Primary | `hsl(154 35% 18%)` — forest |
| Accent | `hsl(78 82% 48%)` — lime |
| Border | `hsl(38 17% 84%)` |
| Destructive | `hsl(4 62% 48%)` |
| Base radius | `1rem`; derived radii and component-specific overrides exist |

The stylesheet also has app-specific variables. Reuse the actual component tokens instead of introducing slightly different greens.

## Typography and spacing

- Body: DM Sans.
- Headline family: Manrope, despite the legacy token name `--app-font-serif`.
- Labels and numeric/editorial accents: Space Mono.
- Use existing `.panel`, `.grid-2`, `.filters`, `.field`, `.section-title` and button spacing. There is no separately enforced universal spacing scale; component values remain the source.

## Components and states

Sidebar plus topbar on desktop; mobile navigation retains the same module access. Destination cards show origin-specific metadata, constraints and explicit planning actions. Buttons use `.btn` variants, with lime for primary emphasis, ghost for secondary actions and danger for destructive actions. Chips represent filters/selections.

Status messages must explain their meaning in words: eligible/excluded, preview/applied, illustrative/unverified and validation errors. Do not communicate readiness only through color. Use Lucide icons consistently; give icon-only controls accessible names.

## Responsive and accessibility expectations

Existing layout breakpoints include **1000px** and **760px**. Test narrow screens near 390px after affected layout changes. Long city names, currencies and error messages must wrap without hiding controls.

Associate labels with controls, retain keyboard focus visibility, show text validation with appropriate descriptions, distinguish disabled actions and confirm destructive resets. These are standards to maintain, not a claim that a full accessibility audit has passed.

Images are representative where disclosed. Do not imply an illustrative landscape photograph proves the destination's current conditions.
