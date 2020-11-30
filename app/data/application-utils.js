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
      link.href = `/application/${application.id}`
      break
    case 'Offer made':
      link.text = 'View offer'
      link.href = `/application/${application.id}/offer`
      break
    case 'Offer accepted':
      link.text = 'View offer'
      link.href = `/application/${application.id}/offer`
      break
    case 'Conditions met':
      link.text = 'View conditions'
      link.href = `/application/${application.id}/offer`
      break
    case 'Conditions not met':
      link.text = 'View conditions'
      link.href = `/application/${application.id}/offer`
      break
    case 'Offer declined':
      link.text = 'View offer'
      link.href = `/application/${application.id}/offer`
      break
    case 'Application rejected':
      link.text = 'View feedback'
      link.href = `/application/${application.id}`
      break
    case 'Application withdrawn':
      link.text = 'View application'
      link.href = `/application/${application.id}`
      break
    case 'Offer withdrawn':
      link.text = 'View offer'
      link.href = `/application/${application.id}/offer`
      break
    case 'Offer reconfirmed':
      link.text = 'View offer'
      link.href = `/application/${application.id}/offer`
      break
    case 'Offer deferred':
      link.text = 'View offer'
      link.href = `/application/${application.id}/offer`
      break
    case 'Note added':
      link.text = 'View note'
      link.href = `/application/${application.id}/notes/${application.notes.items[item.meta.noteIndex].id}`
      break
    case 'Interview set up':
      link.text = 'View interview'
      link.href = `/application/${application.id}/interviews/`
      break
    case 'Interview changed':
      link.text = 'View interview'
      // link.href = `/application/${application.id}/interviews/${item.meta.interviewId}`
      link.href = `/application/${application.id}/interviews/`
      break
    case 'Status of conditions updated':
      link.text = 'View offer'
      link.href = `/application/${application.id}/offer`
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
  }

  return status
}

exports.getDataByPage = (data, pageNumber = 1, pageSize = 50) => {
  --pageNumber // because pages logically start with 1, but technically with 0
  return data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
}

exports.getPaginationItems = (pageNumber, pageCount, pageSize = 50) => {
  let startItem = 1
  let endItem = (pageCount < 5) ? pageCount : 5

  // First five pages
  if (pageNumber > 3) {
    startItem = (pageCount < 5) ? 1 : pageNumber - 2
    endItem = pageNumber + 2
  }

  // Last five pages
  if (pageCount > 4 && pageNumber > (pageCount - 3)) {
    startItem = (pageCount - 4) ? pageCount - 4 : startItem
    endItem = pageCount
  }

  const itemArray = []
  for (let i = startItem; i <= endItem; i++) {
    let item = {}
    item.text = i
    item.href = '?page=' + i + '&limit=' + pageSize
    item.selected = true ? parseInt(pageNumber) === i : false
    itemArray.push(item)
  }

  return itemArray
}

exports.getPagination = (data, pageNumber = 1, pageSize = 50) => {
  // Total number of things
  const totalCount = data.length

  // Make sure pageSize is positive
  pageSize = Math.abs(pageSize)

  // Prevent users putting in a limit not in the pre-defined set: 10, 25, 50, 100
  pageSize = ([10,25,50,100].indexOf(parseInt(pageSize)) !== -1) ? parseInt(pageSize) : 50

  // Make sure pageNumber is positive
  pageNumber = Math.abs(pageNumber)

  // Make sure pageNumber is an integer
  pageNumber = (pageNumber) ? parseInt(pageNumber) : 1

  // Total number of pages
  const pageCount = Math.ceil(totalCount / pageSize)

  // Calculate the previous and next pages
  const prevPage = (pageNumber - 1) ? (pageNumber - 1) : 1
  const nextPage = ((pageNumber + 1) > pageCount) ? pageCount : (pageNumber + 1)

  const startItem = (pageNumber == 1) ? pageNumber : ((pageNumber * pageSize) - pageSize) + 1
  let endItem = (pageNumber == 1) ? (pageNumber * pageSize) : ((startItem + pageSize) - 1)

  // We don't want the end item number shown to go beyond the total count
  endItem = (endItem > totalCount) ? totalCount : endItem

  return { totalCount, pageSize, pageNumber, pageCount, prevPage, nextPage, startItem, endItem, pageItems: this.getPaginationItems(pageNumber, pageCount, pageSize) }
}
