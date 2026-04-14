# Terracotta Light + Light Bright — Dual Variant Rework

## Context

The user considers the dark variants fine but wants to actually *use* the Light family for full-day coding. Today, Light Bright feels muddy, grey, and icy, with a weak full-screen terminal. While auditing it, we confirmed that Light shares the same muddy syntax cluster — the fix belongs in both variants. Each should have its own distinct mood, not a recoloured version of the other.

### Current pain points

1. **Icy cool-grey chrome on Light Bright** (`#E7EEF0` sidebar / activity / status / title) drives the "grey everywhere" feel and has no Terracotta identity.
2. **Light Bright's bg `#F8FBFC` is pale blue-white**, not neutral — steals saturation from accents and produces the washed-out impression.
3. **Both variants share a muddy syntax cluster** — comment, variable, parameter, decorator, regex, this/self all sit at similar low-chroma L*, collapsing into one taupe/mauve/olive lane.
4. **Terminal ANSI is pastel on both**, but especially on Light Bright where the icy bg strips further vibrancy.

### Identity split (decided)

- **Terracotta Light** — warm editorial parchment. Keep the existing `#F4EEE4` bg, `#E2D8C9` biscuit chrome, warm dark-brown fg `#2A241F`. Surfaces untouched. Fix the muddy syntax cluster and polish the terminal ANSI.
- **Terracotta Light Bright** — crisp neutral daylight. Move to `#FAFAFA` editor + `#EBE7E1` near-neutral chrome (no warm biscuit — that's Light's job). Terracotta identity comes through the hero accent `#D8744E` and keyword rust `#963014`, not through warm chrome.

Both variants must still pass `check-palette-spacing.js` drift floors (avg ≥7, 6+ roles each ≥6 ΔE) — the syntax hex tables below deliberately hold divergence across the pair.

## Decisions locked in

- **Light Bright editor bg** → `#FAFAFA` (pure neutral, Material "Grey 50"). Full-day usable — softer than pure `#FFFFFF` used by Light+/Light Modern/Sublime. If it feels too bright in practice, `#F7F7F5` is a drop-in softer step without losing crisp-daylight identity.
- **Light Bright fg** → keep `#1F1F1F`. The "black not dark enough" feel came from surroundings; fixing chrome + accents resolves it.
- **Light Bright chrome** → `#EBE7E1` (near-neutral with hair of warmth). Clearly not cool-blue; clearly not warm biscuit.
- **Light surfaces** → keep as-is (parchment identity intact).
- **Scope** → full overhaul on both variants (surfaces where relevant + syntax + terminal ANSI) shipped as **v1.10.0**.

## A. Surface palette

### A1. Light Bright (major rework)

ΔE checks per `check-palette-spacing.js` (bg ≥5 vs light; sideBar ≥5; panel ≥3.5; tab.active ≥3).

| Key | New hex | Note |
|---|---|---|
| `editor.background` | `#FAFAFA` | Pure neutral daylight white. ΔE ~7 vs light's `#F4EEE4`. |
| `editor.foreground` | `#1F1F1F` | Unchanged; genuine dark at ~16.5:1. |
| `sideBar.background` | `#EBE7E1` | Near-neutral micro-warm. Keeps the daylight shell warm enough without collapsing into Light's biscuit chrome. |
| `sideBarSectionHeader.background` | `#E9E6DF` | Subtle section definition. |
| `activityBar.background` | `#EBE7E1` | Match sidebar. |
| `statusBar.background` | `#EBE7E1` | Match. |
| `titleBar.activeBackground` | `#EBE7E1` | Match. |
| `titleBar.inactiveBackground` | `#F5F3EE` | Lighter inactive. |
| `panel.background` | `#F3F1ED` | Slightly brighter than sidebar, reads as "foreground surface". ΔE ~3.7 vs editor. |
| `tab.activeBackground` | `#F0F0F0` | Near-continuous with editor, but nudged off-white so palette-spacing checks still distinguish the active tab. |
| `tab.inactiveBackground` | `#E8E5DF` | Recessed. |
| `editorGroupHeader.tabsBackground` | `#EAE7E0` | Between inactive tab and sidebar. |
| `tab.hoverBackground` | `#F3F0EA` | Subtle hover. |
| `editor.lineHighlight` | `#F2EFE8` | Subtle warm band. |
| `editorLineNumber.foreground` | `#B3ADA5` | Warm-neutral grey. |
| `editorLineNumber.activeForeground` | `#504A42` | ~7.6:1. |
| Borders (`editorGroup/sideBar/activityBar/titleBar/panel/statusBar.border`) | `#E4E0D8` | Warm low-contrast. |
| Widget bgs (`editorWidget`, `editorSuggestWidget`, `editorHoverWidget`, `peekView*`, `commandCenter.background`, `notificationCenterHeader.background`, `banner.background`, `quickInput.background`, `walkThrough.embeddedEditorBackground`, `welcomePage.tileBackground`, `editorStickyScroll.background`) | `#F3F1ED` | Match panel. |
| `menu.background`, `dropdown.listBackground`, `input.background`, `checkbox.background` | `#FFFFFF` | Pure white on overlays. |

Identity via accent — keep unchanged: `focusBorder #D8744E66`, `selection.background #D8744E28`, `button.background #D8744E`, `activityBarBadge/progressBar/badge.background #D8744E`, `textBlockQuote.border`, `sash.hoverBorder`, `list.activeSelectionBackground #D8744E42`, `editorCursor.foreground #D8744E`.

**Pre-flight**: run `node scripts/check-palette-spacing.js` on current `main` to confirm `button.background #D8744E` vs Light's `#B66743` clears the `accent ≥10` ΔE floor. If tight, nudge Light Bright's accent to `#E07A4C`.

### A2. Light (surfaces untouched)

Light's surface palette is already doing its job. Keep every `colors` surface key unchanged: `editor.background #F4EEE4`, `editor.foreground #2A241F`, `sideBar.background #E2D8C9`, `activityBar.background #E2D8C9`, `statusBar.background #E2D8C9`, `titleBar.activeBackground #E2D8C9`, `panel.background #E8DDCE`, `tab.activeBackground #EFE4D5`, line numbers, borders, widget backgrounds. No changes in A2.

## B. Syntax palette — both variants

Tables below show old and new for each variant side-by-side. Light hex values sit proportionally darker / deeper than Light Bright hex values so the light-vs-bright drift floors in `check-palette-spacing.js` stay well above minimums (target: avg ≥10, 8+ roles each ≥6 ΔE).

### Kept (core identity, both variants)

| Role | Light hex | Bright hex | Note |
|---|---|---|---|
| Keyword / control / storage / import / new-delete | `#8C2A0E` | `#963014` | Hero rust; ΔE ~2 kept tight on purpose |
| Tag name | `#A14A3A` (Light) / `#B1484A` (Bright) | — | ΔE ~4 |
| Numbers | `#84184A` | `#A02450` | ΔE ~8 |
| Enum (italic) | `#883868` | `#8A3A6A` | ΔE ~2 |
| Parameter type / generic (italic) | `#3B4B7A` | `#38528F` | ΔE ~3 |
| Built-in constant (italic) | `#983C5A` | `#9E3C62` | ΔE ~3 |

### De-muddified (both variants)

Ratios given against each variant's bg (Light `#F4EEE4`, Bright `#FAFAFA`).

| Role | Light old → new | Ratio | Bright old → new | Ratio | Δ Light↔Bright |
|---|---|---|---|---|---|
| Comment | `#6C6758` → **`#78684F`** | 5.5 | `#72746C` → **`#7A6B52`** | 5.0 | ~7 |
| Doc comment (italic) | `#5B7675` → **`#5E6E5E`** | 6.4 | `#5C767A` → **`#6A7568`** | 5.9 | ~5 |
| String / template expr / punctuation.string | `#795600` → **`#6E4A00`** | 7.6 | `#8A6200` → **`#7A5600`** | 8.3 | ~5 |
| String escape | `#6B421A` → **`#5E3910`** | 8.5 | `#7A4318` → **`#6E3A10`** | 8.1 | ~5 |
| Regex + regex char class | `#8C5175` → **`#A04080`** | 5.4 | `#91517A` → **`#B24D8A`** | 5.1 | ~7 |
| User const / enum member | `#8A6E2A` → **`#604010`** | 7.7 | `#8A6F28` → **`#6E4A14`** | 6.5 | ~4 |
| Keyword operator (+ logical / assignment / arithmetic, semantic `operator`/`label`) | `#1B5078` → **`#124878`** | 8.2 | `#1A508C` → **`#0E4F96`** | 8.2 | ~10 |
| Function decl / call / method / CSS function / MD link / semantic `function`/`method`/`macro` | `#065840` → **`#064A26`** | 9.0 | `#006050` → **`#145A32`** | 7.9 | ~7 |
| Built-in function / `function.defaultLibrary` / SQL function / CSS pseudo (italic) | `#2F6759` → **`#107046`** | 6.6 | `#1C6A61` → **`#117A5F`** | 6.5 | ~6 |
| Class / `support.class` / `entity.name.type.class` / struct | `#5E3490` → **`#5A2FAE`** (Light) | 7.1 | `#3548A6` → **`#213B67`** (Bright) | 10.7 | ~21 |
| Inherited class (italic) | `#4B4B85` → **`#3E3F94`** | 7.5 | `#4E5A9A` → **`#4450A8`** | 7.1 | ~6 |
| Interface (italic) | `#2F63A4` → **`#275BAA`** | 7.1 | `#3266AD` → **`#275BAA`** | 7.1 | ~0 |
| Namespace / module / type annotation / class (semantic decl) / SCSS-LESS var | `#7038A0` → **`#5A2FAE`** (Light) | 7.5 | `#4C3CB0` → **`#5A2FAE`** (Bright) | 7.6 | ~0 |
| Variable / `variable.other` / `variable.readonly` / `variable.declaration` / `variable.modification` / CSS value / YAML value / MD bold (keep fontStyle) | `#714025` → **`#552576`** | 7.3 | `#6D3E22` → **`#5E2E87`** | 7.6 | ~5 |
| Parameter / `parameter.declaration` / `parameter.modification` / MD italic (keep fontStyle) | `#7E5840` → **`#7A3F14`** | 6.3 | `#7A5838` → **`#8A4A1E`** | 6.1 | ~7 |
| This / Self / Super | muddy olive → **`#7A3F14`** (match parameter) | 6.3 | `#7A6724` → **`#8A4A1E`** (match parameter) | 6.1 | — |
| Property / `variable.other.property` / JSON key / YAML key / CSS property / semantic `property*` / tag attribute | `#407028` → **`#366014`** | 5.7 | `#387E28` → **`#386E1F`** | 5.8 | ~5 |
| Decorator / annotation (italic) | `#7A4764` → **`#6A2E90`** | 6.9 | `#7E4870` → **`#7A3AA0`** | 6.8 | ~6 |
| Punctuation / `meta.brace` / `punctuation.section` | `#5A6672` → **`#625848`** | 5.8 | `#5A6672` → **`#6E6458`** | 5.6 | ~6 |
| Tag punctuation | `#2E5E98` → **`#124878`** (match operator) | 8.2 | `#2D5E9A` → **`#0E4F96`** (match operator) | 8.2 | — |
| CSS selector class | `#42715F` → **`#107046`** (match built-in fn) | 6.6 | `#2B746A` → **`#117A5F`** | 6.5 | — |
| CSS pseudo-class/element (italic) | `#186842` → **`#107046`** (match built-in fn) | 6.6 | `#006050` → **`#117A5F`** | 6.5 | — |
| CSS selector id / CSS units / CSS color value | `#9A4567` → **`#9A4567`** (keep) | 6.1 | `#A23B6D` → **`#A23B6D`** (keep) | 6.1 | ~4 |
| MD strikethrough | `#6C6758` → **`#78684F`** (match comment) | 5.5 | `#72746C` → **`#8A7B62`** | 4.8 | ~9 |
| MD link / image | `#7038A0` → **`#5A2FAE`** (match namespace) | 7.5 | `#4C3CB0` → **`#5A2FAE`** | 7.6 | — |
| MD quote / separator | `#2E5E98` → **`#124878`** (match operator) | 8.2 | `#2D5E9A` → **`#0E4F96`** (match operator) | 8.2 | — |

### Drift sanity (Light vs Light Bright)

Required: avg ΔE ≥7 across 9 core roles (comment / keyword / operator / function / type / string / number / variable / property), 6+ roles each ≥6 ΔE, explicit `LIGHT_PAIR_DRIFT_MIN` floors (bg 5, accent 10, function 6, number 6, operator 6).

Estimates: comment ~7, keyword ~2, operator ~10, function ~7, type ~21, string ~5, number ~8, variable ~5, property ~5. **Avg ≈ 8.5; 6 roles clear the 6 floor** (comment, operator, function, type, number, plus decorator ~6, regex ~7, parameter ~7 in extended set). Explicit floors: bg ~7 (✓), function ~7 (✓), number ~8 (✓), operator ~10 (✓).

If `variable` comes in tight (target ~5 ΔE vs 6 floor — only relevant to extended role set, not the 6-role minimum), widen Light's variable to `#4E2070` for ΔE ~8.

### Decoration bleed

Every old syntax hex is reused across the `colors` block in **both** variants (bracket highlights, bracket-pair guides, debug token values, charts, minimap, diff streams, alpha variants like `#8A620020`, `#6D3E2240`, `#71402540`). Grep-and-replace each in the respective file:

**Light Bright replacements** (in `themes/terracotta-light-bright.json`):
- `6D3E22` → `5E2E87`, `7A5838` → `8A4A1E`, `7E4870` → `7A3AA0`, `91517A` → `B24D8A`, `7A6724` → `8A4A1E`, `3548A6` → `213B67`, `4C3CB0` → `5A2FAE`, `006050` → `145A32`, `8A6200` → `7A5600`, `72746C` → `7A6B52`, `1A508C` → `0E4F96`, `387E28` → `386E1F`, `1C6A61` → `117A5F`, `2B746A` → `117A5F`, `2D5E9A` → `0E4F96`

**Light replacements** (in `themes/terracotta-light.json`):
- `714025` → `552576`, `7E5840` → `7A3F14`, `7A4764` → `6A2E90`, `8C5175` → `A04080`, `5E3490` → `5A2FAE`, `7038A0` → `5A2FAE`, `065840` → `064A26`, `795600` → `6E4A00`, `6C6758` → `78684F`, `1B5078` → `124878`, `407028` → `366014`, `2F6759` → `107046`, `42715F` → `107046`, `186842` → `107046`, `2E5E98` → `124878`

Kept hexes in both: `9E3C62`/`983C5A`, `9A4567`/`A23B6D`, `8A3A6A`/`883868`, `38528F`/`3B4B7A`, `B1484A`/`A14A3A`, `A02450`/`84184A`, `963014`/`8C2A0E`.

## C. Terminal ANSI palette — both variants

Reference: GitHub Light's ANSI saturation, hue-shifted slightly to match each variant's bg. All regular + bright must clear 4.5:1 per `check-terminal-palette.js` (ansiBlack/BrightBlack exempt).

### C1. Light Bright (on `terminal.background #F3F1ED`)

| Key | New hex | Ratio |
|---|---|---|
| `terminal.foreground` | `#1F1F1F` | 12.3 |
| `terminal.background` | `#F3F1ED` | — |
| `terminal.ansiBlack` | `#1F1F1F` | — |
| `terminal.ansiRed` | `#B81E1A` | 5.9 |
| `terminal.ansiGreen` | `#117F1A` | 5.0 |
| `terminal.ansiYellow` | `#8A5A00` | 5.6 |
| `terminal.ansiBlue` | `#0E58C4` | 5.7 |
| `terminal.ansiMagenta` | `#7A2FB0` | 5.8 |
| `terminal.ansiCyan` | `#085C6A` | 6.8 |
| `terminal.ansiWhite` | `#585048` | 6.1 |
| `terminal.ansiBrightBlack` | `#8A8276` | — |
| `terminal.ansiBrightRed` | `#D42820` | 5.1 |
| `terminal.ansiBrightGreen` | `#187010` | 5.5 |
| `terminal.ansiBrightYellow` | `#8A6200` | 4.9 |
| `terminal.ansiBrightBlue` | `#1068D6` | 5.0 |
| `terminal.ansiBrightMagenta` | `#9A3EC4` | 4.7 |
| `terminal.ansiBrightCyan` | `#0B7484` | 4.8 |
| `terminal.ansiBrightWhite` | `#3E3A34` | 9.7 |
| `terminalCursor.foreground` | `#D8744E` | — |
| `terminal.selectionBackground` | `#D8744E32` | — |

### C2. Light (on `terminal.background #F4EEE4`, unchanged bg)

Slightly deeper saturation than Bright to match the warmer parchment. Same approach — vivid but not neon.

| Key | Old | New | Ratio |
|---|---|---|---|
| `terminal.foreground` | `#2E2A27` | `#2A241F` | 11.5 |
| `terminal.ansiBlack` | `#2E2A27` | `#2A241F` | — |
| `terminal.ansiRed` | `#8C2A0E` | `#A61818` | 5.9 |
| `terminal.ansiGreen` | `#186842` | `#0E7018` | 5.1 |
| `terminal.ansiYellow` | `#795600` | `#7E4F00` | 5.8 |
| `terminal.ansiBlue` | `#2E5E98` | `#0A4FB0` | 5.9 |
| `terminal.ansiMagenta` | `#6A3C95` | `#6A2BA0` | 5.9 |
| `terminal.ansiCyan` | `#136A7A` | `#0A6A80` | 4.9 |
| `terminal.ansiWhite` | `#585048` | `#585048` | 6.1 |
| `terminal.ansiBrightBlack` | `#6F6A63` | `#7A7268` | — |
| `terminal.ansiBrightRed` | `#A02A0A` | `#C42414` | 5.1 |
| `terminal.ansiBrightGreen` | `#006838` | `#166E0F` | 5.6 |
| `terminal.ansiBrightYellow` | `#724E00` | `#8E6408` | 4.6 |
| `terminal.ansiBrightBlue` | `#0050B0` | `#0E5CCC` | 5.1 |
| `terminal.ansiBrightMagenta` | `#6822C0` | `#8832BA` | 4.8 |
| `terminal.ansiBrightCyan` | `#006474` | `#0B6B80` | 5.3 |
| `terminal.ansiBrightWhite` | `#484440` | `#3A3632` | 9.4 |
| `terminal.background`, `terminalCursor`, `selectionBackground` | (unchanged) | — | — |

If any `bright*` scrapes below 4.5 on the actual check, darken one notch.

## D. Critical files to modify

**Source of truth (both variants)**
- `/Users/harsh/Developer/terracotta-theme/themes/terracotta-light.json` — `colors` block decoration-bleed + `tokenColors` + `semanticTokenColors` + terminal ANSI.
- `/Users/harsh/Developer/terracotta-theme/themes/terracotta-light-bright.json` — full overhaul (surfaces + syntax + terminal ANSI + decoration bleed).

**Doc / demo sync (enforced by `scripts/check-doc-sync.js`)** — every updated syntax hex must mirror into:
- `/Users/harsh/Developer/terracotta-theme/README.md` — both "Terracotta Light" and "Terracotta Light Bright" table rows (Background, Foreground, Accent, Keywords, Functions, Strings, Types, Numbers, Operators).
- `/Users/harsh/Developer/terracotta-theme/docs/index.html` — `THEMES["Light"]` and `THEMES["Light Bright"]` objects.
- `/Users/harsh/Developer/terracotta-theme/examples/THEME-DEMO.html` — same `THEMES["Light"]` + `THEMES["Light Bright"]` shape.
- `/Users/harsh/Developer/terracotta-theme/examples/screenshot-gen.html` — `[data-theme="light"]` and `[data-theme="light-bright"]` blocks.
- `/Users/harsh/Developer/terracotta-theme/examples/theme-analysis.html` — CSS vars under `[data-theme="light"]` AND `[data-theme="light-bright"]` + narrative in `#findings-light` and `#findings-light-bright`.

**Release plumbing**
- `/Users/harsh/Developer/terracotta-theme/package.json` — `1.9.15` → `1.10.0`.
- `/Users/harsh/Developer/terracotta-theme/CHANGELOG.md` — new top entry (draft in §H).
- `/Users/harsh/Developer/terracotta-theme/screenshots/screenshot-light.png` AND `screenshot-light-bright.png` — regenerate via `npm run screenshots`.

## E. Existing scripts / utilities to reuse

- `scripts/check-contrast.js` — Tier 1 (7:1) / Tier 2 (4.5:1) guardrails.
- `scripts/check-terminal-palette.js` — ANSI AA + lane rules (e.g. "tag attribute ≠ strings", "user constants ≠ numbers").
- `scripts/check-palette-spacing.js` — core-pair / targeted-pair / light-vs-bright drift + surface spacing.
- `scripts/check-doc-sync.js` — README / docs / examples mirror check.
- `scripts/screenshot.js` (via `npm run screenshots`).
- `examples/theme-analysis.html` — primary multi-surface regression harness (per `CLAUDE.md`).

No new scripts needed.

## F. Execution order

1. **Pre-flight**: `npm test` on current `main` to capture baseline (confirms current files pass; reveals `button.background` accent posture).
2. Edit `themes/terracotta-light-bright.json` — surfaces A1 + syntax B + terminal C1 + decoration bleed.
3. Edit `themes/terracotta-light.json` — syntax B + terminal C2 + decoration bleed. No surface changes.
4. `node scripts/check-contrast.js` — iterate.
5. `node scripts/check-terminal-palette.js` — iterate.
6. `node scripts/check-palette-spacing.js` — iterate. Most likely regressions: `function` drift, `variable` drift, or `button.background` accent drift.
7. Update docs in lockstep for BOTH variants: `README.md`, `docs/index.html`, `examples/THEME-DEMO.html`, `examples/screenshot-gen.html`, `examples/theme-analysis.html`.
8. `npm test` — must pass green.
9. Bump `package.json` → `1.10.0`. Append `CHANGELOG.md` entry.
10. `npm run screenshots` — regenerate both `screenshot-light.png` and `screenshot-light-bright.png`; commit PNGs.
11. Manual verification (§G).

## G. Verification

**Automated** — `npm test` clean.

**Manual visual review in VS Code** (`code --extensionDevelopmentPath=.`) — run the checklist under BOTH Light and Light Bright:
- Open each showcase: `examples/ReactShowcase.tsx`, `PythonShowcase.py`, `GoShowcase.go`, `JavaShowcase.java`, `ShellShowcase.sh`, `GraphQLShowcase.graphql`, `DockerfileShowcase`, `config-showcase.yaml`, `config-showcase.toml`.
- Per-file checklist (each variant):
  - [ ] Variables (purple) visually distinct from keywords (rust) on adjacent lines.
  - [ ] Parameters (warm rust) differ from keywords by L*.
  - [ ] Comments (warm taupe) quiet but legible.
  - [ ] Strings (amber) pop.
  - [ ] Function calls (forest green) differ from CSS property green.
  - [ ] Types differ from operator navy (Light: purple vs navy; Bright: ultramarine vs navy).
  - [ ] Decorator violet is clearly not regex pink.
  - [ ] This/self merges into parameter lane (intentional).
  - [ ] Git decorations in sidebar tree still read.
  - [ ] Selection `#D8744E42`/`#D8744E28` reads as warm orange.
  - [ ] Active tab continuous with editor; inactive tabs recess cleanly.

**Side-by-side mood test**: open the same file in Light and Light Bright. They must feel **clearly different** — Light = warm editorial parchment, Light Bright = crisp modern daylight. Both unmistakably Terracotta via orange accent + rust keywords.

**Full-screen terminal** (the user's explicit complaint): maximize integrated terminal in each variant. Run `ls --color`, `git status`, `git log --oneline --graph --decorate -20`, a Python REPL, a colorized log stream. Red / green / yellow / blue / magenta / cyan must all be distinctly vibrant. No pastel wash.

**Browser harness**: open `examples/theme-analysis.html` and page through each surface with `data-theme="light"` then `data-theme="light-bright"`. Open `docs/index.html` and `examples/THEME-DEMO.html`; both Light and Light Bright previews must match VS Code rendering.

**Regenerated screenshots** — `screenshots/screenshot-light.png` and `screenshot-light-bright.png` reflect the new direction before committing.

**Full-day usability check** — run Light Bright for a real coding session before publishing. If `#FAFAFA` feels harsh under your lighting, `#F7F7F5` is a slightly softer drop-in (same identity, ~1-point lower luminance, microscopic warm hint) — it doesn't require any other hex changes; all contrast ratios drift under 0.1.

## H. CHANGELOG direction

```
## 1.10.0

### Terracotta Light + Light Bright — dual identity rework
- Reworked Light Bright from an icy cool-grey scheme into a crisp
  neutral daylight identity. Editor surface moves to pure neutral
  #FAFAFA with near-neutral #F0EEEA chrome; Terracotta identity is
  carried by the hero accent (#D8744E) and warm keyword rust.
- Preserved Light's warm parchment surfaces (unchanged) but rebuilt
  its syntax palette to eliminate the muddy taupe/mauve/olive cluster
  it shared with Light Bright.
- Across both variants, variables move to saturated purple,
  parameters to warm rust, decorators to violet, regex to clear pink,
  types to stronger blue/purple, and functions to warmer forest green.
  Accent hexes differ intentionally between the variants so each keeps
  its own mood and passes the light-vs-bright drift checks.
- Overhauled the terminal ANSI palette in both variants for
  GitHub-Light-grade saturation. Full-screen terminal work is no
  longer washed out on either.
- All tokens continue to clear Tier 1 AAA (≥7:1) or Tier 2 AA (≥4.5:1)
  per the contrast checker.
```
