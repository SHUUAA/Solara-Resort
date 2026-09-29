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
