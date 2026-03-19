# Changelog

All notable changes to the Terracotta theme will be documented in this file.

## [1.9.2] - 2026-03-18

### Changed
- **Number colors upgraded to WCAG AAA** — all 4 non-HC variants now meet 7:1 contrast for numbers (previously some were below). Shifted from orange toward dusty rose for better hue separation from keywords
  - Dark: `#D89050` → `#D49288` (7.3:1)
  - Dark Dimmed: `#CC9D4D` → `#D49888` (7.2:1)
  - Light: `#A70B50` → `#80441E` (7.1:1)
  - Light Bright: `#AA0E53` → `#86461E` (7.2:1)
- **Variable color identity improved** — warmer golden-sand tones for better separation from comments and foreground text
  - Dark: `#BFB799` → `#C4B890`, Dark Dimmed: `#B5A78C` → `#C0AC88`, Light Bright: `#3D3530` → `#4A3828`
- **Comment colors** shifted to warm earth tones across all variants for cohesive palette identity
- Function colors refined across all variants for consistency
- Contrast checker regex fix: `\bnumber\b` → `\bnumbers?\b` to correctly classify numbers as Tier 1

### Fixed
- Light theme git added color adjusted (`#1A7A4C` → `#187548`) after sidebar background change
- Playground (`docs/index.html`) synced with all theme color changes
- All HTML examples and screenshots regenerated

## [1.6.1] - 2026-03-16

### Changed
- **Full WCAG AAA compliance** — all 95 syntax color pairs across all 5 variants now meet the 7:1 AAA contrast threshold (previously some were AA-only at 4.5:1+)
- **UI contrast audit** — 235 workbench UI foreground/background pairs validated against WCAG AA (4.5:1); all active UI text now passes
- Contrast checker upgraded: threshold raised to AAA (7:1) for syntax, added UI pair validation with WCAG SC 1.4.3 exempt handling for inactive/decorative elements
- Light themes: button, badge, and status bar foregrounds switched from white to dark text on accent backgrounds for proper contrast
- Dark Dimmed: status bar error background lightened (`#BF6B66` → `#C06C67`) to clear AA threshold
- Key syntax color updates for AAA compliance:
  - **Dark**: keyword `#DA7756` → `#E98665`, numbers `#C88040` → `#D89050`, punctuation slightly lightened
  - **Dark Dimmed**: keyword `#D47A5C` → `#E88E70`, types `#AF85E6` → `#BC92F3`, numbers `#BF9040` → `#CC9D4D`, and 11 other minor lightening adjustments
  - **Light**: keywords, strings, regex, numbers, operators, functions, punctuation all darkened ~2–4 steps to clear 7:1
  - **Light Bright**: tag punctuation `#6B757F` → `#505A64`

## [1.4.0] - 2026-03-16

### Changed
- **String vs Number separation** -- shifted number/constant colors in Dark (`#D0A050`) and Dark Dimmed (`#C49A4A`) to amber, creating clear visual distance from gold strings
- **Light theme variable visibility** -- shifted variable colors to warm brown (`#4A3F38` / `#3D3530`) in both light variants so variables no longer blend with foreground text
- Updated all 5 theme screenshots

### Added
- **Go language support** -- added builtin type scopes (`error`, `string`, `bool`, `byte`, `rune`, numeric types) colored as types, and `chan` keyword styled as italic operator across all 5 themes
- Complex showcase files for Python, React/TSX, and Go

## [1.3.0] - 2026-03-16

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

## [1.2.0] - 2026-03-16

### Added
- **Java language support** -- added Java-specific token rules for primitive types, annotations, and `this`/`super` across all 5 themes

## [1.1.0] - 2026-03-16

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
