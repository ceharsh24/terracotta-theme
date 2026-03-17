#!/usr/bin/env node
/**
 * Generates theme screenshots by loading examples/screenshot-gen.html
 * with each theme and saving a PNG to screenshots/.
 *
 * Requires: npm install puppeteer (dev)
 * If Chrome is not found, install it: npx puppeteer browsers install chrome
 * Or use system Chrome (script will try common paths on macOS).
 *
 * Run: node scripts/screenshot.js   or   npm run screenshots
 */

const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const THEMES = ['dark', 'dark-dimmed', 'light', 'light-bright', 'high-contrast-cb'];
const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT, 'examples', 'screenshot-gen.html');
const OUT_DIR = path.join(ROOT, 'screenshots');

const SYSTEM_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : null,
  process.platform === 'linux' ? '/usr/bin/google-chrome' : null,
  process.platform === 'linux' ? '/usr/bin/chromium' : null,
].filter(Boolean);

function findChrome() {
  for (const p of SYSTEM_CHROME_PATHS) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (_) {}
  }
  return null;
}

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (_) {
    console.error('Puppeteer not found. Install with: npm install --save-dev puppeteer');
    process.exit(1);
  }

  const launchOpts = { headless: true };
  const systemChrome = findChrome();
  if (systemChrome) launchOpts.executablePath = systemChrome;

  let browser;
  try {
    browser = await puppeteer.launch(launchOpts);
  } catch (err) {
    if (err.message && err.message.includes('Could not find Chrome')) {
      console.error('Chrome not found. Install Puppeteer\'s Chrome with:');
      console.error('  npx puppeteer browsers install chrome');
      console.error('Or install Google Chrome / Chromium and re-run.');
    }
    throw err;
  }
  const page = await browser.newPage();

  await page.setViewport({
    width: 1024,
    height: 600,
    deviceScaleFactor: 2,
  });

  const htmlUrl = pathToFileURL(HTML_PATH).href;

  for (const theme of THEMES) {
    const url = `${htmlUrl}?theme=${theme}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
    await page.evaluate(() => document.fonts.ready);

    const outPath = path.join(OUT_DIR, `screenshot-${theme}.png`);
    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: 1024, height: 600 },
    });
    console.log('Written:', outPath);
  }

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
