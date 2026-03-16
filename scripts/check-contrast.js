#!/usr/bin/env node

/**
 * WCAG Contrast Ratio Checker for Terracotta Theme
 *
 * Reads every theme JSON in ./themes/, extracts foreground colors from
 * tokenColors and semanticTokenColors, and checks each one against the
 * editor.background for WCAG 2.1 AA compliance (≥ 4.5:1).
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

// ── Main ─────────────────────────────────────────────────────────────

const THRESHOLD = 4.5;
const themesDir = path.resolve(__dirname, "..", "themes");

const themeFiles = fs
  .readdirSync(themesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (themeFiles.length === 0) {
  console.error("❌ No theme JSON files found in", themesDir);
  process.exit(1);
}

let totalChecks = 0;
let totalFailures = 0;
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
  const bgLabel = `editor.background (${bgHex})`;

  // Gather all foreground colors to check
  const colorEntries = [
    ...extractTokenColors(theme.tokenColors),
    ...extractSemanticTokenColors(theme.semanticTokenColors),
  ];

  // Deduplicate by color value to keep output clean
  const seen = new Set();
  const unique = colorEntries.filter((e) => {
    const key = `${e.color}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n━━━ ${file} ━━━  (bg: ${bgHex}, ${unique.length} colors)`);

  for (const { label, color } of unique) {
    const [r, g, b, a] = parseHex(color);

    // Skip semi-transparent colors — contrast depends on composited result
    if (a < 255) {
      console.log(`   SKIP  ${color}  ${label} (alpha < 1.0)`);
      continue;
    }

    const ratio = contrastRatio([r, g, b], [bgR, bgG, bgB]);
    totalChecks++;

    if (ratio < THRESHOLD) {
      totalFailures++;
      failures.push({ file, label, color, bgHex, ratio });
      console.log(
        `   FAIL  ${color}  ${ratio.toFixed(2)}:1  ${label}`
      );
    } else {
      console.log(
        `   PASS  ${color}  ${ratio.toFixed(2)}:1  ${label}`
      );
    }
  }
}

// ── Summary ──────────────────────────────────────────────────────────

console.log(`\n${"═".repeat(60)}`);
console.log(`Checked ${totalChecks} color pairs across ${themeFiles.length} themes.`);

if (totalFailures > 0) {
  console.log(
    `\n❌ ${totalFailures} FAILURE${totalFailures > 1 ? "S" : ""} (below ${THRESHOLD}:1):\n`
  );
  for (const f of failures) {
    console.log(
      `  ${f.file}: ${f.color} (${f.label}) vs ${f.bgHex} → ${f.ratio.toFixed(2)}:1`
    );
  }
  process.exit(1);
} else {
  console.log(`\n✅ All colors meet WCAG AA ${THRESHOLD}:1 contrast ratio.`);
  process.exit(0);
}
