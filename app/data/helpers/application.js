const { DateTime } = require('luxon')
const SystemHelper = require('./system')

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

exports.deleteAssignedUser = (applications, userId) => {
  if (!applications || !userId) {
    return null
  }

  const apps = []

  applications.forEach((application, i) => {
    let app = {}
    app = application
    app.assignedUsers = application.assignedUsers.filter(assignedUser => assignedUser.id !== userId)
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

// -----------------------------------------------------------------------------
// Statistics
// -----------------------------------------------------------------------------

exports.getApplicationCountsBySubject = (applications) => {
  const subjects = SystemHelper.subjects
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getSubjectPerformance = (applications) => {
  const subjects = SystemHelper.subjects
  const counts = {}

  subjects.forEach((subject, i) => {
    counts[subject.name] = {}

    // Offer counts
    counts[subject.name]['Offers sent'] = applications.filter(application => application.offer !== null && application.subject === subject.name).length

    counts[subject.name]['Offers accepted'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Ready to enroll').length

    counts[subject.name]['Offers accepted'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Ready to enroll').length

    counts[subject.name]['Offers declined'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Declined').length

    counts[subject.name]['Offers deferred'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Deferred').length

    counts[subject.name]['Offers awaiting conditions'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Awaiting conditions').length

    // Application counts
    counts[subject.name]['Applications withdrawn'] = applications.filter(application => application.subject === subject.name && application.status === 'Withdrawn').length

    counts[subject.name]['Applications rejected before interview'] = applications.filter(application => application.subject === subject.name && application.status === 'Rejected' && application.interviews === undefined).length

    counts[subject.name]['Applications rejected after interview'] = applications.filter(application => application.subject === subject.name && application.status === 'Rejected' && application.interviews !== undefined).length
  })

  return counts
}

exports.getApplicationCounts = (applications, options) => {
  if (!options) {
    return null
  }

  // console.log('Options:', options);

  const counts = {}
  counts.totalApplications = applications.length

  const dimension1 = this.getDimensionData(options.dimension1)

  // console.log('Dimension 1', dimension1);

  let dimension2 = {}
  if (options.dimension2) {
    dimension2 = this.getDimensionData(options.dimension2)
  }

  // console.log('Dimension 2', dimension2);

  let dimension3 = {}
  if (options.dimension3) {
    dimension3 = this.getDimensionData(options.dimension3)
  }

  // console.log('Dimension 3', dimension3);

  let dimension4 = {}
  if (options.dimension4) {
    dimension4 = this.getDimensionData(options.dimension4)
  }

  // console.log('Dimension 4', dimension4);

  // DIMENSION 1 – Row
  dimension1.data.forEach((dm1, i) => {
    counts[dm1] = {}
    counts[dm1].total = applications.filter(application => application.subject === dm1).length
    counts[dm1].percentage = ((counts[dm1].total / counts.totalApplications) * 100).toFixed(2)

    // DIMENSION 2 - Column
    if (dimension2 && dimension2.data) {

      dimension2.data.forEach((dm2, i) => {
        counts[dm1][dm2] = {}
        counts[dm1][dm2].total = applications.filter(application => application[dimension1.label] === dm1 && application[dimension2.label] === dm2).length
        counts[dm1][dm2].percentage = ((counts[dm1][dm2].total / counts.totalApplications) * 100).toFixed(2)

        // DIMENSION 3 - Sub-column
        if (dimension3 && dimension3.data) {

          dimension3.data.forEach((dm3, i) => {
            counts[dm1][dm2][dm3] = {}

            counts[dm1][dm2][dm3].total = applications.filter(application => application[dimension1.label] === dm1 && application[dimension2.label] === dm2 && application[dimension3.label] === dm3).length
            counts[dm1][dm2][dm3].percentage = ((counts[dm1][dm2][dm3].total / counts.totalApplications) * 100).toFixed(2)

            // DIMENSION 4  - Sub-row
            if (dimension4 && dimension4.data) {

              dimension4.data.forEach((dm4, i) => {
                // Get the group count
                counts[dm1][dm2][dm4] = {}

                counts[dm1][dm2][dm4].total = applications.filter(application => application[dimension1.label] === dm1 && application[dimension2.label] === dm2 && application[dimension4.label] === dm4).length
                counts[dm1][dm2][dm4].percentage = ((counts[dm1][dm2][dm4].total / counts.totalApplications) * 100).toFixed(2)

                // Get the dimension count
                counts[dm1][dm2][dm3][dm4] = {}

                counts[dm1][dm2][dm3][dm4].total = applications.filter(application => application[dimension1.label] === dm1 && application[dimension2.label] === dm2 && application[dimension3.label] === dm3 && application[dimension4.label] === dm4).length
                counts[dm1][dm2][dm3][dm4].percentage = ((counts[dm1][dm2][dm3][dm4].total / counts.totalApplications) * 100).toFixed(2)

              })

            }

          })

        }

      })

    }

  })

  return counts
}

exports.getDimensionData = (dimension) => {
  if (!dimension) {
    return null
  }

  let data = []
  let label = ''

  switch (dimension) {
    case 'cycle':
      data = SystemHelper.cycles
      label = 'cycle'
      break
    case 'status':
      data = SystemHelper.statuses
      label = 'status'
      break
    case 'subject':
      data = SystemHelper.subjects.map((subject) => {
        return subject.name
      })
      label = 'subject'
      break
    case 'studyMode':
      data = SystemHelper.studyModes
      label = 'studyMode'
      break
    case 'fundingType':
      data = SystemHelper.fundingTypes
      label = 'fundingType'
      break
    case 'subjectLevel':
      data = SystemHelper.subjectLevels
      label = 'subjectLevel'
      break
    case 'location':
      data = SystemHelper.trainingLocations
      label = 'location'
      break
    case 'provider':
    case 'trainingProvider':
      data = SystemHelper.trainingProviders
      label = 'provider'
      break
    case 'accreditedBody':
      data = SystemHelper.accreditedBodies
      label = 'accreditedBody'
      break
  }

  return { data, label }
}
