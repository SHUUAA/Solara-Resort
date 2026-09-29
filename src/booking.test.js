import assert from 'node:assert/strict'
import test from 'node:test'
import { calendarDays, createInquiryEmail, nextDate } from './booking.js'

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

test('calendar handles leap days and departure dates across months', () => {
  const days = calendarDays(2028, 1)
  assert.equal(days.filter(Boolean).length, 29)
  assert.equal(days.at(-1), '2028-02-29')
  assert.equal(nextDate('2028-02-29'), '2028-03-01')
})
