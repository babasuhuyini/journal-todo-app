import { addDays, formatDayHeading, getMood, parseDateKey, toDateKey } from '../../lib/journal.js'

export default function MoodTrend({ entries, days = 14 }) {
  const today = toDateKey()

  const moodsByDay = new Map()
  for (const entry of entries) {
    if (!entry.mood) continue
    if (!moodsByDay.has(entry.date)) moodsByDay.set(entry.date, [])
    moodsByDay.get(entry.date).push(entry.mood)
  }

  const columns = Array.from({ length: days }, (_, i) => {
    const key = addDays(today, i - days + 1)
    const moods = moodsByDay.get(key)
    const avg = moods ? moods.reduce((a, b) => a + b, 0) / moods.length : null
    return { key, avg }
  })

  const logged = columns.filter((c) => c.avg != null)
  const overall = logged.length
    ? getMood(Math.round(logged.reduce((a, c) => a + c.avg, 0) / logged.length))
    : null

  return (
    <div className="trend">
      <div className="trend-head">
        <span className="trend-title">Mood · {days} days</span>
        {overall && (
          <span>
            {overall.emoji} Mostly {overall.label.toLowerCase()}
          </span>
        )}
      </div>
      <div className="trend-bars" style={{ gridTemplateColumns: `repeat(${days}, 1fr)` }}>
        {columns.map(({ key, avg }) => {
          const mood = avg ? getMood(Math.round(avg)) : null
          return (
            <div
              key={key}
              className="trend-col"
              title={`${formatDayHeading(key)}: ${mood ? mood.label : 'no mood logged'}`}
            >
              <div className="trend-track">
                <div
                  className={mood ? 'trend-bar' : 'trend-bar empty'}
                  data-mood={mood?.value ?? 0}
                  style={mood ? { height: `${(avg / 5) * 100}%` } : undefined}
                />
              </div>
              <span className={key === today ? 'trend-day today' : 'trend-day'}>
                {parseDateKey(key).toLocaleDateString(undefined, { weekday: 'narrow' })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
