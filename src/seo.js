export const SITE_ORIGIN = 'https://solararesort-three.vercel.app'

export const SEO_ROUTES = {
  '/': {
    title: 'Solara Resort | A Tropical Island Escape',
    description: 'Discover Solara Resort, a fictional tropical island escape with ocean suites, private pool villas, restorative wellness, and unhurried seaside dining.',
    label: 'Home',
    image: '/images/og-solara.webp',
    lcpImage: '/images/responsive/coast-1440.webp',
  },
  '/stays': {
    title: 'Ocean Suites & Private Pool Villas | Solara Resort',
    description: 'Explore Solara Resort stays, from an airy ocean suite with a sea-view terrace to a secluded private pool villa designed for slower island days.',
    label: 'Stays',
    image: '/images/og-solara.webp',
    lcpImage: '/images/responsive/suite-1440.webp',
  },
  '/experiences': {
    title: 'Beach, Wellness & Dining Experiences | Solara Resort',
    description: 'Imagine days shaped by turquoise water, open-air wellness, tropical breakfasts, and relaxed seaside dining at fictional Solara Resort.',
    label: 'Experiences',
    image: '/images/og-solara.webp',
    lcpImage: '/images/responsive/pool-1440.webp',
  },
  '/about': {
    title: 'Our Story | Solara Resort',
    description: 'Meet the idea behind Solara Resort, a fictional tropical retreat concept inspired by thoughtful design, open spaces, and a gentler island pace.',
    label: 'Our story',
    image: '/images/og-solara.webp',
    lcpImage: '/images/responsive/coast-1440.webp',
  },
  '/contact': {
    title: 'Plan a Fictional Resort Stay | Solara Resort',
    description: 'Prepare a demo stay inquiry for Solara Resort and imagine your preferred dates, guests, ocean suite, or private pool villa escape.',
    label: 'Contact',
    image: '/images/og-solara.webp',
    lcpImage: '/images/responsive/dining-1440.webp',
  },
}

export const NOT_FOUND_SEO = {
  title: 'Page Not Found | Solara Resort',
  description: 'The requested page could not be found.',
  label: 'Page not found',
  image: '/images/og-solara.webp',
  noindex: true,
}

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

export function seoForPath(pathname) {
  return SEO_ROUTES[normalizePath(pathname)] || NOT_FOUND_SEO
}

export function canonicalForPath(pathname) {
  const path = normalizePath(pathname)
  return `${SITE_ORIGIN}${path === '/' ? '/' : path}`
}

export function structuredDataForPath(pathname) {
  const path = normalizePath(pathname)
  const seo = seoForPath(path)
  const canonical = canonicalForPath(path)
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: 'Solara Resort',
      description: 'A fictional tropical resort concept created to inspire slower island escapes.',
      inLanguage: 'en',
    },
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      inLanguage: 'en',
    },
  ]

  if (path !== '/' && SEO_ROUTES[path]) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: seo.label, item: canonical },
      ],
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    element.dataset.seoManaged = 'true'
    document.head.appendChild(element)
  }
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
}

export function applyClientSeo(pathname) {
  const seo = seoForPath(pathname)
  const canonical = canonicalForPath(pathname)
  document.title = seo.title
  upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: `${SITE_ORIGIN}${seo.image}` })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: `${SITE_ORIGIN}${seo.image}` })

  let canonicalLink = document.head.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    canonicalLink.dataset.seoManaged = 'true'
    document.head.appendChild(canonicalLink)
  }
  canonicalLink.href = canonical

  let schema = document.head.querySelector('script[data-seo-schema]')
  if (!schema) {
    schema = document.createElement('script')
    schema.type = 'application/ld+json'
    schema.dataset.seoSchema = 'true'
    document.head.appendChild(schema)
  }
  schema.textContent = JSON.stringify(structuredDataForPath(pathname)).replace(/</g, '\\u003c')
}
