const fs = require('fs')
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1480, height: 2500 }, deviceScaleFactor: 1 })
  await page.goto('file:///root/.openclaw/workspace/blog/docs/mockups/homepage-highfidelity-b.html', { waitUntil: 'networkidle' })
  await page.screenshot({ path: '/root/.openclaw/workspace/blog/docs/mockups/highfidelity-b-rendered.png', fullPage: true })
  await browser.close()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
