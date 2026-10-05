import { useEffect, useRef, useState } from 'react'
import { calendarDays, isoDate, parseDate } from './booking.js'

const guests = [
  ['1', '1 guest'],
  ['2', '2 guests'],
  ['3', '3 guests'],
  ['4', '4 guests'],
  ['5+', '5+ guests'],
]

function PickerIcon({ calendar = false }) {
  return <svg className={calendar ? 'picker-icon' : 'picker-chevron'} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {calendar ? <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M3.5 10h17M8 14h2M14 14h2M8 17h2" /></> : <path d="m7 10 5 5 5-5" />}
  </svg>
}

function useDismiss(ref, trigger, open, close) {
  useEffect(() => {
    if (!open) return
    const outside = (event) => { if (!ref.current?.contains(event.target)) close() }
    const escape = (event) => { if (event.key === 'Escape') { close(); trigger.current?.focus() } }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open, close, ref, trigger])
}

export function DatePicker({ id, label, value, min, open, onOpen, onClose, onChange }) {
  const root = useRef(null)
  const trigger = useRef(null)
  const [month, setMonth] = useState(() => parseDate(value || min))
  useDismiss(root, trigger, open, onClose)

  useEffect(() => { if (open) setMonth(parseDate(value || min)) }, [open, value, min])

  const monthName = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(month)
  const minMonth = parseDate(min)
  const canGoBack = month.getFullYear() > minMonth.getFullYear() || (month.getFullYear() === minMonth.getFullYear() && month.getMonth() > minMonth.getMonth())
  const display = value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(parseDate(value)) : 'Select date'

  return <div className="picker-field" ref={root}>
    <span className="field-label" id={`${id}-label`}>{label}</span>
    <button id={`${id}-picker`} ref={trigger} type="button" className={`picker-trigger ${value ? '' : 'picker-placeholder'}`} aria-label={`${label}: ${display}`} aria-expanded={open} aria-controls={`${id}-calendar`} onClick={open ? onClose : onOpen}><span>{display}</span><PickerIcon calendar /></button>
    {open && <div id={`${id}-calendar`} className="picker-panel calendar-panel" role="group" aria-label={`${label} calendar`}>
      <div className="calendar-header"><button type="button" aria-label="Previous month" disabled={!canGoBack} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><strong>{monthName}</strong><button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></div>
      <div className="calendar-grid">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span className="calendar-weekday" key={day}>{day}</span>)}{calendarDays(month.getFullYear(), month.getMonth()).map((day, index) => day ? <button key={day} type="button" disabled={day < min} className={day === value ? 'selected' : ''} aria-label={new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(parseDate(day))} aria-pressed={day === value} aria-current={day === isoDate(new Date()) ? 'date' : undefined} onClick={() => { onChange(day); onClose(); trigger.current?.focus() }}>{Number(day.slice(-2))}</button> : <span key={`blank-${index}`} />)}</div>
    </div>}
  </div>
}

export function GuestDropdown({ value, open, onOpen, onClose, onChange }) {
  const root = useRef(null)
  const trigger = useRef(null)
  useDismiss(root, trigger, open, onClose)
  const selected = guests.find(([option]) => option === value)?.[1]

  return <div className="picker-field guest-field" ref={root}>
    <span className="field-label" id="guests-label">Guests</span>
    <button id="guests-picker" ref={trigger} type="button" className="picker-trigger" aria-label={`Guests: ${selected}`} aria-expanded={open} aria-controls="guest-options" onClick={open ? onClose : onOpen}><span>{selected}</span><PickerIcon /></button>
    {open && <div id="guest-options" className="picker-panel guest-options" role="group" aria-label="Choose number of guests">{guests.map(([option, text]) => <button key={option} type="button" className={option === value ? 'selected' : ''} aria-pressed={option === value} onClick={() => { onChange(option); onClose(); trigger.current?.focus() }}>{text}</button>)}</div>}
  </div>
}
