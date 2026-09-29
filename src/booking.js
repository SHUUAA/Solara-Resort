export function createInquiryEmail({ name, email, arrival, departure, guests, message }) {
  const subject = `Solara Resort stay inquiry — ${arrival} to ${departure}`
  const body = [
    'Hello Solara Resort,',
    '',
    'I would like to inquire about a stay.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Arrival: ${arrival}`,
    `Departure: ${departure}`,
    `Guests: ${guests}`,
    `Message: ${message?.trim() || 'No additional notes.'}`,
    '',
    'Please let me know what is available.',
  ].join('\n')

  // Demo concept: leave the recipient blank until Solara has a real booking inbox.
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function nextDate(value) {
  const date = parseDate(value)
  date.setDate(date.getDate() + 1)
  return isoDate(date)
}

export function calendarDays(year, month) {
  const leading = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  return [...Array(leading).fill(null), ...Array.from({ length: days }, (_, index) => isoDate(new Date(year, month, index + 1)))]
}
