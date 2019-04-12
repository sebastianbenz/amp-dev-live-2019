const label = document.getElementById('active-session')
label.textContent = 'Loading...'
document.body.appendChild(label)

const loadActiveSession = async () => {
  const res = await fetch('http://localhost:8080/js/sessions.json')
  const sessions = await res.json()

  const currentTime = new Date()
  currentTime.setHours(currentTime.getHours() - 12)
  const activeSession = sessions.find(session => {
    const start = Date.parse(session.start)
    const end = Date.parse(session.end)
    return currentTime >= start && currentTime <= end
  })
  label.textContent =
    'LIVE: ' + (activeSession ? activeSession.title : 'no active session')
}

loadActiveSession()

setInterval(loadActiveSession, 1000 * 15)
