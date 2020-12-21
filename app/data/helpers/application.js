const { DateTime } = require('luxon')

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

    // Future applications
    'future-applications': data['future-applications']
  }
}

exports.getConditions = (application) => {
  const conditions = []
  var offer = application.offer || application.previousOffer
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

exports.hasPendingConditions = (application) => {
  return this.getConditions(application).some(c => c.status == "Pending")
}

exports.getCondition = (application, conditionId) => {
  return this.getConditions(application).find(condition => condition.id === conditionId)
}

exports.hasMetAllConditions = (application) => {
  return this.getConditions(application).filter(condition => condition.status === 'Pending').length === 0
}

exports.hasOnlyOneConditionNotMet = (application) => {
  return this.getConditions(application).filter(condition => condition.status === 'Pending').length === 1
}

exports.deleteCondition = (application, conditionId) => {
  if(application.offer.standardConditions) {
    application.offer.standardConditions = application.offer.standardConditions.filter(c => c.id != conditionId)
  }
  if(application.offer.conditions) {
    application.offer.conditions = application.offer.conditions.filter(c => c.id != conditionId)
  }
}

function getLink (item, application) {
  var link = {}
  switch (item.title) {
    case 'Application submitted':
      link.text = 'View application'
      link.href = `/applications/${application.id}`
      break
    case 'Offer made':
      link.text = 'View offer'
      link.href = `/applications/${application.id}/offer`
      break
    case 'Offer accepted':
      link.text = 'View offer'
      link.href = `/applications/${application.id}/offer`
      break
    case 'Conditions met':
      link.text = 'View conditions'
      link.href = `/applications/${application.id}/offer`
      break
    case 'Conditions not met':
      link.text = 'View conditions'
      link.href = `/applications/${application.id}/offer`
      break
    case 'Offer declined':
      link.text = 'View offer'
      link.href = `/applications/${application.id}/offer`
      break
    case 'Application rejected':
      link.text = 'View feedback'
      link.href = `/applications/${application.id}`
      break
    case 'Application withdrawn':
      link.text = 'View application'
      link.href = `/applications/${application.id}`
      break
    case 'Offer withdrawn':
      link.text = 'View offer'
      link.href = `/applications/${application.id}/offer`
      break
    case 'Offer reconfirmed':
      link.text = 'View offer'
      link.href = `/applications/${application.id}/offer`
      break
    case 'Offer deferred':
      link.text = 'View offer'
      link.href = `/applications/${application.id}/offer`
      break
    case 'Note added':
      link.text = 'View note'
      link.href = `/applications/${application.id}/notes/${application.notes.items[item.meta.noteIndex].id}`
      break
    case 'Interview set up':
      if(application.interviews.items.find(interview => interview.id === item.meta.interviewId)) {
        link.text = 'View interview'
        link.href = `/applications/${application.id}/interviews/#interview-${item.meta.interviewId}`
      }
      break
    case 'Interview changed':
      if(application.interviews.items.find(interview => interview.id === item.meta.interviewId)) {
        link.text = 'View interview'
        link.href = `/applications/${application.id}/interviews/#interview-${item.meta.interviewId}`
      }
      break
    case 'Interview cancelled':
      break
    case 'Status of conditions updated':
      link.text = 'View offer'
      link.href = `/applications/${application.id}/offer`
      break
  }
  return link
}

exports.getTimeline = (application) => {
  return application.events.items.map(item => {
    return {
      label: {
        text: item.title
      },
      datetime: {
        timestamp: item.date,
        type: 'datetime'
      },
      byline: {
        text: item.user
      },
      link: getLink(item, application)
    }
  }).reverse()
}

exports.addEvent = (application, event) => {
  application.events.items.push(event)
}

exports.getStatusText = (application) => {
  var status = application.status

  // has interviews that we need to surface as a status
  if(application.status === "Awaiting decision" && application.interviews.items.length) {
    status = "Interviewing"
  } else if (application.status === "Awaiting decision") {
    status = "Received"
  } else if (application.status === "Rejected" || application.status === "Offer withdrawn" || application.status == "Application withdrawn" || application.status == "Conditions not met" ) {
    status = "Closed"
  }

  return status
}
