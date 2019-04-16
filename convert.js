yaml = require('js-yaml')
fs = require('fs')

// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('./amp-conf.yaml', 'utf8'))

  const date = new Date()
  const dateString = `${date.getHours()}:${date.getMinutes()}`

  const day1 = {
    id: 'day1',
    title: 'Day 1',
    first: true,
    sessions: []
  }
  const day2 = {
    id: 'day2',
    title: 'Day 2',
    first: false,
    sessions: []
  }
  const days = [day1, day2]
  const agenda = {
    days
  }

  day1.sessions = addSessions(
    doc.agenda.day_1,
    doc.speakers,
    //new Date(2019, 3, 17)
    new Date()
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

  const sessions = day1.sessions.concat(day2.sessions)

  fs.writeFileSync(
    './public/js/sessions.json',
    JSON.stringify(sessions, null, 2),
    'utf-8'
  )
} catch (e) {
  console.log(e)
}

function addSessions(agenda, speakers, date) {
  const result = []

  for (const session of agenda) {
    const hours = session.time.substring(0, 2)
    date.setHours(hours)
    const minutes = session.time.substring(2)
    date.setMinutes(minutes)
    const endDate = new Date(date.getTime())
    endDate.setMinutes(endDate.getMinutes() + 30)
    const s = {
      title: session.title,
      description: session.description,
      speakers: formatSpeakers(speakers, session.speakers || (session.speaker ? [session.speaker] : [])),
      time: session.time,
      start: date.getTime(),
      end: endDate.getTime()
    }
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
