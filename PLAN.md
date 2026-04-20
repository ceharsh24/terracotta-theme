# Terracotta Light Bright — Bug Fix Plan

## Problem Statement

The Terracotta Light Bright theme (v1.10.3) has several visual bugs that degrade usability for daily coding. The most impactful issues are: invisible command palette selection, low contrast between major syntax roles, surfaces that blend together, and a Markdown blockquote/operator collision. Both Light variants share some bugs (decorator=regex collision), so fixes should cover both where applicable.

## Bugs Found

### Critical — Things That Don't Work

**Bug 1: Command palette selection is invisible**
- `quickInputList.focusBackground` (`#F3F0EA`) differs from `quickInput.background` (`#F3F1ED`) by only 0–3 pixel values per channel — contrast ratio 1.01:1
- The selected item in Cmd+Shift+P is literally indistinguishable from unselected items
- Dark theme achieves 1.30:1 focus contrast — Light Bright needs comparable or better
- Files: `terracotta-light-bright.json` → `quickInputList.focusBackground`
- Fix: Use `#E8E0D6` or similar (warm mid-tone with visible step-down from palette bg)
- Also affects: `list.activeSelectionBackground` (`#D8744E42` at 26% alpha is very faint), `list.focusBackground` (`#D8744E36`), `list.hoverBackground` (`#D8744E22`), `menu.selectionBackground` (`#F3F0EA` — same nearly-invisible issue), `editorSuggestWidget.selectedBackground` (`#EDEAE4`)
- Light variant status: Light has same issue (1.06:1 contrast) — fix both

**Bug 2: Markdown blockquotes use operator color**
- Markdown quote (`#14539E`) = Keyword operator (`#14539E`) — exact same hex
- Blockquoted text is visually identical to operator symbols
- All 4 other variants use distinct blockquote colors (Dark uses warm grey, Light uses earth brown `#6B523A`)
- Also affects: `Markdown separator` uses the same `#14539E`
- Files: `terracotta-light-bright.json` → tokenColors "Markdown quote" and "Markdown separator"
- Fix: Use an earth/warm tone distinct from operator blue (e.g., `#6E5A3A` — warm brown similar to Light's approach but lighter for LB's brighter bg)

### High — Significant Visual Confusion

**Bug 3: Surfaces blend together (sidebar/panel/editor)**
- Editor (`#FAFAFA`, L=0.956) vs Panel (`#F3F1ED`, L=0.881) = ratio 1.08 — nearly indistinguishable
- Editor vs Sidebar (`#E4E1DC`, L=0.755) = ratio 1.25 — better but still low
- Panel vs Sidebar = ratio 1.16
- Tree indent guides (`#D9D2C8` on `#E4E1DC`) = ratio 1.15 — invisible
- Activity bar inactive icons at 4.12:1 — below AA
- THEME_DOCTRINE: "Editor, sidebar, panel, and tabs must be visibly distinct in every variant"
- Files: `terracotta-light-bright.json` → `panel.background`, various surface colors, `tree.indentGuidesStroke`, `activityBar.inactiveForeground`
- Fix: Darken panel to `#EDEAE4` or similar; darken tree indent guides; strengthen activity bar inactive icons

**Bug 4: Inherited class ≈ Function (ΔE 5.8)**
- Inherited class (`#0E6B56`, teal-green) vs Function (`#0F5F46`, teal-green) — both deep teal
- In OOP code (Java, TypeScript), extended classes look identical to function calls
- All other variants use distinct color families: Dark = salmon vs teal, Light = purple vs green
- Light Bright uniquely collapses these two semantic roles
- Files: `terracotta-light-bright.json` → tokenColors "Inherited class", semanticTokenColors
- Fix: Move inherited class to a different hue. Options: use the interface/type blue family (e.g., `#275BAA` italic) or a distinct purple (e.g., `#3E3F94` to match Light's approach)

**Bug 5: Interface ≈ Operator (ΔE 4.1)**
- Interface (`#275BAA`) vs Operator (`#14539E`) — both medium blue
- In TypeScript/Java where interfaces appear near operators, they're near-indistinguishable
- Light has the same Interface color but a darker operator (`#124878`), providing slightly more distance
- Files: `terracotta-light-bright.json` → tokenColors "Interface", semanticTokenColors `interface`
- Fix: Shift interface to a purple-blue (e.g., `#4A42C4` to align with the type/namespace lane) or darken the operator

**Bug 6: Java import keyword too prominent**
- Import/export uses keyword color `#8E351C` — same as all keywords
- At 7.52:1 on `#FAFAFA`, the bold rust-red is visually dominant
- Java files with many imports become visually heavy at the top
- Files: `terracotta-light-bright.json` → tokenColors "Import/Export"
- Fix: Give import/export a softer variant of the keyword lane (e.g., `#9A572A` — the H3-H4 heading color, still in the terracotta family but less saturated) or add `fontStyle: ""` to remove any inherited boldness

### Medium — Noticeable but Livable

**Bug 7: User constants ≈ Parameters (ΔE 4.7)**
- User constants (`#6E4A14`) vs Parameters (`#70521E`) — both warm brown
- Constants and parameters in the same function are hard to tell apart
- Files: `terracotta-light-bright.json` → tokenColors "User constants", semanticTokenColors
- Fix: Shift user constants toward amber (e.g., `#7A5A00`) to create hue distance from parameter brown

**Bug 8: Language-specific decorators = Regex (#B24D8A)**
- Python decorators, Java annotations, Rust attributes all use `#B24D8A` (regex pink)
- General "Decorator / Annotation" scope uses `#7A3AA0` (purple)
- Semantic `decorator` token uses `#7A3AA0` — inconsistent with TextMate scopes
- Causes color flash as semantic tokens load (pink → purple)
- Exists in both Light and Light Bright
- Files: both `terracotta-light-bright.json` and `terracotta-light.json` → tokenColors "Python decorator", "Java annotation", "Rust attribute"
- Fix: Change all three language-specific scopes to use the general decorator color (`#7A3AA0` in LB, `#6A2E90` in Light)

**Bug 9: Doc comments barely passing at 4.62:1**
- Doc comment `#6A7568` against `#FAFAFA` = 4.62:1 (AA minimum is 4.5:1)
- Only 0.12 ratio points of headroom — any monitor calibration variance could make them unreadable
- Files: `terracotta-light-bright.json` → tokenColors "Doc comments"
- Fix: Darken slightly to `#5E6A5C` or similar for ~5.3:1 ratio

### Low Priority — Polish

**Bug 10: Comment ≈ Punctuation (ΔE 6.7)**
- Comments (`#605E5A`) vs Punctuation (`#6E6458`) — both neutral grey-brown
- At small font sizes, these can look similar
- Files: `terracotta-light-bright.json` → tokenColors "Comments" and/or "Punctuation"
- Fix: Push punctuation slightly cooler (e.g., `#686870` — adding a blue tint for separation)

**Bug 11: Property lane split (tag attrs vs config keys)**
- JSON/YAML/TOML keys use teal (`#196878`) but tag attributes use green (`#386E1F`)
- THEME_DOCTRINE says properties/attributes/keys should share the same lane
- Dark themes unify them; Light splits them differently
- Files: `terracotta-light-bright.json` → tokenColors for tag attribute and JSON/YAML/TOML keys
- Fix: Align to one color for the property lane, or document the intentional split

## Implementation Notes

### Files to modify
- `themes/terracotta-light-bright.json` — primary target (all bugs)
- `themes/terracotta-light.json` — Bug 1 (cmd palette), Bug 8 (decorator/regex), and optionally others
- `README.md`, `docs/index.html`, `examples/THEME-DEMO.html`, `examples/screenshot-gen.html`, `examples/theme-analysis.html` — doc sync (enforced by `check-doc-sync.js`)

### Decoration bleed
When changing any syntax hex, grep the entire theme file for that hex — it's often reused in `colors` block for bracket highlights, bracket-pair guides, debug token values, charts, and alpha-blended variants (e.g., `#0E6B5620` for bracket guides).

### Validation
1. `npm test` — must pass (contrast, terminal palette, palette spacing, doc sync)
2. Manual check in VS Code: `code --extensionDevelopmentPath=.`
3. Screenshots: `npm run screenshots`

### Execution order
1. Fix critical bugs first (Cmd palette, blockquote)
2. Fix surface contrast (panel/sidebar separation)
3. Fix syntax collisions (inherited class, interface, user constants)
4. Fix decorator/regex mismatch (both variants)
5. Polish (doc comments, punctuation, import brightness)
6. Run `npm test`, iterate until green
7. Sync docs (`README.md`, `docs/`, `examples/`)
8. Final `npm test`
9. Update `CHANGELOG.md`, bump version
10. Regenerate screenshots: `npm run screenshots`

## Summary of Fixes

| Bug | Current | Proposed Fix | Affects |
|-----|---------|-------------|---------|
| Cmd palette invisible | `#F3F0EA` focus on `#F3F1ED` (1.01:1) | Darken to ~`#E8E0D6` | LB + Light |
| Blockquote = operator | Both `#14539E` | Use `#6E5A3A` for blockquotes | LB only |
| Panel ≈ editor | `#F3F1ED` (1.08:1 from editor) | Darken panel to `#EDEAE4` | LB only |
| Inherited class ≈ func | `#0E6B56` vs `#0F5F46` (ΔE 5.8) | Move inherited to `#3E3F94` | LB only |
| Interface ≈ operator | `#275BAA` vs `#14539E` (ΔE 4.1) | Shift interface to `#4A42C4` | LB only |
| Import too prominent | `#8E351C` (7.52:1) | Use `#9A572A` | LB only |
| Constants ≈ params | `#6E4A14` vs `#70521E` (ΔE 4.7) | Shift constants to `#7A5A00` | LB only |
| Decorators = regex | `#B24D8A` for both | Use decorator color (`#7A3AA0`) | LB + Light |
| Doc comments thin | 4.62:1 | Darken to ~`#5E6A5C` (5.3:1) | LB only |
| Comment ≈ punctuation | ΔE 6.7 | Push punctuation cooler | LB only |
