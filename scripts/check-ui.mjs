// Run against npm run dev with an existing Puppeteer module and Chromium browser:
// node scripts/check-ui.mjs <path-to-puppeteer-core.js> <path-to-browser.exe> [base-url]
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'

const { default: puppeteer } = await import(pathToFileURL(process.argv[2]).href)
const baseUrl = process.argv[4] || 'http://127.0.0.1:5173'
const browser = await puppeteer.launch({ executablePath: process.argv[3], headless: true })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.stack))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  const motion = value => page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value }])
  const visit = async path => {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
  }
  const visibleWithoutMotion = async () => {
    await page.waitForFunction(() => [...document.querySelectorAll('[data-reveal], [data-hero-reveal], .stay-row-copy > *, .stay-row-image')].every(element => {
      const style = getComputedStyle(element)
      return style.opacity === '1' && style.transform === 'none' && style.clipPath === 'none'
    }))
  }
  await motion('reduce')
  for (const width of [320, 375, 700, 1024, 1440]) {
    await page.setViewport({ width, height: 1000 })
    await visit('/stays')
    const boxes = await page.$$eval('.stay-row-image img', images => images.map(image => {
      const { width, height, x, y } = image.getBoundingClientRect()
      return { width, height, x, y, copyY: image.closest('.stay-row-image').nextElementSibling.getBoundingClientRect().y }
    }))
    assert.equal(boxes.length, 2)
    assert.ok(Math.abs(boxes[0].width - boxes[1].width) < 1, `Photo widths at ${width}`)
    assert.ok(Math.abs(boxes[0].height - boxes[1].height) < 1, `Photo heights at ${width}`)
    if (width <= 700) assert.ok(boxes.every(box => box.copyY >= box.y + box.height), 'Photos above copy')
    else assert.ok(boxes[1].x > boxes[0].x, 'Alternating desktop layout')
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`)
    await visibleWithoutMotion()
    console.log(`Stays ${width}px: equal ${boxes[0].width.toFixed(1)} × ${boxes[0].height.toFixed(1)} photos`)
  }
  // Changing the preference while reveals are pending must restore all content.
  await motion('no-preference')
  await visit('/stays')
  for (const index of [0, 1]) {
    await page.$$eval('.stay-row', (rows, index) => rows[index].scrollIntoView({ behavior: 'instant', block: 'center' }), index)
    await page.waitForFunction(index => {
      const row = document.querySelectorAll('.stay-row')[index]
      return getComputedStyle(row.querySelector('.stay-row-image')).clipPath === 'none' && [...row.querySelector('.stay-row-copy').children].every(child => getComputedStyle(child).opacity === '1')
    }, {}, index)
  }
  await motion('reduce')
  await visibleWithoutMotion()
  await visit('/')
  await motion('no-preference')
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.home-hero-image')).transform !== 'none')
  assert.ok(await page.$eval('.home-hero-image', image => {
    const frame = image.closest('.home-hero').getBoundingClientRect()
    const photo = image.getBoundingClientRect()
    return photo.top <= frame.top && photo.bottom >= frame.bottom && photo.left <= frame.left && photo.right >= frame.right
  }), 'Parallax covers its frame')
  await motion('reduce')
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.home-hero-image')).transform === 'none')
  await page.click('[aria-label="Next highlight"]')
  assert.equal(await page.$eval('.discovery-tabs button.active', element => element.textContent), 'THE STAYS')
  await motion('no-preference')
  for (const path of ['/stays', '/experiences', '/about', '/contact', '/stays']) {
    await page.evaluate(path => document.querySelector(`.site-header a[href="${path}"]`).click(), path)
    await page.waitForFunction(path => location.pathname === path, {}, path)
    await motion('reduce')
    await visibleWithoutMotion()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow on ${path}`)
    await motion('no-preference')
  }
  await page.setViewport({ width: 375, height: 812 })
  await visit('/stays')
  await page.click('.menu-toggle')
  assert.equal(await page.$eval('.menu-toggle', element => element.getAttribute('aria-expanded')), 'true')
  await page.click('.site-header a[href="/contact"]')
  await page.waitForFunction(() => location.pathname === '/contact')
  assert.equal(await page.$eval('.menu-toggle', element => element.getAttribute('aria-expanded')), 'false')
  assert.equal(await page.$$eval('.inquiry-form input[required]', inputs => inputs.length), 2)
  await motion('reduce')
  await page.click('#arrival-picker')
  await page.waitForSelector('#arrival-calendar')
  await page.keyboard.press('Escape')
  assert.equal(await page.$eval('#arrival-picker', element => element.getAttribute('aria-expanded')), 'false')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'arrival-picker')
  await page.setViewport({ width: 1440, height: 1000 })
  await visit('/stays')
  if (await page.$('.consent-panel')) {
    assert.equal(await page.$$eval('script[src*="googletagmanager.com"]', scripts => scripts.length), 0, 'Analytics is absent before consent')
    await page.click('.consent-actions .button:not(.button-outline)')
    await page.waitForSelector('script[src*="googletagmanager.com"]')
    assert.equal(await page.evaluate(() => localStorage.getItem('solara_analytics_consent')), 'accepted')
    assert.ok(await page.evaluate(() => window.dataLayer?.some(entry => entry[0] === 'event' && entry[1] === 'page_view')), 'Accepted analytics records a page view')
  }
  await page.screenshot({ path: 'dist/stays-desktop.png', fullPage: true })
  assert.deepEqual(errors, [])
  console.log('PASS: layouts, live reduced motion, route changes, carousel, mobile menu, and form presence')
} finally {
  await browser.close()
}
