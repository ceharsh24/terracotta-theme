# Changelog

All notable changes to the Terracotta theme will be documented in this file.

## [Unreleased]

## [1.13.0] - 2026-05-31

### Token separation & off-brand selection — Dark, Dark Dimmed, Light, Light Bright

Goal: stop the brand terracotta from doubling as the text-selection color, decouple terminal red from the keyword coral on the dark variants, and pull apart the syntax lanes that collapse in React/TSX and Java — especially on Light Bright. High Contrast CB is intentionally untouched. All changes are color-only; no font-weight changes.

#### Editor selection — all four warm variants

- Editor selection moved off the brand terracotta to a cool slate (Dark `#4A5A82`, Dark Dimmed `#4E5E86`, Light & Light Bright `#345C9E`), so selecting code no longer tints it orange and no longer competes with find-match. Covers `editor.selectionBackground`, `editor.selectionHighlightBackground`, `editor.inactiveSelectionBackground`, `selection.background`, and `minimap.selectionHighlight`.
- Find-match stays terracotta (now the only orange fill in the editor); word-highlight stays blue. Sidebar/list selection keep the brand accent.

#### Terracotta Dark (`#141414`)

- **Property / object-member access** olive `#B4AC66` → sage green `#8FB46E` (7.83:1), so `obj.prop` separates from the chartreuse `variable` lane by hue, not just lightness. JSON/YAML/CSS keys and HTML attributes stay olive (different role).
- **Terminal red** decoupled from the keyword coral: `ansiRed` `#E98665` → true red `#E85C50` (5.33:1), `ansiBrightRed` `#E8906A` → `#F4705F` (6.43:1), so error output reads as red.

#### Terracotta Dark Dimmed (`#1A1A1A`)

- **Terminal red** `ansiRed` `#E0976E` → `#E2625A` (5.08:1), `ansiBrightRed` `#E08A68` → `#EC6E64` (5.79:1).

#### Terracotta Light Bright (`#FAFAFA`)

- **Primitive types** (`int`, `void`, `boolean`, TS `number`/`string`, Go/C/C++ primitives) rust `#8E351C` → type-purple `#6A2091` (9.03:1): primitives no longer render identically to keywords (Java type-vs-keyword ΔE 0 → 83).
- **Namespace / module / package** navy `#274E91` → steel-blue `#3D71B8` (4.73:1): distinct from the operator blue (ΔE 4.6 → 12.9) and adds a recede tier the flat light palette lacked.
- **Decorator / annotation** purple `#803B9E` → magenta `#A62E76` (6.15:1): pulls `@Component`/`@Override` away from the class/interface purples (vs class ΔE 11.1 → 35.7, vs interface 7.3 → 34.2).

#### Notes

- All editor backgrounds and brand accents unchanged; High Contrast CB untouched.
- All Tier 1 syntax tokens remain WCAG AAA (≥ 7:1); Tier 2 remain AA (≥ 4.5:1); terminal ANSI ≥ 4.5:1.
- All palette-spacing floors hold (core lanes ΔE ≥ 18, callable/property ≥ 18, dark↔dimmed and light↔bright drift floors).
- Corrected the stale Light Bright background in `CLAUDE.md` (`#F8FBFC` → `#FAFAFA`); synced `docs/index.html`, `examples/THEME-DEMO.html`, `examples/screenshot-gen.html`, and `examples/theme-analysis.html`.

## [1.12.0] - 2026-05-25

### Brightness & contrast pass — Dark, Dark Dimmed, Light, Light Bright

Goal: lift the syntax lanes that read as "dull" and sat right at the WCAG AAA 7:1 floor with no headroom, plus the muddy supporting lanes — without changing the warm Terracotta identity. High Contrast CB is intentionally untouched (already 8–17:1, validated Wong/IBM color-blind palette). All changes are color-only; no font-weight changes.

#### Terracotta Dark (`#141414`)

- **Function / method / macro** greyed teal `#5AAFA0` (7.08:1, at floor) → vivid teal `#5CC2AE` (8.58:1).
- **String family** mustardy ochre `#C49828` (6.90:1) → clean gold `#D2A436` (7.99:1).
- **Operator / label** slate-grey blue `#8DA4C4` (7.23:1) → cleaner blue `#92ACD0` (7.93:1).
- **Property / HTML attribute / JSON-YAML-TOML keys** muddy olive `#A8A060` → more luminous `#B4AC66` (7.92:1).
- Keyword `#E98665` left as-is (vivid coral already; signature accent).

#### Terracotta Dark Dimmed (`#1A1A1A`)

- **Keyword / storage** tan-grey `#D89A74` (7.29:1) → warmer terracotta `#E0976E` (7.31:1), still softer than Dark (dark↔dimmed ΔE ≥ 10).
- **String family** muddy amber `#C4984A` (6.58:1) → cleaner amber `#CCA050` (7.22:1).
- **Decorator / annotation** murky mauve `#AC749C` (4.75:1, near floor) → clearer mauve `#B47CA6` (5.28:1).
- **Property / attribute** muddy olive-green `#8DA56E` (6.41:1) → fresher `#97AC74` (7.02:1).
- **User constants** murky chartreuse `#A4A848` → cleaner `#AEB052` (7.57:1).

#### Terracotta Light (`#F4EEE4`)

- **Tag (HTML/XML/JSX)** washed rust `#A14A3A` (5.12:1) → richer `#9C3E2C` (5.80:1).
- **Regex / regex char class** thin magenta `#A04080` (5.14:1) → deeper `#97356F` (5.96:1).
- **Shared red** (diff-deleted / error / git / status / invalid) `#AD4545` (4.90:1) → deeper `#A23C3C` (5.60:1) for headroom; status-bar error white-on-red lifts to 6.47:1.

#### Terracotta Light Bright (`#FAFAFA`)

- **String / user constants** flat tan `#7A5220` (6.59:1) → richer amber `#7E4E14` (6.74:1).
- **Regex** thin rose `#9A4078` (5.96:1) → deeper magenta `#92356E` (6.80:1).
- **Tag (HTML/XML/JSX)** muted brick `#9A3E3E` → richer red `#A23030` (6.70:1).
- **Operator / label** greyed navy `#3A5578` (7.31:1) → cleaner saturated blue `#2F5390` (7.29:1).
- **Variable** near-black grey `#37383F` (barely separable from foreground) → faint indigo `#3A3A4E` (10.62:1) so the high-frequency lane has its own identity.
- Keyword `#8E351C` left as-is (a richer rust drops below AAA 7:1 on near-white or collides with the Light variant's keyword).

#### Notes

- All editor backgrounds and brand accents unchanged.
- All Tier 1 syntax tokens remain WCAG AAA (≥ 7:1); Tier 2 remain AA (≥ 4.5:1).
- All palette-spacing floors hold (core lanes ΔE ≥ 18, dark↔dimmed and light↔bright drift floors, operator/variable ≥ 16).
- Bracket-pair guides / bracket-match / overview ruler / minimap / debug console — all derived from the lifted syntax values.
- Synced `README.md`, `docs/index.html`, `examples/THEME-DEMO.html`, `examples/screenshot-gen.html`, and `examples/theme-analysis.html`.

## [1.11.0] - 2026-04-25

### Light Bright — full palette redesign

Goal: reduce the high-saturation "mixed colors" feel (especially in Java, where operators flooded the editor with vivid blue), align the family with Anthropic/Claude's warm-editorial aesthetic, and lift the chrome so it reads as a daylight variant rather than cream.

#### Syntax — desaturated, low-chroma rework

- **Operators** moved off vivid blue `#14539E` → muted slate-ink `#3A5578`. Single biggest change: kills the "too much bright blue" that dominated Java code with `=`, `->`, `<>`, `&&`, `||`, `>>>` etc.
- **Class / type / struct** off electric indigo `#3828A8` → deep violet `#6A2091`.
- **Interface** off `#4A42C4` → lighter violet `#8A4AB5` (italic) — distinct from class without re-introducing electric indigo.
- **Namespace / module / package** off `#4A42C4` → muted ink-navy `#274E91` — own lane, not crammed into the class purple.
- **builtinType / Java primitives / C/C++ primitives / Go builtin types** consolidated into the keyword/storage rust `#8E351C` (primitives are keyword-like in these languages).
- **Variable** off `#2E4A70` → near-ink slate `#37383F`. Variables now recede instead of competing for attention.
- **Parameter** off `#70521E` → deep umber `#6B4218`. Hue-separated from string olive so they no longer blur together.
- **Property / JSON-YAML-TOML keys / HTML attributes** off `#196878` → deeper petrol `#0E6470`.
- **String** off `#8A5A00` → editorial tan `#7A5220`.
- **Number / built-in const / enumMember / event / CSS id-units-color / regex quantifier / Markdown list** consolidated to plum `#8A3458` (was a mix of `#A02450`, `#9E3C62`, `#A23B6D`, `#B24D8A`).
- **Regex / regex char class** off `#B24D8A` → muted rose `#9A4078`.
- **Decorator / Python decorator / Java annotation / Rust attribute** off `#7A3AA0` → `#803B9E` (slightly more violet, less blue).
- **Enum** off `#8A3A6A` → `#7A2F60`.
- **Type parameter** off `#38528F` → `#3F4F7E` (kept T1 AAA on `#FAFAFA`).
- **Inherited class** off `#3E3F94` → `#5A4A9A` (italic).
- **Tag (HTML/XML/JSX)** off `#B1484A` → muted brick `#9A3E3E`.
- **Comment** lifted slightly `#605E5A` → `#6E6A62` (still 5.31:1 on `#FAFAFA`).
- **User constants** unified with string family `#7A5A00` → `#7A5220`.
- Bracket pair guide / bracket-match / overview ruler / minimap / debug console / git decorations / charts / input-validation info — all derived from the new operator/class/number/decorator values.

#### Chrome — distinctly brighter, less cream

- `sideBar.background` / `activityBar.background` / `statusBar.background` / `titleBar.activeBackground`: `#E4E1DC` → `#EFEDE7` (luminance lifted ~5 in LAB; warmth halved). Now reads as daylight rather than cream while still belonging to the Terracotta family.
- `sideBarSectionHeader.background`: `#DCD8D2` → `#E8E5DE`.
- `panel.background`: `#EDEAE4` → `#F2F0EA`.
- `editorGroupHeader.tabsBackground`: `#ECEAE7` → `#F0EEE8`.
- `tab.inactiveBackground` / `tab.unfocusedInactiveBackground`: `#ECEAE7` → `#EBE8E1` (steps darker than tab bar so the active tab pops more clearly).
- `tab.activeBackground`: `#F0EFED` → `#F6F4EE`.
- All chrome borders: `#E6E4E1` → `#E2DFD8`.
- Editor / suggest / hover widgets, peek view, command center: `#F3F1ED` → `#F4F2EC`.
- `titleBar.inactiveBackground` / `tab.unfocusedActiveBackground`: `#F2F1EF` → `#F8F6F0`.
- `tab.hoverBackground`: `#F1F0EE` → `#F6F4EE`.
- `commandCenter.activeBackground`: `#F3F0EA` → `#F6F4EE`.
- Toolbar hover / keybinding label: `#E8E0D6` → `#EBE3D9`.
- Block-quote background: `#F2EBE1` → `#F6EFE5`.
- StatusBar.noFolder / debug toolbar: `#F3EBDD` → `#F8F2E5`.
- Menu selection / quick input list focus: `#D4CBBA` → `#DDD5C6`.
- Pushed up to the palette-spacing floor (`sideBar` ΔE ≈ 5.4 from editor `#FAFAFA`); to lift further we'd need to warm the editor or relax the floor — defer until validated visually.

#### Notes

- Editor `#FAFAFA` and accent `#D8744E` are unchanged.
- All Tier 1 syntax tokens remain WCAG AAA (≥ 7:1); Tier 2 remain AA (≥ 4.5:1).
- All palette-spacing floors hold (core lanes ΔE ≥ 18, sidebar ΔE ≥ 5 from editor, light-vs-bright drift ≥ floors).
- Synced `README.md`, `docs/index.html`, `examples/THEME-DEMO.html`, `examples/screenshot-gen.html`, and `examples/theme-analysis.html`. Screenshot regeneration deferred (requires Puppeteer/Chrome).

## [1.10.4] - 2026-04-19

### Fixed

- **Light Bright — command palette selection invisible**: `quickInputList.focusBackground` and `menu.selectionBackground` darkened to `#D4CBBA` (was `#F3F0EA`, ~1.01:1 vs input bg → now ~1.39:1), matching the visibility bar set by the dark variant.
- **Light — command palette selection**: same fix applied (`#E6DCCD` → `#CEBBAA`).
- **Light Bright — Markdown blockquote collides with operator**: `markup.quote` and `meta.separator.markdown` moved from operator blue `#14539E` to earth brown `#6E5A3A`, matching the approach used in Light and all dark variants.
- **Light Bright — surfaces blend together**: `panel.background` darkened (`#F3F1ED` → `#EDEAE4`); `tree.indentGuidesStroke` darkened (`#D9D2C8` → `#B8B0A4`); `activityBar.inactiveForeground` strengthened (`#6E6A64` → `#585450`, now 5.75:1 AA).
- **Light Bright — inherited class indistinguishable from functions**: `entity.other.inherited-class` moved from teal `#0E6B56` to indigo `#3E3F94` — now in the class/type hue family rather than the function green family.
- **Light Bright — interface too close to operator**: `entity.name.type.interface` and semantic `interface` token shifted from medium blue `#275BAA` to purple-blue `#4A42C4`, aligning with the type/namespace lane.
- **Light Bright — import/export too dominant**: `keyword.control.import/export/from/as` softened from rust `#8E351C` to terracotta brown `#9A572A` (7.52:1 → 5.34:1), reducing visual weight at file top.
- **Light Bright — user constants too close to parameters**: `variable.other.constant` shifted from warm brown `#6E4A14` to amber `#7A5A00`, creating hue distance from parameter brown `#70521E`.
- **Light Bright — language decorators collide with regex**: Python decorators, Java annotations, and Rust attributes changed from regex pink `#B24D8A` to general decorator purple `#7A3AA0`, eliminating the semantic→TextMate color flash.
- **Light — same decorator/regex collision**: same fix applied (`#A04080` → `#6A2E90`).
- **Light Bright — doc comments barely passing**: `comment.block.documentation` / `.javadoc` darkened (`#6A7568` → `#5E6A5C`, 4.62:1 → 5.45:1), adding headroom against monitor calibration variance.
- **Light Bright — punctuation too close to comments**: punctuation shifted from warm grey-brown `#6E6458` to cool grey `#686870`, adding hue distance from comment taupe `#605E5A`.
- **Light Bright — property lane split between tag attrs and data keys**: `entity.other.attribute-name` unified with JSON/YAML/TOML keys at teal `#196878` (was green `#386E1F`).
- Synced `docs/index.html`, `examples/THEME-DEMO.html`, `examples/screenshot-gen.html`, and `examples/theme-analysis.html` with updated palette values.

## [1.10.3] - 2026-04-16

### Changed
- **Dark**: info and “editor info” UI lane moved off warm taupe onto oxidized teal (`#B0A090` → `#6ABAC8`) for input validation, overview ruler, inline info, and debug console; decorators/tags/SQL accent orchid lifted (`#B468A0` → `#C478B0`); `this`/self/special language variables warmed (`#C8B468` → `#D4A058`).
- **Dark Dimmed**: punctuation and tag delimiters cooled to slate-blue gray (`#A49698` → `#8AABB8`); markup tags, SQL keywords, and shell specials nudged to clearer terracotta (`#D87A6A` → `#E0705C`).
- **Light**: activity bar, sidebar, status bar, and title bar chrome lifted to warmer parchment (`#E2D8C9` → `#EADFCF`); section headers stepped for depth (`#EADFCF` → `#E0D4C0`); doc comments deepened for readability (`#5E6E5E` → `#4D6150`); enum members shifted to amber-brown (`#604010` → `#8A4A00`); variables and GraphQL/Dockerfile fields nudged plum (`#552576` → `#5A3E68`); object/CSS keys and semantic **property** lane moved to teal (`#366014` → `#196878`) to separate from function green; block quotes in markdown use earth brown instead of keyword-adjacent blue (`#124878` → `#6B523A`).
- **Light Bright**: chrome surfaces and tabs retuned for clearer layering on `#FAFAFA` (e.g. activity/sidebar/status/title `#EBE7E1` → `#E4E1DC`, tab inactive/hover harmonized); bracket tier 4, chart purple, git submodule, and bracket-pair guides use saturated indigo (`#6638B0` → `#4A42C4`) aligned with type purple family; inlay hints use cooler slate (`#6E6A64` / `#75716B` → `#4A6878` / `#526070`); GraphQL fields and Dockerfile variables use navy (`#6A3A96` → `#2E4A70`); TOML keys and semantic **property** use the same teal as Light (`#386E1F` → `#196878`); JSX/components/builtin types and related scopes follow `#4A42C4`.
- Synced README, `docs/index.html`, `examples/THEME-DEMO.html`, `examples/theme-analysis.html`, and `examples/screenshot-gen.html`; regenerated `screenshot-dark-dimmed.png`, `screenshot-light.png`, and `screenshot-light-bright.png`.

## [1.10.2] - 2026-04-15

### All variants — syntax quality pass
- **Dark**: tamed string brightness (`#E8B830` → `#C49828`); shifted variable to golden-yellow (`#D9A06D` → `#D0C060`) to widen hue gap from keyword orange and prevent warmth bleed.
- **Dark Dimmed**: separated string/constant lanes by hue — strings move to amber (`#C2A35A` → `#C4984A`), user constants to olive-yellow (`#BCA060` → `#A4A848`), a ~24° split that prevents the same-gold confusion in constant-heavy code.
- **Light**: darkened comments by ~1.2 ratio points (`#78684F` → `#685848`, 4.68 → 5.91:1); shifted strings to olive-amber (`#6E4A00` → `#5C5200`) to break hue overlap with rust-red keywords.
- **Light Bright**: moved namespace/type out of navy into indigo (`#213B67` → `#3828A8`), resolving the lane collision with keyword operator (`#14539E`); enlivened strings (`#7A5600` → `#8A5A00`); darkened comments (`#6F6D68` → `#605E5A`, 4.95 → 6.20:1).
- **High Contrast CB**: differentiated strings from numbers by moving strings to the IBM/Wong reddish-purple branch (`#F0D050` → `#F0A8DC`); gave variables colour identity with light lavender (`#C8C4B4` → `#C0C0F0`).
- All tokens continue to pass WCAG Tier 1 (≥7:1) or Tier 2 (≥4.5:1). Palette spacing floors unchanged.

## [1.10.0] - 2026-04-14

### Terracotta Light + Light Bright — dual identity rework
- Reworked Light Bright from an icy cool-grey scheme into a crisp neutral daylight identity. Editor surface uses pure neutral `#FAFAFA` with near-warm chrome (`#EBE7E1`); Terracotta identity is carried by the hero accent (`#D8744E`) and warm keyword rust (`#963014`). Active tab stays a hair warmer at `#F0F0F0` so the daylight variant keeps enough surface separation under the palette-spacing checks.
- Preserved Light's warm parchment surfaces while rebuilding its syntax palette to eliminate the muddy taupe/mauve/olive cluster it shared with Light Bright.
- Across both variants, variables move to saturated purple, parameters to warm rust, decorators to violet, regex to clearer pink, and the working lanes are tuned to the highest-contrast values that still preserve the intended split. Light Bright class/type uses `#213B67` against operator navy `#0E4F96`; Light uses `#064A26` for callable greens on parchment.
- Overhauled the terminal ANSI palette in both variants for stronger saturation on their respective terminal backgrounds. The validated release keeps the brighter ANSI uplift where it passes the automated checks and avoids the lower-contrast draft values from the original plan table.
- Synced the plan, README, docs, demos, and screenshots to the validated final palette values.
- Synced README, `docs/index.html`, `examples/THEME-DEMO.html`, `examples/theme-analysis.html`, and `examples/screenshot-gen.html`; regenerated `screenshot-light.png` and `screenshot-light-bright.png`.

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
