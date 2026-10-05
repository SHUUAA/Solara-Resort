import assert from 'node:assert/strict'
import test from 'node:test'
import { canonicalForPath, SEO_ROUTES, SITE_ORIGIN, structuredDataForPath } from './seo.js'

test('every indexable route has unique metadata and an absolute canonical URL', () => {
  const pages = Object.entries(SEO_ROUTES)
  assert.equal(new Set(pages.map(([, page]) => page.title)).size, pages.length)
  assert.equal(new Set(pages.map(([, page]) => page.description)).size, pages.length)
  for (const [route, page] of pages) {
    assert.match(page.title, /Solara Resort/)
    assert.ok(page.description.length >= 100 && page.description.length <= 170)
    assert.equal(canonicalForPath(route), `${SITE_ORIGIN}${route}`)
  }
})

test('structured data describes pages and breadcrumbs without fictional business claims', () => {
  const homeTypes = structuredDataForPath('/')['@graph'].map(item => item['@type'])
  const staysTypes = structuredDataForPath('/stays')['@graph'].map(item => item['@type'])
  assert.deepEqual(homeTypes, ['WebSite', 'WebPage'])
  assert.deepEqual(staysTypes, ['WebSite', 'WebPage', 'BreadcrumbList'])
  assert.ok(!homeTypes.some(type => ['Hotel', 'Resort', 'LocalBusiness', 'AggregateRating'].includes(type)))
})

test('trailing slashes consolidate to the same canonical URL', () => {
  assert.equal(canonicalForPath('/stays/'), canonicalForPath('/stays'))
})
