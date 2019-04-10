yaml = require('js-yaml')
fs = require('fs')

// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('./amp-conf.yaml', 'utf8'))

  const date = new Date()
  const dateString = `${date.getHours()}:${date.getMinutes()}`
  console.log(dateString)
  console.log(Date.parse('22:30'))

  const day1 = {
    id: 'day1',
    title: 'Day 1',
    sessions: []
  }
  const day2 = {
    id: 'day2',
    title: 'Day 2',
    sessions: []
  }
  const days = [day1, day2]
  const agenda = {
    days
  }

  day1.sessions = addSessions(
    doc.agenda.day_1,
    doc.speakers,
    new Date(2019, 3, 17)
  )
  day2.sessions = addSessions(
    doc.agenda.day_2,
    doc.speakers,
    new Date(2019, 3, 18)
  )

  fs.writeFileSync(
    './lib/agenda.json',
    JSON.stringify(agenda, null, 2),
    'utf-8'
  )
} catch (e) {
  console.log(e)
}

function addSessions(agenda, speakers, date) {
  const result = []

  for (const session of agenda) {
    date.setHours(session.time.substring(0, 2), session.time.substring(2, 2))
    console.log(date)
    const s = {
      title: session.title,
      description: session.description,
      speakers: formatSpeakers(speakers, session.speakers),
      time: session.time,
      date: date.toUTCString() //
    }
    console.log(s)
    result.push(s)
  }
  return result
}

function formatSpeakers(speakers, sessionSpeakers) {
  if (!sessionSpeakers) {
    return ''
  }

  speakers = sessionSpeakers.filter(s => s !== 'tba').map(s => speakers[s])
  speakers = speakers.map(s => `${s.name}, ${s.company}`)
  return speakers.join('<br>')
}
