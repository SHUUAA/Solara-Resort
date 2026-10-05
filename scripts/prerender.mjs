import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'dist')
const serverEntry = path.join(dist, 'server', 'entry-server.js')
const { indexableRoutes, render, renderHead } = await import(pathToFileURL(serverEntry).href)
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const verification = process.env.VITE_GOOGLE_SITE_VERIFICATION?.trim() || ''

async function writeRoute(route) {
  const html = template
    .replace('<!--seo-head-->', renderHead(route, verification))
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`)
  const output = route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.slice(1)}.html`)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, html)
}

for (const route of indexableRoutes) await writeRoute(route)

const notFound = template
  .replace('<!--seo-head-->', renderHead('/404'))
  .replace('<div id="root"></div>', `<div id="root">${render('/404')}</div>`)
await writeFile(path.join(dist, '404.html'), notFound)

const origin = 'https://solararesort-three.vercel.app'
const urls = indexableRoutes.map(route => `  <url><loc>${origin}${route === '/' ? '/' : route}</loc></url>`).join('\n')
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`)
await rm(path.join(dist, 'server'), { recursive: true, force: true })
