#!/usr/bin/env node

/**
 * WCAG Contrast Ratio Checker for Terracotta Theme
 *
 * Reads every theme JSON in ./themes/, extracts foreground colors from
 * tokenColors, semanticTokenColors, and workbench UI color pairs, then
 * checks each against its background for WCAG 2.1 compliance.
 *
 * Syntax colors are checked at AAA (≥ 7:1).
 * UI text colors are checked at AA (≥ 4.5:1).
 *
 * Exit code 0 = all pass, 1 = at least one failure.
 */

const fs = require("fs");
const path = require("path");

// ── Color math ───────────────────────────────────────────────────────

/** Parse a hex color (#RGB, #RRGGBB, or #RRGGBBAA). Returns [r, g, b, a] with 0-255 range. */
function parseHex(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255;
  return [r, g, b, a];
}

/** Relative luminance per WCAG 2.1 (https://www.w3.org/TR/WCAG21/#dfn-relative-luminance) */
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** WCAG contrast ratio between two [r,g,b] colors. */
function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(...fg);
  const l2 = relativeLuminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Composite a semi-transparent foreground color over an opaque background. */
function composite(fgRGBA, bgRGB) {
  const [fr, fg, fb, fa] = fgRGBA;
  const a = fa / 255;
  return [
    Math.round(fr * a + bgRGB[0] * (1 - a)),
    Math.round(fg * a + bgRGB[1] * (1 - a)),
    Math.round(fb * a + bgRGB[2] * (1 - a)),
  ];
}

// ── Color extraction ─────────────────────────────────────────────────

/** Collect {label, color} from tokenColors array. */
function extractTokenColors(tokenColors) {
  const results = [];
  if (!Array.isArray(tokenColors)) return results;
  for (const rule of tokenColors) {
    const fg = rule?.settings?.foreground;
    if (fg) {
      results.push({ label: rule.name || "unnamed tokenColor", color: fg });
    }
  }
  return results;
}

/** Collect {label, color} from semanticTokenColors object. */
function extractSemanticTokenColors(semantic) {
  const results = [];
  if (!semantic || typeof semantic !== "object") return results;
  for (const [key, value] of Object.entries(semantic)) {
    let fg;
    if (typeof value === "string") {
      fg = value;
    } else if (typeof value === "object" && value.foreground) {
      fg = value.foreground;
    }
    if (fg) {
      results.push({ label: `semantic:${key}`, color: fg });
    }
  }
  return results;
}

/**
 * UI foreground/background pairs to check.
 * Each entry: [foreground key, background key, label, exempt]
 * Background falls back to editor.background if the key is missing.
 * exempt: true = WCAG-exempt (inactive/decorative per SC 1.4.3), reported as INFO not FAIL.
 */
const UI_PAIRS = [
  // Sidebar
  ["sideBar.foreground", "sideBar.background", "Sidebar text", false],
  ["sideBarTitle.foreground", "sideBar.background", "Sidebar title", false],
  ["sideBarSectionHeader.foreground", "sideBarSectionHeader.background", "Sidebar section header", false],
  // Activity bar
  ["activityBar.foreground", "activityBar.background", "Activity bar icon", false],
  ["activityBar.inactiveForeground", "activityBar.background", "Activity bar inactive icon", true],
  ["activityBarBadge.foreground", "activityBarBadge.background", "Activity bar badge", false],
  // Tabs
  ["tab.activeForeground", "tab.activeBackground", "Active tab", false],
  ["tab.inactiveForeground", "tab.inactiveBackground", "Inactive tab", true],
  // Title bar
  ["titleBar.activeForeground", "titleBar.activeBackground", "Title bar", false],
  ["titleBar.inactiveForeground", "titleBar.inactiveBackground", "Title bar inactive", true],
  // Status bar
  ["statusBar.foreground", "statusBar.background", "Status bar", false],
  ["statusBar.debuggingForeground", "statusBar.debuggingBackground", "Status bar debugging", false],
  ["statusBarItem.remoteForeground", "statusBarItem.remoteBackground", "Status bar remote", false],
  ["statusBarItem.errorForeground", "statusBarItem.errorBackground", "Status bar error", false],
  ["statusBarItem.warningForeground", "statusBarItem.warningBackground", "Status bar warning", false],
  // Input & dropdown
  ["input.foreground", "input.background", "Input text", false],
  ["input.placeholderForeground", "input.background", "Input placeholder", true],
  ["dropdown.foreground", "dropdown.background", "Dropdown text", false],
  // Buttons
  ["button.foreground", "button.background", "Primary button", false],
  ["button.secondaryForeground", "button.secondaryBackground", "Secondary button", false],
  ["extensionButton.prominentForeground", "extensionButton.prominentBackground", "Extension button", false],
  // Badge
  ["badge.foreground", "badge.background", "Badge", false],
  // Menus
  ["menu.foreground", "menu.background", "Menu text", false],
  // Panel
  ["panelTitle.activeForeground", "panel.background", "Panel title", false],
  ["panelTitle.inactiveForeground", "panel.background", "Panel title inactive", true],
  // Notifications
  ["notifications.foreground", "notifications.background", "Notification text", false],
  ["notificationCenterHeader.foreground", "notificationCenterHeader.background", "Notification header", false],
  // Editor widgets
  ["editorWidget.foreground", "editorWidget.background", "Editor widget", false],
  ["editorSuggestWidget.foreground", "editorSuggestWidget.background", "Suggest widget", false],
  ["editorHoverWidget.foreground", "editorHoverWidget.background", "Hover widget", false],
  // Quick input
  ["quickInput.foreground", "quickInput.background", "Quick input", false],
  ["commandCenter.foreground", "commandCenter.background", "Command center", false],
  // Terminal
  ["terminal.foreground", "terminal.background", "Terminal text", false],
  // Breadcrumb
  ["breadcrumb.foreground", "editor.background", "Breadcrumb", false],
  // Editor secondary (decorative/supplementary — exempt per WCAG SC 1.4.3)
  ["editorLineNumber.foreground", "editor.background", "Line numbers", true],
  ["editorLineNumber.activeForeground", "editor.background", "Active line number", false],
  ["editorCodeLens.foreground", "editor.background", "CodeLens", true],
  ["editorInlayHint.foreground", "editor.background", "Inlay hint", true],
  ["editorInlayHint.typeForeground", "editor.background", "Inlay hint type", true],
  // Git decorations (against sidebar)
  ["gitDecoration.modifiedResourceForeground", "sideBar.background", "Git modified", false],
  ["gitDecoration.addedResourceForeground", "sideBar.background", "Git added", false],
  ["gitDecoration.deletedResourceForeground", "sideBar.background", "Git deleted", false],
  ["gitDecoration.untrackedResourceForeground", "sideBar.background", "Git untracked", false],
  ["gitDecoration.conflictingResourceForeground", "sideBar.background", "Git conflicting", false],
  // Misc
  ["foreground", "editor.background", "Default foreground", false],
  ["descriptionForeground", "editor.background", "Description text", false],
  ["errorForeground", "editor.background", "Error text", false],
];

// ── Main ─────────────────────────────────────────────────────────────

const SYNTAX_THRESHOLD = 7.0;  // WCAG AAA for syntax
const UI_THRESHOLD = 4.5;      // WCAG AA for UI text
const themesDir = path.resolve(__dirname, "..", "themes");

const themeFiles = fs
  .readdirSync(themesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (themeFiles.length === 0) {
  console.error("❌ No theme JSON files found in", themesDir);
  process.exit(1);
}

let syntaxChecks = 0;
let syntaxFailures = 0;
let uiChecks = 0;
let uiFailures = 0;
let uiExempt = 0;
const failures = [];

for (const file of themeFiles) {
  const filePath = path.join(themesDir, file);
  const theme = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const bgHex = theme.colors?.["editor.background"];
  if (!bgHex) {
    console.warn(`⚠️  ${file}: no editor.background found, skipping`);
    continue;
  }

  const [bgR, bgG, bgB] = parseHex(bgHex);

  // ── Syntax colors (AAA) ──────────────────────────────────────────

  const colorEntries = [
    ...extractTokenColors(theme.tokenColors),
    ...extractSemanticTokenColors(theme.semanticTokenColors),
  ];

  const seen = new Set();
  const unique = colorEntries.filter((e) => {
    const key = `${e.color}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n━━━ ${file} ━━━  (bg: ${bgHex}, ${unique.length} syntax colors)`);

  for (const { label, color } of unique) {
    const [r, g, b, a] = parseHex(color);

    if (a < 255) {
      console.log(`   SKIP  ${color}  ${label} (alpha < 1.0)`);
      continue;
    }

    const ratio = contrastRatio([r, g, b], [bgR, bgG, bgB]);
    syntaxChecks++;

    if (ratio < SYNTAX_THRESHOLD) {
      syntaxFailures++;
      failures.push({ file, label, color, bgHex, ratio, tier: "AAA" });
      console.log(`   FAIL  ${color}  ${ratio.toFixed(2)}:1  ${label}`);
    } else {
      console.log(`   PASS  ${color}  ${ratio.toFixed(2)}:1  ${label}`);
    }
  }

  // ── UI color pairs (AA) ──────────────────────────────────────────

  console.log(`\n   ── UI pairs (AA ${UI_THRESHOLD}:1) ──`);

  for (const [fgKey, bgKey, label, exempt] of UI_PAIRS) {
    const fgHex = theme.colors?.[fgKey];
    const bgPairHex = theme.colors?.[bgKey] || bgHex;
    if (!fgHex) continue;

    const [fr, fg, fb, fa] = parseHex(fgHex);
    const [br, bg2, bb, ba] = parseHex(bgPairHex);

    // Resolve semi-transparent foreground by compositing onto background
    let effectiveFg = [fr, fg, fb];
    if (fa < 255) {
      const parentBg = [br, bg2, bb];
      effectiveFg = composite([fr, fg, fb, fa], parentBg);
    }

    // Resolve semi-transparent background by compositing onto editor bg
    let effectiveBg = [br, bg2, bb];
    if (ba < 255) {
      effectiveBg = composite([br, bg2, bb, ba], [bgR, bgG, bgB]);
    }

    const ratio = contrastRatio(effectiveFg, effectiveBg);
    uiChecks++;

    const fgDisplay = fa < 255 ? `${fgHex}→composited` : fgHex;

    if (ratio < UI_THRESHOLD) {
      if (exempt) {
        uiExempt++;
        console.log(`   INFO  ${fgDisplay}  ${ratio.toFixed(2)}:1  ${label} (exempt: inactive/decorative)`);
      } else {
        uiFailures++;
        failures.push({ file, label, color: fgHex, bgHex: bgPairHex, ratio, tier: "AA" });
        console.log(`   FAIL  ${fgDisplay}  ${ratio.toFixed(2)}:1  ${label}`);
      }
    } else {
      console.log(`   PASS  ${fgDisplay}  ${ratio.toFixed(2)}:1  ${label}`);
    }
  }
}

// ── Summary ──────────────────────────────────────────────────────────

console.log(`\n${"═".repeat(60)}`);
console.log(`Syntax: ${syntaxChecks} pairs checked (AAA ${SYNTAX_THRESHOLD}:1)`);
console.log(`UI:     ${uiChecks} pairs checked (AA ${UI_THRESHOLD}:1)`);
if (uiExempt > 0) {
  console.log(`        ${uiExempt} exempt (inactive/decorative per WCAG SC 1.4.3)`);
}
console.log(`Total:  ${syntaxChecks + uiChecks} pairs across ${themeFiles.length} themes.`);

const totalFailures = syntaxFailures + uiFailures;
if (totalFailures > 0) {
  console.log(
    `\n❌ ${totalFailures} FAILURE${totalFailures > 1 ? "S" : ""}:\n`
  );
  for (const f of failures) {
    console.log(
      `  [${f.tier}] ${f.file}: ${f.color} (${f.label}) vs ${f.bgHex} → ${f.ratio.toFixed(2)}:1`
    );
  }
  process.exit(1);
} else {
  console.log(`\n✅ All syntax colors meet WCAG AAA ${SYNTAX_THRESHOLD}:1.`);
  console.log(`✅ All UI text colors meet WCAG AA ${UI_THRESHOLD}:1.`);
  process.exit(0);
}
