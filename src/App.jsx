import { useState, useEffect } from 'react'
import './App.css'

const fallbackTimezones = [
  'Africa/Nairobi',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

const timezones = (
  typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : fallbackTimezones
).map((zone) => ({
  zone,
  label: zone.replaceAll('_', ' ').replace('/', ' / '),
}))

function getTimeParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h12',
  }).formatToParts(date)

  return Object.fromEntries(parts.map(({ type, value }) => [type, value]))
}

function getDateLabel(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function App() {
  const [now, setNow] = useState(new Date())
  const [timeZone, setTimeZone] = useState('Africa/Nairobi')

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timerId)
  }, [])

  const timeParts = getTimeParts(now, timeZone)
  const secondProgress = (Number(timeParts.second) / 60) * 100
  const hue = Math.round((Number(timeParts.second) / 60) * 360)
  const selectedTimezone = timezones.find(({ zone }) => zone === timeZone) ?? {
    label: timeZone,
  }

  return (
    <div
      className="clock-container"
      style={{ '--accent-hue': hue }}
    >
      <main className="clock-shell">
        <header className="clock-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <span>Chronos</span>
          </div>
          <div className="live-indicator">
            <span className="live-dot" />
            Live now
          </div>
        </header>

        <section className="clock-card" aria-label="Current time">
          <div className="card-glow" aria-hidden="true" />
          <div className="timezone-picker">
            <label htmlFor="timezone">Time zone</label>
            <select
              id="timezone"
              value={timeZone}
              onChange={(event) => setTimeZone(event.target.value)}
            >
              {timezones.map(({ label, zone }) => (
                <option key={zone} value={zone}>{label}</option>
              ))}
            </select>
          </div>
          <p className="eyebrow">{selectedTimezone.label}</p>
          <div className="time-row">
            <h1 className="time">{timeParts.hour}:{timeParts.minute}</h1>
            <span className="seconds">:{timeParts.second}</span>
            <span className="period">{timeParts.dayPeriod}</span>
          </div>
          <p className="date">{getDateLabel(now, timeZone)}</p>
          <div className="second-track" aria-hidden="true">
            <span style={{ width: `${secondProgress}%` }} />
          </div>
          <div className="card-footer">
            <span>Second {timeParts.second} of 60</span>
            <span className="timezone">{timeZone}</span>
          </div>
        </section>

        <footer className="clock-footer">
          <span>Every moment matters</span>
          <span className="footer-line" />
          <span>{new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'short',
          }).formatToParts(now).find(({ type }) => type === 'timeZoneName')?.value}</span>
        </footer>
      </main>
    </div>
  )
}

export default App