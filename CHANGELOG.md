# Changelog

All notable changes to the Terracotta theme will be documented in this file.

## [1.1.0] - 2026-03-16

### Changed
- **Complete color palette overhaul** -- switched to "Neo-Terracotta" palette for maximum syntax distinctness
- **Dark theme backgrounds** upgraded to Cursor-style pure neutral dark (`#141414`, `#1A1A1A`)
- **Claude Orange accent** (`#DA7756`) now used as the primary keyword and accent color across all variants, matching Anthropic's brand terracotta
- **Claude Orange selections** -- replaced blue selections with warm terracotta-tinted highlights on all 17 selection/focus/find/bracket surfaces per theme
- **AAA-grade Comments** -- comment colors upgraded from WCAG AA to AAA (7.0:1+) in all variants
- **Perceptual distinctness** -- all core syntax tokens now separated by RGB distance Δ > 150, eliminating any chance of visual confusion between token types
- **Gallery banner** updated to match true dark editor background
- VSCode engine requirement bumped to `^1.85.0`

### Added
- Benchmark contrast matrix in README documenting exact WCAG contrast ratios per token per theme
- Perceptual Distinctness and Eye Strain documentation sections in README

## [1.0.0] - 2026-03-16

### Added
- **Terracotta Dark** -- primary warm dark theme with terracotta accents
- **Terracotta Dark Dimmed** -- softer dark variant with desaturated colors for night sessions
- **Terracotta Light** -- warm paper-like light theme using Claude's Pampas background
- **Terracotta Light Bright** -- crisp high-contrast light theme on pure white
- **Terracotta High Contrast (Color Blind)** -- WCAG AAA accessible theme using IBM/Wong palette
- 200+ workbench color definitions per variant
- 75+ TextMate token color rules per variant
- 30+ semantic token color rules per variant
- Full coverage for JS/TS, Python, Rust, Go, Java, C/C++, HTML/CSS, JSON/YAML, SQL, Markdown, Shell, and more
