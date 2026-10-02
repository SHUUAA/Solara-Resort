# Solara Resort — design direction

## Concept

Solara is a fictional boutique tropical resort. The site sells the feeling of unhurried time through immersive photography, elegant typography, generous spacing, and clear paths to explore or inquire. All resort images are generated concept visuals; accommodation, amenities, and booking details are illustrative.

## Visual system

- Palette: deep palm `#15372f`, sea glass `#698b7e`, warm ivory `#f6f3eb`, sand `#ded1bb`, soft ink `#23332e`, white `#fff`.
- Type: Playfair Display for editorial headings and italics; DM Sans for navigation, body copy, and controls. Georgia and system sans are fallbacks.
- Layout: wide full-bleed hero images, narrow text measures, asymmetric editorial image pairings, and restrained hairline rules. Content width is about 1200px with 24px mobile gutters.
- Components: spaced serif SOLARA wordmark with a sun-and-horizon SVG emblem and sand RESORT lettering, shared by the header and footer. The favicon simplifies the same emblem for small sizes. Uppercase labels, underlined text links, forest buttons, and a calm footer complete the identity.
- Imagery: eight original photorealistic images in `public/images/`: coastal overview, suite, infinity pool, dining terrace, private villa, beach, spa pavilion, and breakfast terrace. Their shared materials are limestone, warm timber, linen, palms, and turquoise water.

## Pages and content

1. **Home:** aspirational hero, brand introduction, four-scene discovery carousel, stay preview, experience preview, and booking invitation.
2. **Accommodations:** suite and villa concepts, highlights, and inquiry calls to action. No invented rates or availability.
3. **Experiences:** pool, sea, dining, and quiet rituals presented as concepts.
4. **About:** Solara's fictional story and hospitality principles.
5. **Contact:** reservation inquiry form with a custom calendar for arrival and departure, a custom guest dropdown, contact details, and a message.

## Motion and interaction

- GSAP staggers hero text and reveals sections once with short vertical travel. Interior hero and stay photographs reveal through a vertical clip over 1.2 seconds; stay copy follows in a stagger. Both stays-page photographs share the same dimensions and 1.16 aspect ratio, including the reversed row.
- The homepage discovery carousel has category buttons, previous/next controls, and a slide count. Visitors control it; it does not advance automatically. Its frame stays the same size across slides, images crop with `object-fit: cover`, and transitions fade without zooming.
- Above 900px, the homepage hero, experience banner, and About panorama have gentle scroll-linked parallax inside clipped, overscanned frames. Native scrolling is preserved. No ambient loops or 3D effects.
- CSS adds slow stay-photo hover zoom on fine pointers, drawing link underlines, and button lift with keyboard focus feedback.
- Respect live changes to `prefers-reduced-motion`: all content stays visible and usable with spatial motion removed. GSAP media contexts restore styles on preference changes and dispose only their own animations on route changes.
- Navigation is keyboard accessible and the mobile menu is operable by button and closes on route changes.

## Booking demo

The form validates required fields and ensures departure follows arrival. Submission opens the visitor's email app with a prepared subject and message. The recipient is intentionally blank until a real address is supplied; a visible demo note explains that no reservation is submitted to Solara.

## Responsive and accessibility

- At narrow widths, paired layouts stack, typography scales down, and the navigation becomes a menu.
- All images have descriptive alternative text. Text on images uses overlays for contrast. Controls have visible focus styles, proper labels, and comfortable target sizes.
- Optimize original generated PNGs to local WebP assets. The first image is prioritized; secondary images load lazily.
