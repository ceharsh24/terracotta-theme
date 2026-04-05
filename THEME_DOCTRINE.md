# Terracotta Theme Doctrine

This document defines the design rules for Terracotta so future palette work stays coherent across all variants.

## Core Principles

1. Terracotta is the brand lane, not the whole palette.
2. Contrast compliance is required, but contrast alone does not guarantee definition.
3. Scan speed matters more than palette cleverness.
4. Every variant must have a clear personality, not just a brightness adjustment.
5. If two roles are close in meaning, prefer style or hierarchy before adding a new hue.
6. When in doubt, remove a color before adding one.

## Semantic Lane Ownership

- Terracotta: keywords, primary accent, emphasis
- Slate: operators, punctuation, structure
- Teal: functions, methods, callable behavior
- Plum / Indigo: classes, types, modules, interfaces
- Ochre: strings, escapes, self-like references when needed
- Berry: numbers, numeric literals, regex quantifier-adjacent emphasis
- Cocoa: identifiers, variables, parameters when a separate hue is unnecessary
- Olive: properties, attributes, keys, config fields
- Stone: comments and secondary annotation text

## Palette Rules

1. No major syntax lane should sit too close to terracotta except deliberate tag accents.
2. Operators must never collapse into comment or variable territory.
3. Properties must stay readable in JSON, YAML, TOML, JSX, and CSS, not just in curated examples.
4. Parameters should only get their own hue if they are meaningfully separated from keyword and variable lanes.
5. Built-in constants and numbers must not share the same literal lane.
6. Decorative roles may be subdued, but core scan-path roles must remain distinct at a glance.

## Variant Roles

### Terracotta Dark

- Flagship dark theme
- Balanced, memorable, and usable for long daily sessions
- Reference point for tone and semantics across the family

### Terracotta Dark Dimmed

- Night-session companion to Dark
- Must feel calmer, not merely duller
- Lower glare and softened surfaces should be its identity

### Terracotta Light

- Flagship light theme
- Warm editorial / parchment character
- Default light experience for most users

### Terracotta Light Bright

- Daylight light theme
- Cleaner, sharper, and cooler in structure than Light
- Must earn its place through personality, not only higher luminance

### Terracotta High Contrast (Color Blind)

- Accessibility-first variant
- Semantic clarity takes priority over aesthetic harmony
- Never trade recognizability for brand warmth here

## UI Surface Rules

1. Editor, sidebar, panel, and tabs must be visibly distinct in every variant.
2. Active tab background must never collapse into editor background.
3. Accent color should not dominate warnings, errors, badges, focus, and syntax simultaneously.
4. In light themes, chrome separation matters almost as much as token separation.

## Release Rules

Use a major release when the family identity changes in a way users will feel immediately:

- variants gain new personalities
- flagship themes materially change their scan behavior
- semantic lane ownership is redefined
- screenshots, docs, and positioning all need to be updated together

Use a minor release when the palette is improved within the same existing identity:

- contrast refinements
- small hue shifts
- limited role cleanup
- non-breaking demo and docs sync

## Validation Rules

Every palette change should clear all of the following:

1. WCAG syntax and UI checks
2. Terminal ANSI checks
3. Palette-spacing checks
4. Doc/demo sync checks
5. Real-code review in at least:
   - TSX
   - JSON/YAML/TOML
   - Markdown
   - Shell
   - diff view

## Decision Test

Before shipping a palette change, ask:

1. Does this make the theme easier to scan?
2. Does this strengthen or weaken the variant's identity?
3. Is this a new role, or just a new color?
4. Would a developer notice the improvement after eight hours, not just in a screenshot?
