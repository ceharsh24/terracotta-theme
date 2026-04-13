# Changelog

All notable changes to the Terracotta theme will be documented in this file.

## [Unreleased]

## [1.9.15] - 2026-04-13

### Changed
- **Light Bright type lane shifted from violet to blue** — types, classes, namespaces, and related tokens moved from purple-violet (`#4D44A2`/`#5248AA`) to a distinct blue family (`#3548A6`/`#4C3CB0`), improving separation from the interface lane and giving the daylight variant its own type identity
- **Light Bright UI chrome cooled** — activity bar, sidebar, status bar, title bar, and tab header backgrounds shifted from warm beige (`#EDE5DA`/`#E5DBD0`) to cool mineral tones (`#E7EEF0`/`#E2EAEC`), reinforcing the clean daylight personality
- **Light Bright comments neutralised** — comment color moved from olive-gray `#6C6A5E` to neutral `#72746C` for a cooler reading tone on the near-white canvas
- **Light Bright punctuation and breadcrumbs cooled** — shifted from warm gray (`#5A5248`) to slate-blue gray (`#5A6672`) to match the cooled chrome surfaces
- **Light Bright description and icon foregrounds aligned** — shifted from `#4C4841` to `#4C5961` for consistency with the cooler UI palette
- Synced README, `docs/index.html`, `examples/THEME-DEMO.html`, `examples/theme-analysis.html`, `examples/screenshot-gen.html`, and regenerated preview PNGs

## [1.9.13] - 2026-04-08

### Changed
- **Light + Light Bright chroma pass** — info, merge incoming, word highlight, range/symbol highlight, bracket match, peek, notifications, testing queue, charts, and debug “info” accents use a clearer cobalt blue family (`#2E5E98` / `#2D5E9A`) instead of the prior gray-tinged blue
- **Operator and SCM “changed” alignment** — keyword operators and modified-line gutters/minimap/overview now track deeper blues (`#1B5078` / `#1A508C`) so structure reads consistently with the new info lane
- **Git diff and success greens** — added lines, hints, merge current, and related UI greens shifted (`#407028` / `#387E28`) for cleaner separation from parchment and panel surfaces
- **Terracotta accent emphasis** — keywords, storage, cursor, bracket colorization tier 1, and list focus highlights nudge warmer and more saturated (`#8C2A0E` parchment, `#963014` bright) without abandoning the flagship terracotta lane
- **Callables, strings, and numbers** — function/method greens, string ochre, plum/magenta bracket tiers, and numeric berry literals retuned (`#186842` / `#006050`, `#795600` / `#8A6200`, `#8A244E` / `#A02450`) so scan paths stay separated at a glance
- **Integrated terminal** — all 16 ANSI colors updated in both light variants to match the new workbench lanes
- **Semantic property parity** — `property.declaration` now matches `property` across the four non-high-contrast themes so semantic highlighting behaves consistently family-wide
- **Supporting-state readability polish** — placeholders, inactive chrome labels, inactive tabs, line numbers, CodeLens, and inlay hints were lifted conservatively so low-priority UI text reads more clearly without flattening the hierarchy
- Synced README, `docs/index.html`, `examples/THEME-DEMO.html`, `examples/theme-analysis.html`, `examples/screenshot-gen.html`, and regenerated preview PNGs

## [1.9.11] - 2026-04-05

### Changed
- **Usability review pass across all 5 variants** — chrome surfaces, tabs, panels, and interaction states were tuned to improve orientation during long coding and review sessions without redefining the core palette lanes
- **Working-state visibility increased** — selection, find match, active line, bracket match, and diff backgrounds now read more clearly in motion, especially in the dark and light flagship variants
- **Light theme parameters rely less on italics alone** — `Light` and `Light Bright` now give parameters their own cocoa-adjacent color lane instead of depending primarily on italic styling
- **Theme analysis page redesigned as the primary manual review harness** — `examples/theme-analysis.html` now covers TSX, Go, JSON, YAML, TOML, shell, markdown, diff, and log-like output in one theme-switchable surface
- **Light Bright re-separated from Light** — the daylight variant now uses a cooler mineral canvas, clearer surface spacing, and a more neutral comment lane so it reads as a distinct working theme rather than a near-clone
- Synced `PLAN.md`, playground surfaces, demo fixtures, and screenshot template values with the updated theme JSON files

## [1.9.10] - 2026-04-05

### Changed
- **4-core-theme definition pass completed** — `Dark` and `Dark Dimmed` now read as separate personalities at first glance (Distinct Night for Dimmed), while `Light Bright` stays warm-bright instead of drifting cool
- **Dark pair syntax lanes de-collided** — operator/variable crowding was removed in both dark themes, with higher lane contrast and stronger role drift between Dark vs Dimmed
- **Light pair differentiation strengthened** — `Light Bright` now has stronger separation from `Light` in function/operator/number lanes while keeping terracotta as the single primary accent lane
- **Workbench depth increased across all 4 core themes** — editor, sidebar, panel, and active tab surfaces now have stronger perceptual layering
- **Number/variable collision resolved** — dark numbers shifted from tan `#DCA068` to salmon-berry `#E0968C` (ΔE 3→19 from variable); dimmed numbers from `#D2A980` to muted rose `#D8929C` (ΔE 3→27)
- **Decorator identity separated from types** — dark decorators from dusty mauve `#CC8898` to orchid `#B468A0` (ΔE 4→24 from type); dimmed decorators from shared regex color `#C8A4B4` to orchid `#AC749C`
- **Dimmed operator/function proximity fixed** — dimmed operators from `#A3C0E2` to periwinkle `#A8B4D8` (ΔE 10→15 from function)
- **Light Bright operator palette cohesion** — replaced disconnected plum `#6A406A` with warm teal-slate `#3A5A6C`, restoring split-complementary harmony with the terracotta keyword
- **Keyword WCAG AAA compliance** — corrected keywords to meet Tier 1 7:1 contrast in all themes: dimmed `#C96E52`→`#DA956F`, light `#944126`→`#752B20`, light-bright `#B14D2E`→`#8A3D24`
- Synced README, docs playground, `THEME-DEMO`, `theme-analysis`, and screenshot template palette values to the live theme JSON files

### Added
- `scripts/check-palette-spacing.js` now enforces:
  - Dark vs Dark Dimmed same-role drift floors and average drift minimum
  - Operator vs variable minimum spacing in both dark themes
  - Surface spacing thresholds for all 4 core themes (dark pair + light pair)
  - Existing light-pair syntax lane spacing checks

### Fixed
- Fixed keyword tier classification regex in `check-contrast.js` — `/\bkeyword\b/` now matches plural "Keywords" rule names via `/\bkeywords?\b/`, ensuring keywords are correctly validated at AAA 7:1
- Restored WCAG compliance after the palette split without relaxing contrast thresholds
- Regenerated all bundled screenshots after the 4-theme quality pass
- README: palette swatch images now match the hex column; Terracotta Dark Dimmed table includes **Decorators**; design notes match `variable`/`parameter` colors in the theme JSON

## [1.9.9] - 2026-04-05

### Changed
- **Light theme vibrancy overhaul** — increased saturation and color identity across both light variants:
  - **Variables**: near-black brown → warm sienna (`#4A2E20` light, `#422A1C` bright) with visible red-brown hue
  - **Properties**: muted olive → rich forest-olive green (`#476218` light, `#436016` bright)
  - **Comments**: gray-brown → warmer tone (`#6B5B42` light, `#685840` bright) with better doc-comment separation
  - **Doc comments**: shifted to green-gray tint for clear distinction from regular comments (hex distance 30+, was 14)
  - **Punctuation**: warm slate tone (`#565060` light, `#504C5C` bright) — 40+ hex distance from operators (was 16)
- **Type family differentiation** — interfaces, enums, and type parameters now get distinct sub-shades within the plum family across all 4 non-HC themes, instead of sharing one color for 25+ scopes:
  - **Classes/Types**: keep base plum (`#7A3860` light, `#CC90A2` dark)
  - **Interfaces**: shifted violet (`#6E2878` light, `#B890C0` dark)
  - **Enums**: shifted rose (`#842E50` light, `#D898A0` dark)
  - **Type parameters**: shifted purple (`#64306E` light, `#C098C0` dark)
- **Dark theme brown/tan confusion fixed** — separated 6 tokens that were within 3-10 hex units of each other:
  - **Parameters**: `#D4986C` → `#D09058` (more distinctly orange)
  - **This/Self**: `#D4A96A` → `#C8B468` (gold-olive, 25+ distance from neighbors)
  - **Regex**: `#D4A898` → `#C4A0B0` (cooled to rose-lavender)
  - **Decorators**: `#D8907A` → `#CC8898` (dusty pink-mauve)
- **Dark comment gray confusion fixed** — doc comments `#8E8A82` → `#948E88` (hex distance 22, was 8)
- **Reduced keyword color overuse** — moved diff-deleted, invalid, and invalid-deprecated from keyword-orange to error-red; moved JSX embedded, shell substitution, and markdown code language to escape-sequence color
- **Dark Dimmed variant harmonized** — applied consistent dimming formula (~10 unit warm shift from Dark base), fixing wildly inconsistent offsets (types was 34 units off, comments was 2)
- Synced all documentation (README, playground, theme-analysis) with new palette values

### Fixed
- Removed `fontStyle: "bold"` from 7 token scopes across all 4 non-HC themes (Markdown headings, GraphQL directive, TOML table header, Dockerfile instruction, Shell shebang, semantic macro) — project uses color-only differentiation, not bold
- TOML table headers and Shell shebangs changed from bold to italic for structural emphasis
- Removed bold from `semantic:macro` across all 5 themes including HC-CB

## [1.9.8] - 2026-04-05

### Changed
- **Comprehensive terracotta-family palette overhaul** — replaced 6 non-terracotta accent colors (bright green, bright violet, cool blue, neon pink, mauve, cool gray-purple) with warm earthy alternatives across all 4 theme variants:
  - **Functions**: bright green → oxidized-copper teal (`#5AAFA0` dark, `#1E5848` light)
  - **Types/Classes**: bright violet → dusty rose-plum (`#CC90A2` dark, `#7A3860` light)
  - **Operators**: mauve/cool blue → warm taupe/brown (`#B0A090` dark, `#604838` light)
  - **Numbers**: rosy pink → warm amber-ochre (`#DCA068` dark, `#8A3050` light)
  - **Punctuation**: cool gray-purple → warm neutral gray (`#9C9290` dark, `#5A5248` light)
  - **Decorators**: lavender → warm apricot (`#E0A080` dark, `#985840` light)
- **Improved adjacent-token distinguishability** — increased color distance between commonly side-by-side tokens:
  - Variables vs Parameters: 150% more distinct
  - Strings vs Escape chars: 125% more distinct
  - Comments vs Punctuation (light): 200% more distinct
  - Decorators vs Types: 617% more distinct
  - Keywords vs Numbers (light): from near-identical hue to 33deg separation
- **Light theme readability dramatically improved** — comments and punctuation now have strong contrast; operators changed from hard-to-see cool blue to warm dark brown
- Synced all documentation (README, playground, theme-analysis) with new palette values

### Fixed
- Synced `README.md`, `docs/index.html`, and `examples/theme-analysis.html` to the live palette values in `themes/*.json`
- Removed stale palette duplication from `CLAUDE.md` and pointed documentation maintenance back to the theme JSON source of truth
- Added `scripts/check-doc-sync.js` and wired it into `npm test` so doc/demo palette drift fails CI before release

## [1.9.6] - 2026-03-30

### Changed
- **Light Bright background brightened** — editor background shifted from warm cream `#F4EEE4` (luminance 0.86) to warm near-white `#FDFCFA` (luminance 0.97), making it genuinely brighter than the Light theme while retaining a subtle warm tint that's easy on the eyes
- **Light Bright token colors now vibrant and saturated** — all syntax colors updated to take advantage of the brighter background:
  - Keywords: `#9E341A` → `#B84420` (vibrant terracotta orange)
  - Functions: `#00594A` → `#006048` (brighter teal)
  - Strings: `#7C4F00` → `#8B5800` (rich warm amber)
  - Types/Classes: `#5E29AD` → `#6530B0` (richer purple)
  - Numbers: `#7E3454` → `#9E2040` (vivid rose-red)
  - Decorators: `#854078` → `#9A4888` (vibrant magenta)
  - Regex: `#9B2080` → `#A82090` (more vibrant pink)
- **Light Bright UI surfaces updated** — sidebar, activity bar, panel, status bar, and all widget backgrounds shifted to lighter warm tones to match the new editor background
- **Operators shifted to steel blue in both light themes** — resolves collision with comments (both were muted brownish-purple)
  - Light: `#654658` → `#245A76` (steel blue)
  - Light Bright: `#654658` → `#265888` (crisp blue)
- **Properties shifted to earthy green in both light themes** — resolves collision with user constants (both were olive-brown) and identical match with inherited class
  - Light: `#66602D` → `#4A6928`
  - Light Bright: `#625C2B` → `#446828`
- **Inherited class gets its own purple hue** — was identical to properties in both themes
  - Light: `#66602D` → `#6E4E94` (muted purple)
  - Light Bright: `#625C2B` → `#7555A0` (light purple)
- **Numbers shifted to rose-red** — resolves collision with decorators (both were mauve-purple)
  - Light: `#7A3050` → `#9C2040`
  - Light Bright: `#7E3454` → `#9E2040`

### Fixed
- All 361 WCAG contrast pairs pass (Tier 1 AAA 7:1, Tier 2 AA 4.5:1, UI AA 4.5:1)
- 12 distinct hue families now clearly separated in both light themes: terracotta keywords, teal functions, gold strings, purple types, rose-red numbers, steel blue operators, earthy green properties, muted purple inherited class, warm brown params, magenta decorators, dark variables, warm gray comments

## [1.9.5] - 2026-03-27

### Changed
- **Light Bright softened again for marathon sessions** — the editor parchment stepped from `#F6F2EA` to `#F4EEE4`, with tabs, panels, menus, widgets, and line highlight surfaces warmed and lowered slightly to reduce glare without sacrificing readability
- **Example surfaces fully synced with the shipped themes** — `THEME-DEMO`, screenshot generation, and theme analysis views now reflect the warm no-blue standard palettes, non-italic comments/parameters, and the high-contrast property split

### Fixed
- Regenerated all bundled screenshots after the final Light Bright tuning pass
- Package metadata is now aligned for the release version

## [1.9.4] - 2026-03-27

### Changed
- **String escape characters now visually distinct** — escape sequences (`\n`, `\t`, `\\`) use a shifted hue from their surrounding string color, making them identifiable without relying on bold
  - Light: `#764C00` → `#824020` (terracotta red-brown vs golden amber strings)
  - Light Bright: `#7C4F00` → `#844222`
  - Dark: `#F0C24E` → `#E8A050` (warm amber vs bright gold strings)
  - Dark Dimmed: `#DBAC3B` → `#E8A850` (orange-amber vs golden strings)
- **Operator/property color collision resolved in light themes** — operators shifted from near-identical deep blue to a muted blue-gray, creating clear separation from property accesses
  - Light: `#0053A7` → `#1A5878` (teal-blue operators) vs `#0550AE` (pure blue properties, unchanged)
  - Light Bright: `#0052A3` → `#1C5A7A` vs `#0349A4` (unchanged)
- **Built-in constants separated from numbers in light themes** — constants (`true`, `false`, `null`) shifted to burgundy, away from the plum used for numeric literals
  - Light: `#8B3045` → `#A32E42`
  - Light Bright: `#8A2C42` → `#A42C3E`
- **Dark theme built-in constants moved away from error red** — constants now use warm clay/peach instead of the salmon that was too close to error highlighting
  - Dark: `#E1948F` → `#D4A090`
  - Dark Dimmed TOML/YAML booleans aligned with general constant color `#E8A090`

### Fixed
- Dark Dimmed CSS property color `#65A9ED` (over-saturated) corrected to `#88AED0` to match the dimmed property palette
- Dark Dimmed TOML boolean, YAML null/boolean/merge colors corrected from tag color (`#D87A6A`) to constant color (`#E8A090`)
- All example files, playground, and documentation updated

## [1.9.3] - 2026-03-27

### Changed
- **Dark theme constants shifted to amber** — constants now use `#CC8858` (Dark) and `#C08050` (Dark Dimmed), creating clear hue separation from keywords which remain orange
- **Light theme comments darkened** — improved WCAG headroom above the 4.5:1 floor
  - Light: `#78705E` → `#746C58` (4.9:1), doc comments `#706656` → `#6C6252` (5.6:1)
  - Light Bright: `#7C7466` → `#787060` (4.7:1), doc comments `#746A5C` → `#706658` (5.3:1)
- **Light Bright background warmed** — `#FDFCFA` → `#FAF9F4`, subtle parchment tone instead of near-white
- **Light Bright colors adjusted** for new background — operator `#0055A8` → `#0052A3`, punctuation `#737373` → `#6E6E6E`, SQL keyword `#AC1923` → `#A5151E`

### Fixed
- All 353 WCAG contrast pairs still pass (118 syntax + 235 UI)
- All example files, screenshots, and documentation updated

## [1.9.2] - 2026-03-27

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
