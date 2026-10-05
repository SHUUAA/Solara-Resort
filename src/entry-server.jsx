import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { App } from './main.jsx'
import { canonicalForPath, SEO_ROUTES, seoForPath, SITE_ORIGIN, structuredDataForPath } from './seo.js'

const escapeAttribute = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export function render(pathname) {
  return renderToString(<StaticRouter location={pathname}><App /></StaticRouter>)
}

export function renderHead(pathname, verification = '') {
  const seo = seoForPath(pathname)
  const canonical = canonicalForPath(pathname)
  const image = `${SITE_ORIGIN}${seo.image}`
  const schema = JSON.stringify(structuredDataForPath(pathname)).replace(/</g, '\\u003c')
  return [
    `<title>${escapeAttribute(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(seo.description)}" data-seo-managed="true">`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" data-seo-managed="true">`,
    `<link rel="canonical" href="${escapeAttribute(canonical)}" data-seo-managed="true">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Solara Resort">',
    '<meta property="og:locale" content="en_US">',
    `<meta property="og:title" content="${escapeAttribute(seo.title)}" data-seo-managed="true">`,
    `<meta property="og:description" content="${escapeAttribute(seo.description)}" data-seo-managed="true">`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" data-seo-managed="true">`,
    `<meta property="og:image" content="${escapeAttribute(image)}" data-seo-managed="true">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeAttribute(seo.title)}" data-seo-managed="true">`,
    `<meta name="twitter:description" content="${escapeAttribute(seo.description)}" data-seo-managed="true">`,
    `<meta name="twitter:image" content="${escapeAttribute(image)}" data-seo-managed="true">`,
    seo.lcpImage ? `<link rel="preload" as="image" href="${seo.lcpImage}" fetchpriority="high">` : '',
    verification ? `<meta name="google-site-verification" content="${escapeAttribute(verification)}">` : '',
    `<script type="application/ld+json" data-seo-schema="true">${schema}</script>`,
  ].filter(Boolean).join('\n    ')
}

export const indexableRoutes = Object.keys(SEO_ROUTES)
