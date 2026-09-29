import assert from 'node:assert/strict'
import test from 'node:test'
import { createInquiryEmail } from './booking.js'

test('booking email includes stay details without inventing a recipient', () => {
  const url = createInquiryEmail({
    name: 'Ari Santos',
    email: 'ari@example.com',
    arrival: '2027-01-10',
    departure: '2027-01-14',
    guests: '2',
    message: 'Ocean view, please',
  })

  assert.match(url, /^mailto:\?subject=/)
  assert.match(decodeURIComponent(url), /Arrival: 2027-01-10/)
  assert.match(decodeURIComponent(url), /Ocean view, please/)
})
