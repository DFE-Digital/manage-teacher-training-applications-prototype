const { DateTime } = require('luxon')

exports.saveEvent = (application, event) => {
  if (!application || !event) {
    return null
  }

  const date = DateTime.now().toJSDate()
  const events = application.events

  events.items.push({
    title: event.title,
    user: event.user,
    assignedUsers: event.assignedUsers,
    date
  })
}
