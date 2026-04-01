#!/usr/bin/env node

/**
 * Documentation palette sync checker for Terracotta Theme.
 *
 * Verifies that the published palette values in:
 * - README.md
 * - docs/index.html
 * - examples/theme-analysis.html
 *
 * stay aligned with the live theme JSON files in ./themes/.
 *
 * Exit code 0 = all synced, 1 = drift detected.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

const THEME_FILES = {
  dark: "terracotta-dark.json",
  "dark-dimmed": "terracotta-dark-dimmed.json",
  light: "terracotta-light.json",
  "light-bright": "terracotta-light-bright.json",
  "high-contrast-cb": "terracotta-high-contrast-cb.json",
};

const README_VARIANTS = [
  {
    heading: "Terracotta Dark",
    themeId: "dark",
    rows: {
      Background: "bg",
      Foreground: "fg",
      Accent: "accent",
      Keywords: "keyword",
      Functions: "function",
      Strings: "string",
      Types: "type",
      Numbers: "number",
      Operators: "operator",
      Decorators: "decorator",
    },
  },
  {
    heading: "Terracotta Dark Dimmed",
    themeId: "dark-dimmed",
    rows: {
      Background: "bg",
      Foreground: "fg",
      Accent: "accent",
      Keywords: "keyword",
      Functions: "function",
      Strings: "string",
      Types: "type",
      Numbers: "number",
      Operators: "operator",
    },
  },
  {
    heading: "Terracotta Light",
    themeId: "light",
    rows: {
      Background: "bg",
      Foreground: "fg",
      Accent: "accent",
      Keywords: "keyword",
      Functions: "function",
      Strings: "string",
      Types: "type",
      Numbers: "number",
      Operators: "operator",
      Decorators: "decorator",
    },
  },
  {
    heading: "Terracotta Light Bright",
    themeId: "light-bright",
    rows: {
      Background: "bg",
      Foreground: "fg",
      Accent: "accent",
      Keywords: "keyword",
      Functions: "function",
      Strings: "string",
      Types: "type",
      Numbers: "number",
      Operators: "operator",
    },
  },
  {
    heading: "Terracotta High Contrast (Color Blind)",
    themeId: "high-contrast-cb",
    rows: {
      Background: "bg",
      Foreground: "fg",
      Keywords: "keyword",
      Functions: "function",
      Strings: "string",
      Types: "type",
      Numbers: "number",
      Operators: "operator",
      "Self/this": "selfKeyword",
    },
  },
];

const DOCS_INDEX_THEME_MAP = {
  Dark: "dark",
  "Dark Dimmed": "dark-dimmed",
  Light: "light",
  "Light Bright": "light-bright",
  "High Contrast CB": "high-contrast-cb",
};

const DOCS_INDEX_TOKEN_MAP = {
  comment: "comment",
  string: "string",
  keyword: "keyword",
  function: "function",
  variable: "variable",
  number: "number",
  type: "type",
  operator: "operator",
  constant: "builtInConstant",
  builtin: "builtin",
  tag: "tag",
  attribute: "attribute",
  property: "property",
  punctuation: "punctuation",
  regex: "regex",
};

const ANALYSIS_VAR_MAP = {
  bg: "bg",
  fg: "fg",
  comment: "comment",
  doc: "doc",
  string: "string",
  number: "number",
  constant: "userConstant",
  keyword: "keyword",
  operator: "operator",
  function: "function",
  "builtin-fn": "builtin",
  class: "type",
  interface: "type",
  inherited: "inherited",
  variable: "variable",
  param: "parameter",
  property: "property",
  annotation: "decorator",
  punctuation: "punctuation",
  "builtin-const": "builtInConstant",
  self: "selfKeyword",
  "tag-color": "tag",
  attribute: "attribute",
  "tab-bg": "headerBg",
  gutter: "lineNum",
  "title-bg": "headerBg",
};

const EXTRA_TOKEN_NAMES = {
  doc: "Doc comments",
  builtin: "Built-in functions",
  inherited: "Inherited class",
  punctuation: "Punctuation",
  builtInConstant: "Built-in constants",
  userConstant: "User constants",
  tag: "Tag name (HTML/XML/JSX)",
  attribute: "Tag attribute",
  tagPunctuation: "Tag punctuation",
  rustAttribute: "Rust attribute",
};

function normalizeHex(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0].toUpperCase() : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractForeground(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && value.foreground) return value.foreground;
  return null;
}

function extractNamedToken(theme, name) {
  const rule = (theme.tokenColors || []).find((entry) => entry.name === name);
  return rule?.settings?.foreground || null;
}

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function extractPalette(themeId) {
  const theme = JSON.parse(
    fs.readFileSync(path.join(ROOT, "themes", THEME_FILES[themeId]), "utf8")
  );
  const colors = theme.colors || {};
  const semantic = theme.semanticTokenColors || {};

  return {
    bg: normalizeHex(colors["editor.background"]),
    fg: normalizeHex(colors["editor.foreground"]),
    accent: normalizeHex(colors["button.background"]),
    selection: normalizeHex(colors["editor.selectionBackground"] || colors["selection.background"]),
    lineHighlight: normalizeHex(colors["editor.lineHighlightBackground"]),
    lineNum: normalizeHex(colors["editorLineNumber.foreground"]),
    lineNumActive: normalizeHex(colors["editorLineNumber.activeForeground"]),
    headerBg: normalizeHex(colors["editorGroupHeader.tabsBackground"]),
    comment: normalizeHex(extractForeground(semantic.comment) || extractNamedToken(theme, "Comments")),
    doc: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.doc)),
    string: normalizeHex(extractForeground(semantic.string)),
    keyword: normalizeHex(extractForeground(semantic.keyword)),
    function: normalizeHex(extractForeground(semantic.function)),
    builtin: normalizeHex(
      extractForeground(semantic["function.defaultLibrary"]) ||
        extractNamedToken(theme, EXTRA_TOKEN_NAMES.builtin)
    ),
    variable: normalizeHex(extractForeground(semantic.variable)),
    number: normalizeHex(extractForeground(semantic.number)),
    type: normalizeHex(extractForeground(semantic.type)),
    operator: normalizeHex(extractForeground(semantic.operator)),
    property: normalizeHex(extractForeground(semantic.property)),
    parameter: normalizeHex(extractForeground(semantic.parameter)),
    decorator: normalizeHex(extractForeground(semantic.decorator)),
    selfKeyword: normalizeHex(extractForeground(semantic.selfKeyword)),
    builtInConstant: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.builtInConstant)),
    userConstant: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.userConstant)),
    regex: normalizeHex(extractNamedToken(theme, "Regex")),
    tag: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.tag)),
    attribute: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.attribute)),
    tagPunctuation: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.tagPunctuation)),
    punctuation: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.punctuation)),
    inherited: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.inherited)),
    rustAttribute: normalizeHex(extractNamedToken(theme, EXTRA_TOKEN_NAMES.rustAttribute)),
  };
}

function loadPalettes() {
  return Object.fromEntries(
    Object.keys(THEME_FILES).map((themeId) => [themeId, extractPalette(themeId)])
  );
}

function buildAllowedHexSet(palette) {
  return new Set(
    Object.values(palette)
      .map((value) => normalizeHex(value))
      .filter(Boolean)
  );
}

function collectHexes(text) {
  return [...text.matchAll(/#[0-9A-Fa-f]{6}/g)].map((match) => normalizeHex(match[0]));
}

function compareHex(surface, label, actual, expected, issues) {
  if (!actual) {
    issues.push(`${surface}: missing ${label}`);
    return;
  }
  if (normalizeHex(actual) !== normalizeHex(expected)) {
    issues.push(
      `${surface}: ${label} expected ${normalizeHex(expected)} but found ${normalizeHex(actual)}`
    );
  }
}

function validateReadmeTables(readme, palettes, issues) {
  for (const variant of README_VARIANTS) {
    const sectionMatch = readme.match(
      new RegExp(
        `### ${escapeRegExp(variant.heading)}\\n\\n([\\s\\S]*?)(?=\\n### |\\n---|\\n## )`
      )
    );
    if (!sectionMatch) {
      issues.push(`README.md: missing section "${variant.heading}"`);
      continue;
    }

    const section = sectionMatch[1];
    for (const [rowLabel, role] of Object.entries(variant.rows)) {
      const rowMatch = section.match(
        new RegExp(`^\\|\\s*${escapeRegExp(rowLabel)}\\s*\\|.*?\`(#[0-9A-Fa-f]{6})\``, "m")
      );
      if (!rowMatch) {
        issues.push(`README.md: missing "${rowLabel}" row in "${variant.heading}"`);
        continue;
      }
      compareHex(
        "README.md",
        `${variant.heading} -> ${rowLabel}`,
        rowMatch[1],
        palettes[variant.themeId][role],
        issues
      );
    }
  }
}

function validateReadmeBackticks(readme, globalAllowedHexes, issues) {
  for (const match of readme.matchAll(/`(#[0-9A-Fa-f]{6})`/g)) {
    const hex = normalizeHex(match[1]);
    if (!globalAllowedHexes.has(hex)) {
      issues.push(`README.md: unexpected palette hex ${hex}`);
    }
  }
}

function validateDocsIndex(docsIndex, palettes, issues) {
  const objectMatch = docsIndex.match(
    /const THEMES = (\{[\s\S]*?\n\});\n\n\/\/ ── Sample code/
  );
  if (!objectMatch) {
    issues.push("docs/index.html: unable to locate THEMES object");
    return;
  }

  const themesObject = vm.runInNewContext(`(${objectMatch[1]})`);

  for (const [docsName, themeId] of Object.entries(DOCS_INDEX_THEME_MAP)) {
    const actualTheme = themesObject[docsName];
    if (!actualTheme) {
      issues.push(`docs/index.html: missing theme "${docsName}"`);
      continue;
    }

    const expected = palettes[themeId];
    compareHex("docs/index.html", `${docsName} bg`, actualTheme.bg, expected.bg, issues);
    compareHex("docs/index.html", `${docsName} fg`, actualTheme.fg, expected.fg, issues);
    compareHex(
      "docs/index.html",
      `${docsName} selection`,
      actualTheme.selection,
      expected.selection,
      issues
    );
    compareHex(
      "docs/index.html",
      `${docsName} lineHighlight`,
      actualTheme.lineHighlight,
      expected.lineHighlight,
      issues
    );
    compareHex(
      "docs/index.html",
      `${docsName} lineNum`,
      actualTheme.lineNum,
      expected.lineNum,
      issues
    );
    compareHex(
      "docs/index.html",
      `${docsName} lineNumActive`,
      actualTheme.lineNumActive,
      expected.lineNumActive,
      issues
    );
    compareHex(
      "docs/index.html",
      `${docsName} headerBg`,
      actualTheme.headerBg,
      expected.headerBg,
      issues
    );

    for (const [tokenKey, role] of Object.entries(DOCS_INDEX_TOKEN_MAP)) {
      compareHex(
        "docs/index.html",
        `${docsName} token:${tokenKey}`,
        actualTheme.tokens?.[tokenKey]?.color,
        expected[role],
        issues
      );
    }
  }
}

function validateAnalysisVars(analysisHtml, palettes, issues) {
  for (const themeId of Object.keys(THEME_FILES)) {
    const blockMatch = analysisHtml.match(
      new RegExp(`\\[data-theme="${escapeRegExp(themeId)}"\\]\\s*\\{([\\s\\S]*?)\\n\\s*\\}`)
    );
    if (!blockMatch) {
      issues.push(`examples/theme-analysis.html: missing [data-theme="${themeId}"] block`);
      continue;
    }

    const vars = Object.fromEntries(
      [...blockMatch[1].matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((match) => [
        match[1],
        normalizeHex(match[2]),
      ])
    );

    for (const [varName, role] of Object.entries(ANALYSIS_VAR_MAP)) {
      compareHex(
        "examples/theme-analysis.html",
        `${themeId} css:${varName}`,
        vars[varName],
        palettes[themeId][role],
        issues
      );
    }
  }
}

function validateAnalysisNarrative(analysisHtml, palettes, issues) {
  for (const themeId of Object.keys(THEME_FILES)) {
    const sectionMatch = analysisHtml.match(
      new RegExp(`id="findings-${escapeRegExp(themeId)}"[\\s\\S]*?(?=\\n\\s*<!-- )`)
    );
    if (!sectionMatch) {
      issues.push(`examples/theme-analysis.html: missing findings section for ${themeId}`);
      continue;
    }

    const allowedHexes = buildAllowedHexSet(palettes[themeId]);
    for (const hex of collectHexes(sectionMatch[0])) {
      if (!allowedHexes.has(hex)) {
        issues.push(
          `examples/theme-analysis.html: findings-${themeId} contains unexpected hex ${hex}`
        );
      }
    }
  }

  const summaryMatch = analysisHtml.match(
    /<div class="summary-section">([\s\S]*?)<script>/
  );
  if (!summaryMatch) {
    issues.push("examples/theme-analysis.html: missing summary section");
    return;
  }

  const globalAllowedHexes = new Set();
  for (const palette of Object.values(palettes)) {
    for (const hex of buildAllowedHexSet(palette)) {
      globalAllowedHexes.add(hex);
    }
  }

  for (const hex of collectHexes(summaryMatch[1])) {
    if (!globalAllowedHexes.has(hex)) {
      issues.push(`examples/theme-analysis.html: summary contains unexpected hex ${hex}`);
    }
  }
}

function main() {
  const palettes = loadPalettes();
  const readme = readText("README.md");
  const docsIndex = readText("docs/index.html");
  const analysisHtml = readText("examples/theme-analysis.html");
  const issues = [];

  validateReadmeTables(readme, palettes, issues);

  const globalAllowedHexes = new Set();
  for (const palette of Object.values(palettes)) {
    for (const hex of buildAllowedHexSet(palette)) {
      globalAllowedHexes.add(hex);
    }
  }

  validateReadmeBackticks(readme, globalAllowedHexes, issues);
  validateDocsIndex(docsIndex, palettes, issues);
  validateAnalysisVars(analysisHtml, palettes, issues);
  validateAnalysisNarrative(analysisHtml, palettes, issues);

  if (issues.length > 0) {
    console.error("❌ Documentation palette drift detected:\n");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log("✅ Documentation palette values match the live theme JSON files.");
}

main();
