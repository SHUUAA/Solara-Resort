const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
const CONSENT_KEY = 'solara_analytics_consent'

export function analyticsAvailable() {
  return Boolean(MEASUREMENT_ID && /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID))
}

export function getAnalyticsConsent() {
  if (!analyticsAvailable() || typeof window === 'undefined') return null
  return window.localStorage.getItem(CONSENT_KEY)
}

export function setAnalyticsConsent(value) {
  if (!analyticsAvailable()) return
  window.localStorage.setItem(CONSENT_KEY, value)
  window.dispatchEvent(new CustomEvent('solara:analytics-consent', { detail: value }))
}

export function openAnalyticsSettings() {
  window.dispatchEvent(new Event('solara:analytics-open'))
}

export function loadAnalytics() {
  if (!analyticsAvailable() || getAnalyticsConsent() !== 'accepted' || typeof window === 'undefined') return false
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true })
  }
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"]`)) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
    document.head.appendChild(script)
  }
  return true
}

export function trackPageView(path) {
  if (!loadAnalytics()) return
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: `${window.location.origin}${path}`,
    page_path: path,
  })
}

export function trackInquiry() {
  if (!loadAnalytics()) return
  window.gtag('event', 'generate_lead', { method: 'email_inquiry' })
}
