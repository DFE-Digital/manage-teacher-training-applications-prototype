const { DateTime } = require('luxon')
const SystemHelper = require('./system')
const EventHelper = require('./events')
const content = require('../content')

exports.getApplicationWithdrawnReasons = (data) => {
  return {
    // withdraw application
    'reason': data.reason,
    'has-reason': data['has-reason']
  }
}

exports.getRejectReasons = (data) => {
  return {

    // top level
    'categories': data.categories,

    // Qualifications
    'qualifications-reasons': data['qualifications-reasons'],
    'qualifications-reasons-degree-does-not-meet-course-requirements': data['qualifications-reasons-degree-does-not-meet-course-requirements'],
    'qualifications-reasons-could-not-verify-qualifications': data['qualifications-reasons-could-not-verify-qualifications'],
    'qualifications-reasons-other': data['qualifications-reasons-other'],

    // Personal statement
    'personal-statement-reasons': data['personal-statement-reasons'],
    'personal-statement-reasons-quality-of-writing': data['personal-statement-reasons-quality-of-writing'],
    'personal-statement-reasons-plagiarism': data['personal-statement-reasons-plagiarism'],
    'personal-statement-reasons-other': data['personal-statement-reasons-other'],

    // Teaching knowledge
    'teaching-knowledge-reasons': data['teaching-knowledge-reasons'],
    'teaching-knowledge-reasons-subject': data['teaching-knowledge-reasons-subject'],
    'teaching-knowledge-reasons-safeguarding': data['teaching-knowledge-reasons-safeguarding'],
    'teaching-knowledge-reasons-teaching-method': data['teaching-knowledge-reasons-teaching-method'],
    'teaching-knowledge-reasons-teaching-role': data['teaching-knowledge-reasons-teaching-role'],
    'teaching-knowledge-reasons-teaching-demonstration': data['teaching-knowledge-reasons-teaching-demonstration'],
    'teaching-knowledge-reasons-other': data['teaching-knowledge-reasons-other'],

    // Comms
    'communication-reasons': data['communication-reasons'],
    'communication-reasons-did-not-reply-to-messages': data['communication-reasons-did-not-reply-to-messages'],
    'communication-reasons-did-not-attend-interview': data['communication-reasons-did-not-attend-interview'],
    'communication-reasons-could-not-arrange-interview': data['communication-reasons-could-not-arrange-interview'],
    'communication-reasons-other': data['communication-reasons-other'],

    // References
    'references-reasons-details': data['references-reasons-details'],

    // Safeguarding
    'safeguarding-reasons-details': data['safeguarding-reasons-details'],

    // Visa sponsorship
    'sponsorship-reasons-details': data['sponsorship-reasons-details'],

    // Other
    'other-reasons-details': data['other-reasons-details'],

  }
}

exports.getConditions = (offer) => {
  const conditions = []
  if (offer && offer.standardConditions) {
    offer.standardConditions.forEach((item) => {
      conditions.push(item)
    })
  }
  if (offer && offer.conditions) {
    offer.conditions.forEach((item) => {
      conditions.push(item)
    })
  }
  return conditions
}

exports.hasPendingConditions = (offer) => {
  return this.getConditions(offer).some(c => c.status == "Pending")
}

exports.getCondition = (offer, conditionId) => {
  return this.getConditions(offer).find(condition => condition.id === conditionId)
}

exports.hasMetAllConditions = (offer) => {
  const conditions = this.getConditions(offer);
  const numberOfConditionsMet = conditions.filter(condition => condition.status === 'Met').length

  return numberOfConditionsMet === conditions.length
}

exports.deleteCondition = (application, conditionId) => {
  if(application.offer.standardConditions) {
    application.offer.standardConditions = application.offer.standardConditions.filter(c => c.id != conditionId)
  }
  if(application.offer.conditions) {
    application.offer.conditions = application.offer.conditions.filter(c => c.id != conditionId)
  }
}

exports.addEvent = (application, event) => {
  application.events.items.push(event)
}

exports.calculateDeclineDate = (application) => {
  return DateTime.fromISO(application.offer.madeDate).plus({ days: 10 }).toISO()
}

exports.calculateDaysToDecline = (application) => {
  if(application.status != 'Offered') {
    return null;
  }
  let now = SystemHelper.now();
  let diff = DateTime.fromISO(application.offer.declineByDate).diff(now, 'days').toObject().days
  diff = Math.round(diff)
  if (diff < 1) {
    diff = 0
  }
  return diff;
}

exports.getUpcomingInterviews = (application) => {
  let now = SystemHelper.now()

  return application.interviews.items.filter(interview => {
    return interview.date
  }).filter(interview => {
    return DateTime.fromISO(interview.date) >= now;
  })
}

exports.getExternalInterviews = (application) => {
  let now = SystemHelper.now()

  return application.interviews.items.filter(interview => {
    return !interview.date
  })
}

exports.cancelInterview = (params) => {
  params.application.events.items.push({
    title: content.cancelInterview.event.title,
    user: "Angela Mode",
    date: new Date().toISOString(),
    meta: {
      interview: params.application.interviews.items.find(item => item.id === params.interview.id),
      cancellationReason: params.cancellationReason
    }
  })

  params.application.interviews.items = params.application.interviews.items.filter(item => item.id !== params.interview.id)
}

exports.getAssignedUsers = (application, userId, userOrganisationId) => {
  if (!application || !userId || !userOrganisationId) {
    return null
  }

  let assignedUsers = []

  // get the assigned users for the user's current organisation
  if (application.assignedUsers && application.assignedUsers.length) {
    assignedUsers = application.assignedUsers.filter(user => user.organisation.id === userOrganisationId)
    assignedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))

    // get 'you' out of the assigned users
    const you = assignedUsers.find(user => user.id === userId)

    if (you) {
      you.you = true

      // remove 'you' from the assigned users
      assignedUsers = assignedUsers.filter(user => user.id !== userId)

      // put 'you' as the first person in the list of assigned users
      assignedUsers.splice(0, 0, you)
    }

  }

  return assignedUsers
}

exports.deleteAssignedUser = (applications, userId, user) => {
  if (!applications || !userId || !user) {
    return null
  }

  const apps = []

  applications.forEach((application, i) => {
    let app = {}
    app = application

    // remove the user from the list of assigned users
    app.assignedUsers = application.assignedUsers.filter(assignedUser => assignedUser.id !== userId)

    // save the activity to the log
    EventHelper.saveEvent(
      application = app,
      event = {
        title: 'Assigned users updated',
        user: user.firstName + ' ' + user.lastName,
        assignedUsers: app.assignedUsers
      }
    )

    apps.push(app)
  })

  return apps
}

exports.getAssignedApplicationCount = (applications, userId, userOrganisationId, statuses = [], isOnlyAssignedUser = false) => {
  let count = 0

  // get all the applications assigned to the user
  let assignedApplications = applications
    .filter(application => application.assignedUsers
      .find(user => user.id === userId)
    )

  if (statuses.length) {
    // get only the assigned applications for given statuses
    assignedApplications = assignedApplications
      .filter(application => statuses.includes(application.status))
  }

  if (isOnlyAssignedUser) {
    assignedApplications.forEach((application, i) => {
      // get only the assigned users in user's organisation
      const assignedUserCount = application.assignedUsers.filter(user => {
        return user.organisation.id === userOrganisationId
      }).length

      // if the user is the only one assigned in the application, increment count
      if (assignedUserCount === 1) {
        count += 1
      }
    })
  } else {
    count = assignedApplications.length
  }

  return count
}

exports.getOtherApplications = (application, applications) => {
  return applications
    .filter((app) => app.id != application.id)
    .filter((app) => app.contactDetails.email == application.contactDetails.email)
}
