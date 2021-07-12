const { DateTime } = require('luxon')
const SystemHelper = require('./system')
const EventHelper = require('./events')

exports.getApplicationWithdrawnReasons = (data) => {
  return {
    // withdraw application
    'reason': data.reason,
    'has-reason': data['has-reason']
  }
}

exports.getRejectReasons = (data) => {
  return {
    // Candidate actions
    actions: data.actions,
    'actions-reasons': data['actions-reasons'],
    'actions-reasons-other': data['actions-reasons-other'],
    'actions-reasons-other-improve': data['actions-reasons-other-improve'],

    // Missing qualifications
    'missing-qualifications': data['missing-qualifications'],
    'missing-qualifications-reasons': data['missing-qualifications-reasons'],
    'missing-qualifications-reasons-other': data['missing-qualifications-reasons-other'],

    // Application quality
    'application-quality': data['application-quality'],
    'application-quality-reasons': data['application-quality-reasons'],
    'application-quality-reasons-other': data['application-quality-reasons-other'],
    'application-quality-reasons-other-improve': data['application-quality-reasons-other-improve'],
    'application-quality-reasons-subject-knowledge': data['application-quality-reasons-subject-knowledge'],
    'application-quality-reasons-personal-statement': data['application-quality-reasons-personal-statement'],

    // interview performance
    'interview-performance': data['interview-performance'],
    'interview-performance-advice': data['interview-performance-advice'],

    // Course full
    'course-full': data['course-full'],

    // Sponsor visa
    'sponsor-visa': data['sponsor-visa'],
    'sponsor-visa-details': data['sponsor-visa-details'],

    // Other offer
    'other-offer': data['other-offer'],
    'other-offer-details': data['other-offer-details'],

    // Honesty
    honesty: data.honesty,
    'honesty-reasons': data['honesty-reasons'],
    'honesty-reasons-false-information': data['honesty-reasons-false-information'],
    'honesty-reasons-plagiarism': data['honesty-reasons-plagiarism'],
    'honesty-reasons-reference-information': data['honesty-reasons-reference-information'],
    'honesty-reasons-other': data['honesty-reasons-other'],

    // Safeguarding
    safeguarding: data.safeguarding,
    'safeguarding-reasons': data['safeguarding-reasons'],
    'safeguarding-reasons-disclosed-information': data['safeguarding-reasons-disclosed-information'],
    'safeguarding-reasons-vetting-information': data['safeguarding-reasons-vetting-information'],
    'safeguarding-reasons-other': data['safeguarding-reasons-other'],

    // Another issue
    why: data.why,

    // Other feedback
    'other-feedback': data['other-feedback'],
    'other-feedback-details': data['other-feedback-details'],

    // withdraw application
    'asked': data.asked,
    'asked-reason': data['asked-reason']
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
  return this.getConditions(offer).filter(condition => condition.status === 'Pending').length === 0
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
    return DateTime.fromISO(interview.date) >= now;
  })
}

exports.cancelInterview = (params) => {
  params.application.events.items.push({
    title: "Interview cancelled",
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
