#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const THEMES = {
  light: "terracotta-light.json",
  "light-bright": "terracotta-light-bright.json",
};

const CORE_ROLES = [
  "comment",
  "keyword",
  "operator",
  "function",
  "type",
  "string",
  "number",
  "variable",
  "property",
];

const TARGETED_PAIRS = [
  ["comment", "operator"],
  ["comment", "variable"],
  ["operator", "variable"],
  ["keyword", "parameter"],
  ["keyword", "decorator"],
  ["parameter", "decorator"],
];

const SAME_ROLE_DRIFT_MIN = {
  bg: 5,
  accent: 10,
};

const SURFACE_SPACING_MIN = {
  "sideBar.background": 4,
  "panel.background": 2.5,
  "tab.activeBackground": 2,
};

const MIN_CORE_DELTA = 18;
const MIN_TARGETED_DELTA = 18;
const MIN_AVERAGE_SYNTAX_DRIFT = 7;
const MIN_SYNTAX_ROLE_DRIFT = 6;
const MIN_DISTINCT_SYNTAX_ROLES = 6;

function normalizeHex(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0].toUpperCase() : null;
}

function extractForeground(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && value.foreground) return value.foreground;
  return null;
}

function extractNamedToken(theme, name) {
  return (theme.tokenColors || []).find((entry) => entry.name === name)?.settings?.foreground || null;
}

function hexToRgb(hex) {
  const value = normalizeHex(hex)?.slice(1);
  if (!value) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
}

function rgbToLab(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  );

  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.072175) / 1.0;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;

  const transform = (value) =>
    value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116;

  const fx = transform(x);
  const fy = transform(y);
  const fz = transform(z);

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function deltaE(hexA, hexB) {
  const [l1, a1, b1] = rgbToLab(hexA);
  const [l2, a2, b2] = rgbToLab(hexB);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

function loadTheme(themeId) {
  const theme = JSON.parse(
    fs.readFileSync(path.join(ROOT, "themes", THEMES[themeId]), "utf8")
  );
  const colors = theme.colors || {};
  const semantic = theme.semanticTokenColors || {};

  return {
    colors,
    palette: {
      bg: normalizeHex(colors["editor.background"]),
      accent: normalizeHex(colors["button.background"]),
      comment: normalizeHex(extractForeground(semantic.comment)),
      keyword: normalizeHex(extractForeground(semantic.keyword)),
      operator: normalizeHex(extractForeground(semantic.operator)),
      function: normalizeHex(extractForeground(semantic.function)),
      type: normalizeHex(extractForeground(semantic.type)),
      string: normalizeHex(extractForeground(semantic.string)),
      number: normalizeHex(extractForeground(semantic.number)),
      variable: normalizeHex(extractForeground(semantic.variable)),
      property: normalizeHex(extractForeground(semantic.property)),
      parameter: normalizeHex(extractForeground(semantic.parameter)),
      decorator: normalizeHex(extractForeground(semantic.decorator)),
      tag: normalizeHex(extractNamedToken(theme, "Tag name (HTML/XML/JSX)")),
    },
  };
}

function formatDelta(value) {
  return value.toFixed(1);
}

function main() {
  const loaded = Object.fromEntries(
    Object.keys(THEMES).map((themeId) => [themeId, loadTheme(themeId)])
  );
  const issues = [];

  for (const [themeId, { colors, palette }] of Object.entries(loaded)) {
    let minCorePair = null;

    for (let i = 0; i < CORE_ROLES.length; i += 1) {
      for (let j = i + 1; j < CORE_ROLES.length; j += 1) {
        const roleA = CORE_ROLES[i];
        const roleB = CORE_ROLES[j];
        const distance = deltaE(palette[roleA], palette[roleB]);

        if (!minCorePair || distance < minCorePair.distance) {
          minCorePair = { roleA, roleB, distance };
        }

        if (distance < MIN_CORE_DELTA) {
          issues.push(
            `${themeId}: core lanes ${roleA}/${roleB} are too close (ΔE ${formatDelta(distance)} < ${MIN_CORE_DELTA})`
          );
        }
      }
    }

    for (const [roleA, roleB] of TARGETED_PAIRS) {
      const distance = deltaE(palette[roleA], palette[roleB]);
      if (distance < MIN_TARGETED_DELTA) {
        issues.push(
          `${themeId}: targeted pair ${roleA}/${roleB} collapsed (ΔE ${formatDelta(distance)} < ${MIN_TARGETED_DELTA})`
        );
      }
    }

    for (const [surfaceKey, threshold] of Object.entries(SURFACE_SPACING_MIN)) {
      const surface = normalizeHex(colors[surfaceKey]);
      const editorBg = normalizeHex(colors["editor.background"]);
      const distance = deltaE(surface, editorBg);

      if (distance < threshold) {
        issues.push(
          `${themeId}: ${surfaceKey} is too close to editor.background (ΔE ${formatDelta(distance)} < ${threshold})`
        );
      }
    }

    if (normalizeHex(colors["tab.activeBackground"]) === normalizeHex(colors["editor.background"])) {
      issues.push(`${themeId}: tab.activeBackground must not equal editor.background`);
    }

    console.log(
      `${themeId}: closest core pair ${minCorePair.roleA}/${minCorePair.roleB} at ΔE ${formatDelta(minCorePair.distance)}`
    );
  }

  const light = loaded.light.palette;
  const bright = loaded["light-bright"].palette;
  const syntaxDrifts = CORE_ROLES.map((role) => ({
    role,
    distance: deltaE(light[role], bright[role]),
  }));
  const averageSyntaxDrift =
    syntaxDrifts.reduce((sum, entry) => sum + entry.distance, 0) / syntaxDrifts.length;
  const rolesAboveFloor = syntaxDrifts.filter(
    (entry) => entry.distance >= MIN_SYNTAX_ROLE_DRIFT
  ).length;

  for (const [role, threshold] of Object.entries(SAME_ROLE_DRIFT_MIN)) {
    const distance = deltaE(light[role], bright[role]);
    if (distance < threshold) {
      issues.push(
        `light-vs-bright: ${role} drift is too small (ΔE ${formatDelta(distance)} < ${threshold})`
      );
    }
  }

  if (averageSyntaxDrift < MIN_AVERAGE_SYNTAX_DRIFT) {
    issues.push(
      `light-vs-bright: average syntax drift is too small (ΔE ${formatDelta(averageSyntaxDrift)} < ${MIN_AVERAGE_SYNTAX_DRIFT})`
    );
  }

  if (rolesAboveFloor < MIN_DISTINCT_SYNTAX_ROLES) {
    issues.push(
      `light-vs-bright: only ${rolesAboveFloor} syntax roles clear ΔE ${MIN_SYNTAX_ROLE_DRIFT} (need ${MIN_DISTINCT_SYNTAX_ROLES})`
    );
  }

  console.log(
    `light-vs-bright: average syntax drift ΔE ${formatDelta(averageSyntaxDrift)}, ${rolesAboveFloor}/${CORE_ROLES.length} roles clear ΔE ${MIN_SYNTAX_ROLE_DRIFT}`
  );

  if (issues.length > 0) {
    console.error("\n❌ Palette spacing regressions detected:\n");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log("\n✅ Light-theme palette spacing checks passed.");
}

main();
