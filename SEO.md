# Solara Resort SEO handoff

Solara is a fictional concept. Its search implementation deliberately avoids an address, phone number, prices, availability, reviews, ratings, a Google Business Profile, and `Hotel`, `Resort`, or `LocalBusiness` structured data. Add those only if the project becomes a real, verifiable hospitality business.

## Keyword and intent map

| Page | Primary intent | Supporting topics |
|---|---|---|
| `/` | tropical resort; island escape | slow travel, coastal retreat |
| `/stays` | ocean suite; private pool villa | sea-view terrace, island accommodation |
| `/experiences` | resort experiences | beach, wellness, tropical breakfast, seaside dining |
| `/about` | Solara Resort story | thoughtful hospitality design, tropical retreat concept |
| `/contact` | resort stay inquiry | preferred dates, guests, suite or villa |

These are qualitative content themes, not claimed search-volume or difficulty data. Before a real launch, validate them in Google Keyword Planner or another licensed keyword platform, then inspect the live results for intent, page type, recurring subtopics, and credible competitors. Do not force a term into copy when it changes the fictional nature of the site.

## Search Console and GA4

1. Create a URL-prefix Search Console property for `https://solararesort-three.vercel.app/`.
2. Add the provided HTML verification token to the Vercel environment variable `VITE_GOOGLE_SITE_VERIFICATION`, rebuild, verify, and submit `/sitemap.xml`.
3. Create a GA4 web data stream and set `VITE_GA_MEASUREMENT_ID` to its `G-...` ID in Vercel.
4. Redeploy. Analytics remains unloaded until a visitor accepts the on-site prompt. Test accept, decline, route changes, and the `generate_lead` inquiry event in GA4 DebugView.
5. Monitor Search Console clicks, impressions, CTR, queries, pages, indexing, and Core Web Vitals monthly. In GA4, monitor engaged sessions and inquiry events without treating the demo form as a real booking.

## Technical checks after deployment

- Confirm `/`, `/stays`, `/experiences`, `/about`, and `/contact` return HTTP 200 when opened directly; confirm a made-up URL returns HTTP 404.
- Confirm trailing-slash variants redirect to the clean canonical form, and that `robots.txt` and `sitemap.xml` return HTTP 200.
- Run mobile and desktop Lighthouse audits. Targets are SEO 100, performance at least 90, lab LCP below 2.5 seconds, and CLS below 0.1. Use field Core Web Vitals at the 75th percentile once enough real traffic exists; lab results do not measure INP reliably.
- Recheck schema with Schema.org Validator and inspect social previews after changing titles, descriptions, or the share image.

## Authority and local launch checklist

For a future real property, first publish consistent legal name, physical address, phone, booking contact, amenities, policies, and real photography. Then create and verify a Google Business Profile, add accurate local citations, request genuine guest reviews, and introduce truthful lodging schema. Do not add a map until requested.

Earn links through useful, verifiable stories: an opening announcement, architecture or sustainability coverage, destination guides, tourism-board relationships, and original photography available to relevant travel publications. Track referring domains and referral conversions; never purchase bulk links or manufacture reviews.
