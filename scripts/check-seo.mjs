import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const routes = ['/', '/stays', '/experiences', '/about', '/contact']
const titles = new Set()
const descriptions = new Set()

for (const route of routes) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`
  const html = await readFile(path.join('dist', file), 'utf8')
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]
  const description = html.match(/<meta name="description" content="(.*?)"/)?.[1]
  assert.ok(title, `${route} has a title`)
  assert.ok(description, `${route} has a description`)
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route} has one h1`)
  assert.match(html, /rel="canonical"/)
  assert.match(html, /application\/ld\+json/)
  assert.match(html, /<main/)
  titles.add(title)
  descriptions.add(description)
}

assert.equal(titles.size, routes.length, 'route titles are unique')
assert.equal(descriptions.size, routes.length, 'route descriptions are unique')

const notFound = await readFile(path.join('dist', '404.html'), 'utf8')
assert.match(notFound, /noindex, nofollow/)
const sitemap = await readFile(path.join('dist', 'sitemap.xml'), 'utf8')
for (const route of routes) assert.match(sitemap, new RegExp(`<loc>https://solararesort-three\\.vercel\\.app${route === '/' ? '/' : route}<\\/loc>`))
assert.ok(!sitemap.includes('/404'))
console.log('PASS: pre-rendered SEO metadata, content, schema, canonicals, sitemap, and 404 policy')
