import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createInquiryEmail } from './booking.js'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const images = {
  coast: '/images/coast.webp',
  suite: '/images/suite.webp',
  pool: '/images/pool.webp',
  dining: '/images/dining.webp',
}

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
  return <svg className="sun-mark" viewBox="0 0 52 52" fill="none" aria-hidden="true"><circle cx="26" cy="26" r="8" stroke="currentColor" strokeWidth="1.35"/><circle cx="26" cy="26" r="17" stroke="currentColor" strokeWidth="1.1"/><path d="M26 1v7M26 44v7M1 26h7M44 26h7M8.3 8.3l5 5M38.7 38.7l5 5M43.7 8.3l-5 5M13.3 38.7l-5 5" stroke="currentColor" strokeWidth="1.1"/></svg>
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setMenuOpen(false), [pathname])

  return <header className={`site-header ${pathname === '/' ? 'site-header-home' : ''}`}>
    <div className="header-inner content-width">
      <Link to="/" className="brand" aria-label="Solara Resort home"><SunMark /><span><strong>SOLARA</strong><small>RESORT</small></span></Link>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
      <nav id="primary-navigation" className={menuOpen ? 'nav-open' : ''} aria-label="Primary navigation">
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
      <div className="footer-links"><div><span className="eyebrow light-label">EXPLORE</span><Link to="/stays">Stays</Link><Link to="/experiences">Experiences</Link><Link to="/about">Our story</Link><Link to="/contact">Contact</Link></div><div><span className="eyebrow light-label">SOLARA RESORT</span><p>A fictional tropical escape,<br/>created to inspire the art<br/>of slowing down.</p></div></div>
    </div>
    <div className="content-width footer-bottom"><span>© {new Date().getFullYear()} Solara Resort</span><span>Concept resort · Images are illustrative</span><Link to="/">Back to top ↑</Link></div>
  </footer>
}

function SiteMotion() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${document.querySelector('main')?.dataset.title || 'Solara Resort'} — Solara Resort`
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.from('[data-hero-reveal]', { y: 35, opacity: 0, duration: 1, ease: 'power2.out', stagger: 0.12, delay: 0.14 })
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, { y: 34, opacity: 0, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
      })
    })
    return () => { context.revert(); ScrollTrigger.getAll().forEach(trigger => trigger.kill()) }
  }, [pathname])
  return null
}

function PageIntro({ label, title, italic, copy, image, alt, className = '' }) {
  return <section className={`page-intro ${className}`}>
    <div className="page-intro-copy"><span className="eyebrow" data-hero-reveal>{label}</span><h1 data-hero-reveal>{title} <em>{italic}</em></h1><p data-hero-reveal>{copy}</p></div>
    <div className="page-intro-image" data-hero-reveal><img src={image} alt={alt} fetchPriority="high" /></div>
  </section>
}

function BookingCallout({ title = 'Your time away is waiting.' }) {
  return <section className="booking-callout"><div className="content-width booking-callout-inner"><div data-reveal><span className="eyebrow light-label">THE NEXT CHAPTER</span><h2>{title}</h2></div><ButtonLink to="/contact" light>Start an inquiry</ButtonLink></div></section>
}

function Home() {
  return <main data-title="A slower kind of extraordinary">
    <section className="home-hero">
      <img className="home-hero-image" src={images.coast} alt="Tropical coastline with villas among palms above a turquoise cove" fetchPriority="high" />
      <div className="home-hero-shade" />
      <div className="content-width home-hero-content"><div className="hero-copy"><span className="eyebrow light-label" data-hero-reveal>WELCOME TO SOLARA RESORT</span><h1 data-hero-reveal>A slower kind of <em>extraordinary.</em></h1><p data-hero-reveal>Where the days unfold gently, the sea is always close, and every moment feels entirely your own.</p><div className="hero-actions" data-hero-reveal><ButtonLink to="/stays" light>Discover Solara</ButtonLink><TextLink to="/contact" light>Plan your stay</TextLink></div></div><div className="hero-foot"><span>AN ISLAND STATE OF MIND</span><span>SCROLL TO EXPLORE ↓</span></div></div>
    </section>

    <section className="section-pad intro-section"><div className="content-width intro-grid"><div data-reveal><span className="eyebrow">THE SOLARA WAY</span><h2 className="display-heading">Some places ask you to do more. <em>Here, you can just be.</em></h2></div><div className="intro-side" data-reveal><p>Wake to open skies. Follow the sound of the sea. Find beauty in the hours that belong to no one but you.</p><TextLink to="/about">The story behind Solara</TextLink></div></div></section>

    <section className="image-story content-width"><div className="image-story-main" data-reveal><img src={images.suite} alt="Warm timber suite with a canopy bed opening to a sea-view terrace" loading="lazy" /><span className="image-caption">01 / ROOM TO BREATHE</span></div><div className="image-story-side" data-reveal><img src={images.pool} alt="Infinity pool overlooking palm trees and the ocean at sunset" loading="lazy" /><p>Space for stillness.<br/>Views worth lingering over.</p></div></section>

    <section className="section-pad stays-preview"><div className="content-width"><div className="section-heading" data-reveal><div><span className="eyebrow">MAKE YOURSELF AT HOME</span><h2 className="display-heading">Stay close to <em>everything that matters.</em></h2></div><TextLink to="/stays">Explore the stays</TextLink></div><div className="stays-preview-grid"><div className="stay-feature" data-reveal><img src={images.suite} alt="Airy Solara suite with linen bedding and coastal outlook" loading="lazy" /><div><span className="eyebrow">01 / ACCOMMODATIONS</span><h3>The Ocean Suite</h3><p>Soft mornings, open doors, and the sea just beyond.</p></div></div><div className="stay-feature stay-feature-offset" data-reveal><img src={images.pool} alt="Private-feeling pool terrace with coastal views" loading="lazy" /><div><span className="eyebrow">02 / ACCOMMODATIONS</span><h3>The Pool Villa</h3><p>A secluded rhythm with room to stay a little longer.</p></div></div></div></div></section>

    <section className="experience-banner"><img src={images.dining} alt="Open-air dining terrace glowing at sunset beside the sea" loading="lazy" /><div className="experience-banner-shade"/><div className="content-width experience-banner-copy" data-reveal><span className="eyebrow light-label">BEYOND YOUR ROOM</span><h2>Every day,<br/><em>your own story.</em></h2><p>From quiet mornings by the water to evenings made for sharing.</p><ButtonLink to="/experiences" light>Explore experiences</ButtonLink></div></section>
    <BookingCallout />
  </main>
}

function Stays() {
  return <main data-title="Stays">
    <PageIntro label="REST COMES NATURALLY" title="Space to" italic="settle in." copy="Considered rooms, open horizons, and all the little comforts that make a place feel like yours." image={images.suite} alt="Sunlit tropical resort suite with canopy bed and sea-view terrace" />
    <section className="section-pad"><div className="content-width"><div className="center-heading" data-reveal><span className="eyebrow">OUR ACCOMMODATIONS</span><h2 className="display-heading">Made for your <em>kind of escape.</em></h2><p>Each stay is imagined as a private place to reconnect with the simple pleasures of island life.</p></div><div className="stay-list"><article className="stay-row" data-reveal><div className="stay-row-image"><img src={images.suite} alt="Ocean Suite bedroom opening onto a tropical sea-view terrace" loading="lazy" /></div><div className="stay-row-copy"><span className="eyebrow">01 / THE OCEAN SUITE</span><h3>A room with room<br/>to <em>dream.</em></h3><p>Natural textures, generous light, and a terrace that brings the horizon a little closer.</p><ul><li>King bed and lounge area</li><li>Private sea-view terrace</li><li>Indoor-outdoor living</li></ul><TextLink to="/contact">Inquire about this stay</TextLink></div></article><article className="stay-row stay-row-reverse" data-reveal><div className="stay-row-image"><img src={images.pool} alt="Pool Villa concept with terrace and infinity pool facing the sea" loading="lazy" /></div><div className="stay-row-copy"><span className="eyebrow">02 / THE POOL VILLA</span><h3>Your own little<br/><em>world.</em></h3><p>A secluded retreat made for long afternoons, unplanned moments, and uninterrupted views.</p><ul><li>Private pool terrace</li><li>Spacious indoor-outdoor setting</li><li>Ocean outlook</li></ul><TextLink to="/contact">Inquire about this stay</TextLink></div></article></div></div></section>
    <BookingCallout title="The best days start here." />
  </main>
}

function Experiences() {
  return <main data-title="Experiences">
    <PageIntro label="DAYS AT SOLARA" title="Follow your" italic="own rhythm." copy="Seek a little adventure, settle into the stillness, or let the day surprise you." image={images.pool} alt="Infinity pool looking out to palms and a calm tropical sea" />
    <section className="section-pad"><div className="content-width"><div className="center-heading" data-reveal><span className="eyebrow">MAKE EACH MOMENT YOURS</span><h2 className="display-heading">The pleasure of <em>being here.</em></h2></div><div className="experience-list"><article className="experience-card" data-reveal><img src={images.pool} alt="Sunlit infinity pool above a tropical shoreline" loading="lazy"/><span className="eyebrow">01 / SLOW DAYS</span><h3>Poolside, on your time</h3><p>Take the long way through the afternoon. There is nowhere else you need to be.</p></article><article className="experience-card" data-reveal><img src={images.coast} alt="Quiet turquoise cove and tropical coastline" loading="lazy"/><span className="eyebrow">02 / OPEN WATER</span><h3>Meet the sea</h3><p>Find your own pace along the shore, with the horizon as your only agenda.</p></article><article className="experience-card" data-reveal><img src={images.dining} alt="Warmly lit seaside restaurant at sunset" loading="lazy"/><span className="eyebrow">03 / GATHER & TASTE</span><h3>Evenings to savor</h3><p>Come together over thoughtful flavors, warm light, and conversation that lingers.</p></article></div></div></section>
    <section className="quote-section"><div className="content-width" data-reveal><SunMark/><p>“The most memorable moments are often the ones you never planned.”</p><span className="eyebrow">THE SOLARA WAY</span></div></section>
    <BookingCallout title="Make room for more moments." />
  </main>
}

function About() {
  return <main data-title="Our story">
    <PageIntro label="OUR STORY" title="A place to" italic="feel present." copy="Solara began with a simple idea: that the best kind of luxury gives you room to slow down." image={images.coast} alt="Secluded tropical resort and turquoise cove beneath the sunrise" />
    <section className="section-pad"><div className="content-width about-story"><div data-reveal><span className="eyebrow">A DIFFERENT PACE</span><h2 className="display-heading">The beauty is in <em>the little things.</em></h2></div><div data-reveal><p>We imagined Solara as a place where mornings start softly and every detail invites you to linger. Warm materials, open spaces, and the easy presence of the sea shape a retreat that feels both special and wonderfully familiar.</p><p>Here, a meaningful stay is measured less by what you do and more by how you feel when you leave.</p></div></div></section>
    <section className="about-image"><img src={images.pool} alt="Calm infinity pool looking out across tropical palms to the sea" loading="lazy" /></section>
    <section className="section-pad values-section"><div className="content-width"><div className="center-heading" data-reveal><span className="eyebrow">WHAT GUIDES US</span><h2 className="display-heading">Thoughtful by <em>nature.</em></h2></div><div className="values-grid"><article data-reveal><span>01</span><h3>Room to breathe</h3><p>Open spaces and a gentler pace let you settle into the moment.</p></article><article data-reveal><span>02</span><h3>Made with care</h3><p>Every detail is chosen to feel warm, simple, and at ease.</p></article><article data-reveal><span>03</span><h3>Connected to place</h3><p>The sea, the light, and the landscape are always part of the experience.</p></article></div></div></section>
    <BookingCallout title="Come find your slower days." />
  </main>
}

function Contact() {
  const form = useRef(null)
  const [error, setError] = useState('')
  const localToday = new Date()
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset())
  const today = localToday.toISOString().slice(0, 10)

  function handleSubmit(event) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(form.current))
    if (data.departure <= data.arrival) {
      setError('Departure must be after your arrival date.')
      form.current.elements.departure.focus()
      return
    }
    setError('')
    window.location.href = createInquiryEmail(data)
  }

  return <main data-title="Contact">
    <section className="contact-top"><div className="content-width contact-top-grid"><div data-hero-reveal><span className="eyebrow light-label">BEGIN YOUR ESCAPE</span><h1>Let's make room for <em>you.</em></h1><p>Tell us a little about the stay you have in mind. Your slower days start with a simple hello.</p></div><div className="contact-top-image" data-hero-reveal><img src={images.dining} alt="Peaceful seaside dining terrace at sunset" fetchPriority="high" /></div></div></section>
    <section className="section-pad contact-section"><div className="content-width contact-grid"><div className="contact-aside" data-reveal><span className="eyebrow">YOUR INQUIRY</span><h2 className="display-heading">The first step to <em>getting away.</em></h2><p>This is a concept website. The form prepares an email in your own mail app; it does not submit a reservation. Add a recipient yourself if you want to send it.</p><div className="contact-aside-rule"><span>TAKE YOUR TIME</span><p>The best stays begin with a little dreaming.</p></div></div><form ref={form} className="inquiry-form" onSubmit={handleSubmit} data-reveal><div className="form-heading"><span className="eyebrow">STAY INQUIRY</span><p>Share your plans below.</p></div><div className="form-row"><label>Full name<input name="name" type="text" autoComplete="name" required placeholder="Your name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label></div><div className="form-row"><label>Arrival date<input name="arrival" type="date" min={today} required onChange={() => setError('')} /></label><label>Departure date<input name="departure" type="date" min={today} required onChange={() => setError('')} /></label></div><label>Guests<select name="guests" defaultValue="2" required><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5+">5+ guests</option></select></label><label>Anything else we should know?<textarea name="message" rows="5" placeholder="A little about your ideal stay..." /></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="button" type="submit">Prepare email <Arrow diagonal /></button><p className="form-note">Demo only — no reservation is sent or stored.</p></form></div></section>
  </main>
}

function NotFound() {
  return <main className="not-found content-width" data-title="Page not found"><span className="eyebrow">404 / LOST AT SEA</span><h1>This page has drifted away.</h1><p>Let's take you back to familiar shores.</p><ButtonLink to="/">Return home</ButtonLink></main>
}

function App() {
  return <BrowserRouter><SiteMotion/><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/stays" element={<Stays/>}/><Route path="/experiences" element={<Experiences/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/></BrowserRouter>
}

createRoot(document.getElementById('root')).render(<App />)
