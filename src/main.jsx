import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createInquiryEmail, isoDate, nextDate } from './booking.js'
import { DatePicker, GuestDropdown } from './InquiryControls.jsx'
import { analyticsAvailable, getAnalyticsConsent, loadAnalytics, openAnalyticsSettings, setAnalyticsConsent, trackInquiry, trackPageView } from './analytics.js'
import { applyClientSeo } from './seo.js'
import './styles.css'

const images = {
  coast: '/images/coast.webp',
  suite: '/images/suite.webp',
  pool: '/images/pool.webp',
  dining: '/images/dining.webp',
  villa: '/images/villa.webp',
  beach: '/images/beach.webp',
  spa: '/images/spa.webp',
  breakfast: '/images/breakfast.webp',
}

const imageDimensions = {
  beach: [1536, 1024], breakfast: [1536, 1024], coast: [1942, 809], dining: [1536, 1024],
  pool: [1536, 1024], spa: [1536, 1024], suite: [1536, 1024], villa: [1536, 1024],
}

function ResponsiveImage({ src, sizes = '100vw', ...props }) {
  const name = src.split('/').pop().replace(/\.webp$/, '')
  const [width, height] = imageDimensions[name]
  const responsive = extension => [640, 960, 1440].map(size => `/images/responsive/${name}-${size}.${extension} ${size}w`).join(', ')
  return <picture className="responsive-picture">
    <source type="image/avif" srcSet={responsive('avif')} sizes={sizes} />
    <source type="image/webp" srcSet={responsive('webp')} sizes={sizes} />
    <img src={src} width={width} height={height} sizes={sizes} {...props} />
  </picture>
}

const discoverySlides = [
  { category: 'THE SHORE', title: 'Find your stretch of paradise.', copy: 'Slow walks, clear water, and the simple pleasure of having nowhere else to be.', image: images.beach, alt: 'Quiet Solara beach with turquoise water and palms', to: '/experiences' },
  { category: 'THE STAYS', title: 'A place to call your own.', copy: 'Private spaces shaped around soft mornings and wide-open views.', image: images.villa, alt: 'Private Solara villa and pool overlooking a tropical cove', to: '/stays' },
  { category: 'THE SPA', title: 'Return to your rhythm.', copy: 'A little time for yourself, with the sea always close.', image: images.spa, alt: 'Open-air Solara spa pavilion with ocean views', to: '/experiences' },
  { category: 'THE TABLE', title: 'Good mornings linger.', copy: 'Unhurried breakfasts and memorable meals are part of the journey.', image: images.breakfast, alt: 'Tropical breakfast served on a sea-view terrace', to: '/experiences' },
]

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>
}

function ButtonLink({ to, children, light = false, outline = false }) {
  return <Link to={to} className={`button ${light ? 'button-light' : ''} ${outline ? 'button-outline' : ''}`}>{children}<Arrow diagonal /></Link>
}

function TextLink({ to, children, light = false }) {
  return <Link to={to} className={`text-link ${light ? 'text-link-light' : ''}`}>{children}<Arrow diagonal /></Link>
}

function SunMark() {
  return <svg className="sun-mark" viewBox="0 0 52 52" fill="none" aria-hidden="true"><path d="M12 29a14 14 0 0 1 28 0" stroke="currentColor" strokeWidth="1.8"/><path d="M5 29h42M12 37h28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M26 5v4M9 12l3 3M43 12l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}

function Brand() {
  return <Link to="/" className="brand" aria-label="Solara Resort home"><SunMark /><span><strong>SOLARA</strong><small>RESORT</small></span></Link>
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setMenuOpen(false), [pathname])

  return <header className={`site-header ${pathname === '/' ? 'site-header-home' : ''}`}>
    <div className="header-inner content-width">
      <Brand />
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
      <nav id="primary-navigation" className={menuOpen ? 'nav-open' : ''} aria-label="Primary navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/stays">Stays</NavLink>
        <NavLink to="/experiences">Experiences</NavLink>
        <NavLink to="/about">Our story</NavLink>
        <NavLink to="/contact" className="nav-book">Plan your stay <Arrow diagonal /></NavLink>
      </nav>
    </div>
  </header>
}

function Footer() {
  return <footer className="site-footer">
    <div className="content-width footer-top">
      <div><span className="eyebrow light-label">THE GOOD KIND OF GETAWAY</span><h2>Stay a little<br/><em>longer.</em></h2><ButtonLink to="/contact" light>Plan your stay</ButtonLink></div>
      <div className="footer-links"><div><span className="eyebrow light-label">EXPLORE</span><Link to="/stays">Stays</Link><Link to="/experiences">Experiences</Link><Link to="/about">Our story</Link><Link to="/contact">Contact</Link></div><div><Brand /><p>A fictional tropical escape,<br/>created to inspire the art<br/>of slowing down.</p></div></div>
    </div>
    <div className="content-width footer-bottom"><span>© {new Date().getFullYear()} Solara Resort</span><span>Concept resort · Images are illustrative</span>{analyticsAvailable() && <button className="footer-settings" type="button" onClick={openAnalyticsSettings}>Analytics settings</button>}<Link to="/">Back to top ↑</Link></div>
  </footer>
}

function RouteSeo() {
  const { pathname } = useLocation()
  useEffect(() => applyClientSeo(pathname), [pathname])
  return null
}

function AnalyticsTracker() {
  const { pathname, search } = useLocation()
  const [consentVersion, setConsentVersion] = useState(0)
  useEffect(() => {
    const update = () => setConsentVersion(value => value + 1)
    window.addEventListener('solara:analytics-consent', update)
    return () => window.removeEventListener('solara:analytics-consent', update)
  }, [])
  useEffect(() => {
    if (getAnalyticsConsent() === 'accepted') trackPageView(`${pathname}${search}`)
  }, [pathname, search, consentVersion])
  return null
}

function AnalyticsConsent() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!analyticsAvailable()) return
    setOpen(!getAnalyticsConsent())
    const show = () => setOpen(true)
    window.addEventListener('solara:analytics-open', show)
    return () => window.removeEventListener('solara:analytics-open', show)
  }, [])
  if (!open) return null

  const choose = value => {
    setAnalyticsConsent(value)
    if (value === 'accepted') loadAnalytics()
    setOpen(false)
  }
  return <aside className="consent-panel" role="dialog" aria-modal="false" aria-labelledby="consent-title">
    <div><strong id="consent-title">Optional analytics</strong><p>Help improve this fictional resort concept with anonymous visit and inquiry-interaction data. No analytics loads unless you accept.</p></div>
    <div className="consent-actions"><button type="button" className="button button-outline" onClick={() => choose('declined')}>Decline</button><button type="button" className="button" onClick={() => choose('accepted')}>Accept analytics</button></div>
  </aside>
}

function SiteMotion() {
  const { pathname } = useLocation()
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-hero-reveal]:not(.page-intro-image):not(.contact-top-image)', { y: 32, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.14, delay: 0.12, clearProps: 'transform,opacity' })
      gsap.from('.page-intro-image, .contact-top-image', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.inOut', clearProps: 'clipPath' })
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: element, start: 'top 90%', once: true } })
        if (element.matches('.stay-row')) {
          timeline.from(element.querySelector('.stay-row-image'), { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.inOut', clearProps: 'clipPath' })
            .from(element.querySelector('.stay-row-copy').children, { y: 24, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.2)
        } else {
          timeline.from(element, { y: 28, opacity: 0, duration: 0.95, ease: 'power3.out', clearProps: 'transform,opacity' })
        }
        // Populate and measure each timeline before another trigger can refresh it.
        timeline.scrollTrigger.refresh()
      })
    })
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.home-hero-image, .experience-banner img, .about-image img').forEach((image) => {
        gsap.fromTo(image, { yPercent: -4, scale: 1.12 }, { yPercent: 4, scale: 1.12, ease: 'none', scrollTrigger: { trigger: image.closest('.home-hero, .experience-banner, .about-image'), start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
      })
    })
    return () => media.revert()
  }, [pathname])
  return null
}

function PageIntro({ label, title, italic, copy, image, alt, className = '' }) {
  return <section className={`page-intro ${className}`}>
    <div className="page-intro-copy"><span className="eyebrow" data-hero-reveal>{label}</span><h1 data-hero-reveal>{title} <em>{italic}</em></h1><p data-hero-reveal>{copy}</p></div>
    <div className="page-intro-image" data-hero-reveal><ResponsiveImage src={image} alt={alt} fetchPriority="high" sizes="(max-width: 700px) 100vw, 55vw" /></div>
  </section>
}

function BookingCallout({ title = 'Your time away is waiting.' }) {
  return <section className="booking-callout"><div className="content-width booking-callout-inner"><div data-reveal><span className="eyebrow light-label">THE NEXT CHAPTER</span><h2>{title}</h2></div><ButtonLink to="/contact" light>Start an inquiry</ButtonLink></div></section>
}

function Testimonials() {
  const [paused, setPaused] = useState(false)
  const notes = [
    ['The weekender', 'W', '“The kind of place where one quiet morning seems to stretch into an entire holiday.”'],
    ['The slow traveler', 'S', '“We came for the sea and stayed for the feeling of having nowhere else to be.”'],
    ['The design lover', 'D', '“Every space feels warm, open, and thoughtfully connected to the landscape.”'],
  ]
  const cards = (duplicate = false) => notes.map(([label, mark, quote], index) => <figure className="testimonial-card" key={`${label}-${duplicate ? 'copy' : 'original'}`}>
    <span className="testimonial-number" aria-hidden="true">{String(index + 1).padStart(2, '0')} / 03</span>
    <blockquote>{quote}</blockquote>
    <figcaption><span className="testimonial-avatar" aria-hidden="true">{mark}</span><span><strong>{label}</strong><small>Imagined guest perspective</small></span></figcaption>
  </figure>)
  return <section className="testimonials section-pad" aria-labelledby="guest-notes-title">
    <div className="content-width">
      <div className="testimonials-heading" data-reveal><div><span className="eyebrow">IMAGINED GUEST NOTES</span><h2 id="guest-notes-title" className="display-heading">A few words from <em>slower days.</em></h2></div><div className="testimonials-aside"><p>Concept testimonials written to express the Solara experience. These are not reviews from real guests.</p><button className="testimonial-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}><span aria-hidden="true">{paused ? '→' : 'Ⅱ'}</span>{paused ? 'Resume motion' : 'Pause motion'}</button></div></div>
    </div>
    <div className="testimonial-viewport" role="region" tabIndex={0} aria-label="Imagined guest notes">
      <div className={`testimonial-track${paused ? ' is-paused' : ''}`}>
        <div className="testimonial-set">{cards()}</div>
        <div className="testimonial-set" aria-hidden="true">{cards(true)}</div>
      </div>
    </div>
  </section>
}

function DiscoverCarousel() {
  const [index, setIndex] = useState(0)
  const slide = discoverySlides[index]
  const show = (step) => setIndex((current) => (current + step + discoverySlides.length) % discoverySlides.length)

  return <section className="discovery-section section-pad" aria-label="Discover Solara" aria-roledescription="carousel">
    <div className="content-width"><div className="discovery-heading" data-reveal><div><span className="eyebrow">EXPLORE SOLARA</span><h2 className="display-heading">A world to <em>make your own.</em></h2></div><p>Follow what draws you in. Every corner offers a different way to feel at home.</p></div>
      <div className="discovery-tabs" role="group" aria-label="Choose a resort highlight">{discoverySlides.map((item, position) => <button key={item.category} type="button" className={position === index ? 'active' : ''} aria-current={position === index ? 'true' : undefined} onClick={() => setIndex(position)}>{item.category}</button>)}</div>
      <div className="discovery-stage" id="discovery-slide"><div className="discovery-photo"><ResponsiveImage key={slide.image} src={slide.image} alt={slide.alt} loading="lazy" sizes="(max-width: 700px) 100vw, 60vw" /></div><div className="discovery-copy" aria-live="polite" aria-atomic="true"><span className="eyebrow">{String(index + 1).padStart(2, '0')} / {String(discoverySlides.length).padStart(2, '0')}</span><h3>{slide.title}</h3><p>{slide.copy}</p><TextLink to={slide.to}>Explore more</TextLink><div className="discovery-controls"><button type="button" onClick={() => show(-1)} aria-label="Previous highlight">←</button><span>{String(index + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(discoverySlides.length).padStart(2, '0')}</span><button type="button" onClick={() => show(1)} aria-label="Next highlight">→</button></div></div></div>
    </div>
  </section>
}

function Home() {
  return <main data-title="A slower kind of extraordinary">
    <section className="home-hero">
      <ResponsiveImage className="home-hero-image" src={images.coast} alt="Tropical coastline with villas among palms above a turquoise cove" fetchPriority="high" sizes="100vw" />
      <div className="home-hero-shade" />
      <div className="content-width home-hero-content"><div className="hero-copy"><span className="eyebrow light-label" data-hero-reveal>WELCOME TO SOLARA RESORT</span><h1 data-hero-reveal>A slower kind of <em>extraordinary.</em></h1><p data-hero-reveal>Where the days unfold gently, the sea is always close, and every moment feels entirely your own.</p><div className="hero-actions" data-hero-reveal><ButtonLink to="/stays" light>Discover Solara</ButtonLink><TextLink to="/contact" light>Plan your stay</TextLink></div></div><div className="hero-foot"><span>AN ISLAND STATE OF MIND</span><span>SCROLL TO EXPLORE ↓</span></div></div>
    </section>

    <section className="section-pad intro-section"><div className="content-width intro-grid"><div data-reveal><span className="eyebrow">THE SOLARA WAY</span><h2 className="display-heading">Some places ask you to do more. <em>Here, you can just be.</em></h2></div><div className="intro-side" data-reveal><p>Wake to open skies. Follow the sound of the sea. Find beauty in the hours that belong to no one but you.</p><TextLink to="/about">The story behind Solara</TextLink></div></div></section>

    <section className="image-story content-width"><div className="image-story-main" data-reveal><ResponsiveImage src={images.suite} alt="Warm timber suite with a canopy bed opening to a sea-view terrace" loading="lazy" sizes="(max-width: 700px) 100vw, 65vw" /><span className="image-caption">01 / ROOM TO BREATHE</span></div><div className="image-story-side" data-reveal><ResponsiveImage src={images.pool} alt="Infinity pool overlooking palm trees and the ocean at sunset" loading="lazy" sizes="(max-width: 700px) 100vw, 28vw" /><p>Space for stillness.<br/>Views worth lingering over.</p></div></section>

    <DiscoverCarousel />

    <section className="section-pad stays-preview"><div className="content-width"><div className="section-heading" data-reveal><div><span className="eyebrow">MAKE YOURSELF AT HOME</span><h2 className="display-heading">Stay close to <em>everything that matters.</em></h2></div><TextLink to="/stays">Explore the stays</TextLink></div><div className="stays-preview-grid"><div className="stay-feature" data-reveal><ResponsiveImage src={images.suite} alt="Airy Solara suite with linen bedding and coastal outlook" loading="lazy" sizes="(max-width: 700px) 100vw, 50vw" /><div><span className="eyebrow">01 / ACCOMMODATIONS</span><h3>The Ocean Suite</h3><p>Soft mornings, open doors, and the sea just beyond.</p></div></div><div className="stay-feature stay-feature-offset" data-reveal><ResponsiveImage src={images.villa} alt="Private Solara villa and pool above a tropical cove" loading="lazy" sizes="(max-width: 700px) 100vw, 50vw" /><div><span className="eyebrow">02 / ACCOMMODATIONS</span><h3>The Pool Villa</h3><p>A secluded rhythm with room to stay a little longer.</p></div></div></div></div></section>

    <section className="experience-banner"><ResponsiveImage src={images.dining} alt="Open-air dining terrace glowing at sunset beside the sea" loading="lazy" sizes="100vw" /><div className="experience-banner-shade"/><div className="content-width experience-banner-copy" data-reveal><span className="eyebrow light-label">BEYOND YOUR ROOM</span><h2>Every day,<br/><em>your own story.</em></h2><p>From quiet mornings by the water to evenings made for sharing.</p><ButtonLink to="/experiences" light>Explore experiences</ButtonLink></div></section>
    <Testimonials />
    <BookingCallout />
  </main>
}

function Stays() {
  return <main data-title="Stays">
    <PageIntro label="REST COMES NATURALLY" title="Space to" italic="settle in." copy="Considered rooms, open horizons, and all the little comforts that make a place feel like yours." image={images.suite} alt="Sunlit tropical resort suite with canopy bed and sea-view terrace" />
    <section className="section-pad"><div className="content-width"><div className="center-heading" data-reveal><span className="eyebrow">OUR ACCOMMODATIONS</span><h2 className="display-heading">Made for your <em>kind of escape.</em></h2><p>Each ocean suite and private pool villa is imagined as a place to reconnect with the simple pleasures of island life.</p></div><div className="stay-list"><article className="stay-row" data-reveal><div className="stay-row-image"><ResponsiveImage src={images.suite} alt="Ocean Suite bedroom opening onto a tropical sea-view terrace" loading="lazy" sizes="(max-width: 700px) 100vw, 55vw" /></div><div className="stay-row-copy"><span className="eyebrow">01 / THE OCEAN SUITE</span><h3>A room with room<br/>to <em>dream.</em></h3><p>Natural textures, generous light, and a terrace that brings the horizon a little closer.</p><ul><li>King bed and lounge area</li><li>Private sea-view terrace</li><li>Indoor-outdoor living</li></ul><TextLink to="/contact">Inquire about the Ocean Suite</TextLink></div></article><article className="stay-row stay-row-reverse" data-reveal><div className="stay-row-image"><ResponsiveImage src={images.villa} alt="Private Pool Villa with terrace and plunge pool facing the sea" loading="lazy" sizes="(max-width: 700px) 100vw, 55vw" /></div><div className="stay-row-copy"><span className="eyebrow">02 / THE POOL VILLA</span><h3>Your own little<br/><em>world.</em></h3><p>A secluded retreat made for long afternoons, unplanned moments, and uninterrupted views.</p><ul><li>Private pool terrace</li><li>Spacious indoor-outdoor setting</li><li>Ocean outlook</li></ul><TextLink to="/contact">Inquire about the Pool Villa</TextLink></div></article></div></div></section>
    <BookingCallout title="The best days start here." />
  </main>
}

function Experiences() {
  return <main data-title="Experiences">
    <PageIntro label="DAYS AT SOLARA" title="Follow your" italic="own rhythm." copy="Seek a little adventure, settle into the stillness, or let the day surprise you." image={images.pool} alt="Infinity pool looking out to palms and a calm tropical sea" />
    <section className="section-pad"><div className="content-width"><div className="center-heading" data-reveal><span className="eyebrow">MAKE EACH MOMENT YOURS</span><h2 className="display-heading">The pleasure of <em>being here.</em></h2><p>Beach time, open-air wellness, tropical breakfasts, and seaside dining set the pace.</p></div><div className="experience-list"><article className="experience-card" data-reveal><ResponsiveImage src={images.beach} alt="Quiet turquoise cove and tropical beach" loading="lazy" sizes="(max-width: 700px) 100vw, 50vw"/><span className="eyebrow">01 / OPEN WATER</span><h3>Meet the sea</h3><p>Find your own pace along the shore, with the horizon as your only agenda.</p></article><article className="experience-card" data-reveal><ResponsiveImage src={images.spa} alt="Open-air spa pavilion overlooking the sea" loading="lazy" sizes="(max-width: 700px) 100vw, 50vw"/><span className="eyebrow">02 / WELLNESS</span><h3>Time to restore</h3><p>Let the island's gentler rhythm guide a little time for yourself.</p></article><article className="experience-card" data-reveal><ResponsiveImage src={images.breakfast} alt="Fresh breakfast on a sea-view terrace" loading="lazy" sizes="(max-width: 700px) 100vw, 50vw"/><span className="eyebrow">03 / SLOW MORNINGS</span><h3>Breakfast with a view</h3><p>Ease into the day with fresh flavors and an open horizon.</p></article><article className="experience-card" data-reveal><ResponsiveImage src={images.dining} alt="Warmly lit seaside restaurant at sunset" loading="lazy" sizes="(max-width: 700px) 100vw, 50vw"/><span className="eyebrow">04 / GATHER & TASTE</span><h3>Evenings to savor</h3><p>Come together over thoughtful flavors, warm light, and conversation that lingers.</p></article></div></div></section>
    <section className="quote-section"><div className="content-width" data-reveal><SunMark/><p>“The most memorable moments are often the ones you never planned.”</p><span className="eyebrow">THE SOLARA WAY</span></div></section>
    <BookingCallout title="Make room for more moments." />
  </main>
}

function About() {
  return <main data-title="Our story">
    <PageIntro label="OUR STORY" title="A place to" italic="feel present." copy="Solara began with a simple idea: that the best kind of luxury gives you room to slow down." image={images.coast} alt="Secluded tropical resort and turquoise cove beneath the sunrise" />
    <section className="section-pad"><div className="content-width about-story"><div data-reveal><span className="eyebrow">A DIFFERENT PACE</span><h2 className="display-heading">The beauty is in <em>the little things.</em></h2></div><div data-reveal><p>We imagined Solara as a place where mornings start softly and every detail invites you to linger. Warm materials, open spaces, and the easy presence of the sea shape a retreat that feels both special and wonderfully familiar.</p><p>Here, a meaningful stay is measured less by what you do and more by how you feel when you leave.</p></div></div></section>
    <section className="about-image"><ResponsiveImage src={images.pool} alt="Calm infinity pool looking out across tropical palms to the sea" loading="lazy" sizes="100vw" /></section>
    <section className="section-pad values-section"><div className="content-width"><div className="center-heading" data-reveal><span className="eyebrow">WHAT GUIDES US</span><h2 className="display-heading">Thoughtful by <em>nature.</em></h2></div><div className="values-grid"><article data-reveal><span>01</span><h3>Room to breathe</h3><p>Open spaces and a gentler pace let you settle into the moment.</p></article><article data-reveal><span>02</span><h3>Made with care</h3><p>Every detail is chosen to feel warm, simple, and at ease.</p></article><article data-reveal><span>03</span><h3>Connected to place</h3><p>The sea, the light, and the landscape are always part of the experience.</p></article></div></div></section>
    <BookingCallout title="Come find your slower days." />
  </main>
}

function Contact() {
  const form = useRef(null)
  const [error, setError] = useState('')
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [guestCount, setGuestCount] = useState('2')
  const [openPicker, setOpenPicker] = useState(null)
  const today = isoDate(new Date())

  function changeArrival(date) {
    setArrival(date)
    if (departure && departure <= date) setDeparture('')
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!arrival || !departure) {
      setError('Choose both arrival and departure dates.')
      document.getElementById(`${arrival ? 'departure' : 'arrival'}-picker`)?.focus()
      return
    }
    if (departure <= arrival) {
      setError('Departure must be after your arrival date.')
      document.getElementById('departure-picker')?.focus()
      return
    }
    setError('')
    trackInquiry()
    window.location.href = createInquiryEmail({ ...Object.fromEntries(new FormData(form.current)), arrival, departure, guests: guestCount })
  }

  return <main data-title="Contact">
    <section className="contact-top"><div className="content-width contact-top-grid"><div data-hero-reveal><span className="eyebrow light-label">BEGIN YOUR ESCAPE</span><h1>Let's make room for <em>you.</em></h1><p>Tell us whether your imagined tropical resort stay begins with an ocean suite or a private pool villa.</p></div><div className="contact-top-image" data-hero-reveal><ResponsiveImage src={images.dining} alt="Peaceful seaside dining terrace at sunset" fetchPriority="high" sizes="(max-width: 700px) 100vw, 45vw" /></div></div></section>
    <section className="section-pad contact-section"><div className="content-width contact-grid"><div className="contact-aside" data-reveal><span className="eyebrow">YOUR INQUIRY</span><h2 className="display-heading">The first step to <em>getting away.</em></h2><p>This is a concept website. The form prepares an email in your own mail app; it does not submit a reservation. Add a recipient yourself if you want to send it.</p><div className="contact-aside-rule"><span>TAKE YOUR TIME</span><p>The best stays begin with a little dreaming.</p></div></div><form ref={form} className="inquiry-form" onSubmit={handleSubmit} data-reveal><div className="form-heading"><span className="eyebrow">STAY INQUIRY</span><p>Share your plans below.</p></div><div className="form-row"><label>Full name<input name="name" type="text" autoComplete="name" required placeholder="Your name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label></div><div className="form-row"><DatePicker id="arrival" label="Arrival date" value={arrival} min={today} open={openPicker === 'arrival'} onOpen={() => setOpenPicker('arrival')} onClose={() => setOpenPicker(null)} onChange={changeArrival} /><DatePicker id="departure" label="Departure date" value={departure} min={arrival ? nextDate(arrival) : today} open={openPicker === 'departure'} onOpen={() => setOpenPicker('departure')} onClose={() => setOpenPicker(null)} onChange={(date) => { setDeparture(date); setError('') }} /></div><GuestDropdown value={guestCount} open={openPicker === 'guests'} onOpen={() => setOpenPicker('guests')} onClose={() => setOpenPicker(null)} onChange={setGuestCount} /><label>Anything else we should know?<textarea name="message" rows="5" placeholder="A little about your ideal stay..." /></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="button" type="submit">Prepare email <Arrow diagonal /></button><p className="form-note">Demo only — no reservation is sent or stored.</p></form></div></section>
  </main>
}

function NotFound() {
  return <main className="not-found content-width" data-title="Page not found"><span className="eyebrow">404 / LOST AT SEA</span><h1>This page has drifted away.</h1><p>Let's take you back to familiar shores.</p><ButtonLink to="/">Return home</ButtonLink></main>
}

export function App() {
  return <><RouteSeo/><AnalyticsTracker/><SiteMotion/><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/stays" element={<Stays/>}/><Route path="/experiences" element={<Experiences/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/><AnalyticsConsent/></>
}
