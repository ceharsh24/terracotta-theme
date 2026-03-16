# Changelog

All notable changes to the Terracotta theme will be documented in this file.

## [1.3.0] - 2026-03-16

### Changed
- **String vs Number separation** -- shifted number/constant colors in Dark (`#D0A050`) and Dark Dimmed (`#C49A4A`) to amber, creating clear visual distance from gold strings
- **Light theme variable visibility** -- shifted variable colors to warm brown (`#4A3F38` / `#3D3530`) in both light variants so variables no longer blend with foreground text
- Updated all 5 theme screenshots

### Added
- **Go language support** -- added builtin type scopes (`error`, `string`, `bool`, `byte`, `rune`, numeric types) colored as types, and `chan` keyword styled as italic operator across all 5 themes
- Complex showcase files for Python, React/TSX, and Go

## [1.2.0] - 2026-03-16

### Added
- **Java language support** -- added Java-specific token rules for primitive types, annotations, and `this`/`super` across all 5 themes

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
