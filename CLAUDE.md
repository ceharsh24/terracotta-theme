# CLAUDE.md — AI Assistant Guide for Terracotta Theme

This file documents the codebase structure, conventions, and workflows for AI assistants (Claude and others) working on this repository.

---

## Project Overview

**Terracotta Theme** is a VS Code color theme extension with five variants:

| Variant | File | Background | Type | Purpose |
|---------|------|-----------|------|---------|
| Dark | `terracotta-dark.json` | `#141414` | `vs-dark` | Primary warm dark |
| Dark Dimmed | `terracotta-dark-dimmed.json` | `#1A1A1A` | `vs-dark` | Softer night variant |
| Light | `terracotta-light.json` | `#F8F8F6` | `vs` | Warm paper-like light |
| Light Bright | `terracotta-light-bright.json` | `#FFFFFF` | `vs` | Maximum contrast light |
| High Contrast (CB) | `terracotta-high-contrast-cb.json` | `#000000` | `hc-dark` | WCAG AAA + color-blind safe |

Version: `1.9.2` | Publisher: `terracotta-theme` | Author: Harsh Shah

---

## Repository Structure

```
terracotta-theme/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.yml
│   │   └── color-issue.yml
│   └── workflows/
│       ├── ci.yml          # Runs contrast checks + VSCE packaging on push/PR to main
│       └── pages.yml       # Deploys docs/ to GitHub Pages on changes to docs/**
├── docs/
│   └── index.html          # Interactive theme playground (deployed to GitHub Pages)
├── examples/               # Language showcase files for manual visual testing
│   ├── ReactShowcase.tsx
│   ├── PythonShowcase.py
│   ├── GoShowcase.go
│   ├── JavaShowcase.java
│   ├── ShellShowcase.sh
│   ├── GraphQLShowcase.graphql
│   ├── DockerfileShowcase
│   ├── config-showcase.yaml
│   ├── config-showcase.toml
│   ├── THEME-DEMO.html        # Static HTML interactive demo
│   ├── theme-analysis.html    # Color pair analysis tool
│   ├── java-preview.html      # Java-specific preview
│   └── screenshot-gen.html    # Puppeteer screenshot template
├── scripts/
│   ├── check-contrast.js   # WCAG contrast validation (runs as npm test)
│   └── screenshot.js       # Generates PNG previews using Puppeteer
├── screenshots/            # Theme preview PNGs (committed to repo)
│   ├── screenshot-dark.png
│   ├── screenshot-dark-dimmed.png
│   ├── screenshot-light.png
│   ├── screenshot-light-bright.png
│   └── screenshot-high-contrast-cb.png
├── themes/                 # The five theme JSON files (primary source of truth)
│   ├── terracotta-dark.json
│   ├── terracotta-dark-dimmed.json
│   ├── terracotta-light.json
│   ├── terracotta-light-bright.json
│   └── terracotta-high-contrast-cb.json
├── CHANGELOG.md
├── LICENSE                 # MIT
├── README.md
└── package.json            # Extension manifest + build scripts
```

---

## Development Workflows

### Running Tests

```bash
npm test
# Runs: node scripts/check-contrast.js
# Validates WCAG contrast ratios across all 5 themes (~600+ color pairs)
# Exit 0 = all pass, Exit 1 = failures
```

Always run `npm test` after modifying any theme JSON file.

### Generating Screenshots

```bash
npm run screenshots
# Runs: node scripts/screenshot.js
# Requires Puppeteer + Chrome; generates 5 PNGs at 1024x600 / 2x DPI
# Output: screenshots/screenshot-*.png
```

### Packaging the Extension

```bash
npx @vscode/vsce package --no-dependencies
# Produces a .vsix file for manual installation or marketplace publishing
# CI also validates this succeeds on every push to main
```

### CI/CD

Two GitHub Actions workflows:

- **`ci.yml`** — Triggers on push/PR to `main`:
  1. `contrast-check`: Runs `npm test` on Ubuntu + Node 24
  2. `package-check`: Validates `vsce package --no-dependencies` succeeds

- **`pages.yml`** — Triggers on push to `main` when `docs/**` changes:
  - Deploys `docs/index.html` to GitHub Pages as the interactive playground

---

## Theme File Conventions

### JSON Structure

Each theme file (`themes/*.json`) follows this top-level structure:

```json
{
  "$schema": "vscode://schemas/color-theme",
  "name": "Terracotta [Variant Name]",
  "type": "dark | light | hc-dark",
  "semanticHighlighting": true,
  "colors": { /* 200+ workbench UI colors */ },
  "tokenColors": [ /* 140+ TextMate token rules */ ],
  "semanticTokenColors": { /* 43+ semantic token rules */ }
}
```

### Color Format

- All colors are **6-digit hex**: `#RRGGBB`
- Alpha transparency uses **8-digit hex**: `#RRGGBBAA`
- No shorthand (#RGB), no rgb(), no named colors

### `colors` Section (Workbench UI)

Defines VS Code workbench colors (editor backgrounds, sidebar, status bar, etc.). Example keys:
- `editor.background`, `editor.foreground`
- `activityBar.background`, `sideBar.background`
- `statusBar.background`, `statusBar.foreground`
- `editorGroupHeader.tabsBackground`

### `tokenColors` Section (TextMate Syntax)

Array of rules. Each rule:

```json
{
  "name": "Human-readable description",
  "scope": "textmate.scope | [\"array\", \"of\", \"scopes\"]",
  "settings": {
    "foreground": "#HEXCOLOR",
    "fontStyle": "italic | bold | underline | (empty string to reset)"
  }
}
```

Scopes are hierarchical TextMate grammar scopes (e.g., `keyword.control`, `string.quoted.double`).

### `semanticTokenColors` Section

Key-value map for language-server semantic tokens. Two forms:

```json
{
  "function": "#3DBB92",
  "variable.declaration": { "foreground": "#D4D4D4", "bold": true }
}
```

Supported modifiers: `.declaration`, `.definition`, `.defaultLibrary`, `.static`, `.readonly`, `.modification`, `.documentation`, `.abstract`, `.async`

---

## Accessibility Requirements (CRITICAL)

This project enforces **WCAG 2.1** compliance. All color changes **must pass** `npm test`.

### Contrast Tier System

The contrast checker (`scripts/check-contrast.js`) validates two tiers:

| Tier | Minimum Ratio | Token Types |
|------|--------------|-------------|
| **Tier 1 (AAA)** | **7:1** | Keywords, functions, strings, variables, types, numbers, operators |
| **Tier 2 (AA)** | **4.5:1** | Comments, constants, parameters, properties, decorators |

### Color-Blind Variant Rules

The `terracotta-high-contrast-cb.json` theme follows the **IBM/Wong scientifically validated** color-blind-safe palette:
- **Zero red-green dependencies** — safe for deuteranopia and protanopia
- Uses distinct shapes/brightness in addition to hue for differentiation
- Do not introduce colors that rely solely on red/green distinction

### When Modifying Colors

1. Change the color value in the theme JSON
2. Run `npm test` — fix any contrast failures before committing
3. Apply the same change to all relevant theme variants (consistency matters)
4. Update `CHANGELOG.md` with the change

---

## Semantic Color Palette

Consistent token-to-color mapping across all dark variants:

| Token Type | Dark Theme Color | Role |
|-----------|-----------------|------|
| Keywords | `#E98665` (terracotta/rust) | Brand accent |
| Functions | `#3DBB92` (teal/green) | Actions |
| Strings | `#E5B45A` (gold/amber) | Data/values |
| Types/Classes | `#B48EAD` (purple/lavender) | Structures |
| Numbers | `#D98A8A` (rose/dusty pink) | Literals |
| Operators | `#7BA7C7` (steel blue) | Logic |
| Comments | `#706050` (warm brown) | Documentation |
| Variables | `#D4D4D4` (light gray) | Identifiers |

Light theme uses higher-contrast, darker equivalents of these colors against the warm white background.

---

## Making Changes

### Adding a New Token Scope

1. Identify the TextMate scope (use VS Code's "Developer: Inspect Editor Tokens and Scopes" command)
2. Add the rule to `tokenColors` in all 5 theme files
3. Optionally add the equivalent to `semanticTokenColors`
4. Run `npm test` to validate contrast
5. Update `CHANGELOG.md`

### Modifying an Existing Color

1. Search all theme files for the color hex value to understand its usage
2. Verify the new color meets contrast requirements for its tier (see above)
3. Update in all relevant theme files
4. Run `npm test`
5. Regenerate screenshots if the change is visually significant: `npm run screenshots`

### Adding a New Language Example

Add a showcase file to `examples/` following the pattern of existing files:
- Filename: `[Language]Showcase.[ext]`
- Include diverse syntax: classes, functions, control flow, types, strings, comments, generics, decorators
- Keep it comprehensive — these are used for visual regression testing

---

## Commit Message Conventions

Follow semantic commit format observed in git history:

```
type: short description

Optional body with more detail.
```

Common types used in this project:
- `fix:` — color adjustments, contrast fixes
- `feat:` — new language support, new theme variant
- `docs:` — README, CHANGELOG, playground, examples
- `chore:` — package.json, CI, tooling

Examples from history:
- `fix: improve number/variable contrast and color identity`
- `docs: sync playground, examples, and changelog with theme colors`
- `fix: overlaps and theme colors for different languages`

---

## package.json Key Fields

```json
{
  "name": "terracotta-theme",
  "version": "1.9.2",
  "engines": { "vscode": "^1.85.0" },
  "contributes": {
    "themes": [ /* 5 theme entries, each pointing to themes/*.json */ ]
  },
  "configurationDefaults": {
    "editor.semanticHighlighting.enabled": true,
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs": true,
    "editor.renderLineHighlight": "line",
    "editor.cursorBlinking": "smooth"
  },
  "scripts": {
    "test": "node scripts/check-contrast.js",
    "screenshots": "node scripts/screenshot.js"
  },
  "devDependencies": {
    "puppeteer": "^24.39.1"
  }
}
```

No runtime production dependencies — the extension is pure JSON + metadata.

---

## Supported Languages

The theme provides coverage for: JavaScript, TypeScript (+ React/JSX/TSX), Python, Rust, Go, Java, C/C++, C#, Ruby, PHP, Swift, Kotlin, HTML, CSS/SCSS, JSON, YAML, TOML, SQL, Shell/Bash, Markdown, Dockerfile, GraphQL.

Coverage is delivered via a combination of TextMate grammar scopes (universal) and semantic token colors (language-server enhanced, when available).

---

## Key Files Quick Reference

| Task | File |
|------|------|
| Modify dark theme colors | `themes/terracotta-dark.json` |
| Modify light theme colors | `themes/terracotta-light.json` |
| Modify color-blind theme | `themes/terracotta-high-contrast-cb.json` |
| Contrast validation logic | `scripts/check-contrast.js` |
| Screenshot generation | `scripts/screenshot.js` |
| Extension manifest | `package.json` |
| Interactive playground | `docs/index.html` |
| CI configuration | `.github/workflows/ci.yml` |
| Version history | `CHANGELOG.md` |
