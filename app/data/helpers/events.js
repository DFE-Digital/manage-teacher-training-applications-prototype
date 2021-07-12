const { DateTime } = require('luxon')

exports.saveEvent = (application, event) => {
  if (!application || !event) {
    return null
  }

  const date = DateTime.now().toJSDate()
  const events = application.events

  const assignedUsers = event.assignedUsers
    .sort((a, b) => a.firstName.localeCompare(b.firstName)
      || a.lastName.localeCompare(b.lastName)
      || a.emailAddress.localeCompare(b.emailAddress))

  events.items.push({
    title: event.title,
    user: event.user,
    assignedUsers,
    date
  })
}