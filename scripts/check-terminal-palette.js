#!/usr/bin/env node

/**
 * Terminal palette and token-lane regression checker for Terracotta Theme.
 *
 * Validates:
 * - terminal ANSI colors maintain AA contrast against terminal.background
 * - Tag attribute does not equal Strings
 * - User constants does not equal Numbers
 * - property.declaration matches property when defined
 *
 * Exit code 0 = all pass, 1 = at least one failure.
 */

const fs = require("fs");
const path = require("path");

function parseHex(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fgHex, bgHex) {
  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);
  const l1 = relativeLuminance(...fg);
  const l2 = relativeLuminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getNamedToken(theme, name) {
  const rule = (theme.tokenColors || []).find((entry) => entry.name === name);
  return rule?.settings?.foreground || null;
}

const THEMES_DIR = path.resolve(__dirname, "..", "themes");
const ANSI_KEYS = [
  "terminal.ansiBlack",
  "terminal.ansiRed",
  "terminal.ansiGreen",
  "terminal.ansiYellow",
  "terminal.ansiBlue",
  "terminal.ansiMagenta",
  "terminal.ansiCyan",
  "terminal.ansiWhite",
  "terminal.ansiBrightBlack",
  "terminal.ansiBrightRed",
  "terminal.ansiBrightGreen",
  "terminal.ansiBrightYellow",
  "terminal.ansiBrightBlue",
  "terminal.ansiBrightMagenta",
  "terminal.ansiBrightCyan",
  "terminal.ansiBrightWhite",
];

const themeFiles = fs
  .readdirSync(THEMES_DIR)
  .filter((file) => file.endsWith(".json"))
  .sort();

let terminalChecks = 0;
let failures = 0;
const errors = [];

for (const file of themeFiles) {
  const theme = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, file), "utf8"));
  const bg = theme.colors?.["terminal.background"] || theme.colors?.["editor.background"];

  if (!bg) {
    errors.push(`${file}: missing terminal.background/editor.background`);
    failures += 1;
    continue;
  }

  console.log(`\n━━━ ${file} ━━━  (terminal bg: ${bg})`);

  for (const key of ANSI_KEYS) {
    const color = theme.colors?.[key];
    if (!color) {
      errors.push(`${file}: missing ${key}`);
      failures += 1;
      continue;
    }

    const ratio = contrastRatio(color, bg);
    const shortKey = key.replace("terminal.", "");

    if (key === "terminal.ansiBlack") {
      console.log(`   INFO  ${color}  ${ratio.toFixed(2)}:1  ${shortKey} (exempt base black)`);
      continue;
    }

    if (key === "terminal.ansiBrightBlack") {
      console.log(`   INFO  ${color}  ${ratio.toFixed(2)}:1  ${shortKey} (informational)`);
      continue;
    }

    terminalChecks += 1;
    if (ratio < 4.5) {
      console.log(`   FAIL  ${color}  ${ratio.toFixed(2)}:1  ${shortKey}`);
      errors.push(`${file}: ${shortKey} contrast ${ratio.toFixed(2)}:1 is below 4.5:1`);
      failures += 1;
    } else {
      console.log(`   PASS  ${color}  ${ratio.toFixed(2)}:1  ${shortKey}`);
    }
  }

  const strings = getNamedToken(theme, "Strings");
  const attributes = getNamedToken(theme, "Tag attribute");
  const numbers = getNamedToken(theme, "Numbers");
  const userConstants = getNamedToken(theme, "User constants");
  const property = theme.semanticTokenColors?.property;
  const propertyDecl = theme.semanticTokenColors?.["property.declaration"];

  if (strings && attributes && strings.toUpperCase() === attributes.toUpperCase()) {
    errors.push(`${file}: Tag attribute matches Strings (${strings})`);
    failures += 1;
  }

  if (numbers && userConstants && numbers.toUpperCase() === userConstants.toUpperCase()) {
    errors.push(`${file}: User constants matches Numbers (${numbers})`);
    failures += 1;
  }

  if (
    typeof propertyDecl === "string" &&
    typeof property === "string" &&
    propertyDecl.toUpperCase() !== property.toUpperCase()
  ) {
    errors.push(`${file}: property.declaration (${propertyDecl}) does not match property (${property})`);
    failures += 1;
  }
}

console.log("\n════════════════════════════════════════════════════════════");
console.log(`Terminal ANSI: ${terminalChecks} colors checked (AA 4.5:1, excluding black + brightBlack)`);

if (errors.length > 0) {
  console.error("\n❌ Terminal palette regressions detected:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("\n✅ Terminal ANSI colors and token lanes pass the regression checks.");
