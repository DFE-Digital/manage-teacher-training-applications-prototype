const { DateTime } = require('luxon')
const SystemHelper = require('./system')

const path = require('path')
const fs = require('fs')

const dataDirectoryPath = path.join(__dirname, '../')

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
  let now = SystemHelper.now();

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


// -----------------------------------------------------------------------------
// Statistics
// -----------------------------------------------------------------------------

exports.getApplicationCountsByStatus = (applications) => {
  const statuses = SystemHelper.statuses
  const counts = {}
  statuses.forEach((status, i) => {
    counts[status] = applications.filter(application => application.status === status).length
  })
  return counts
}

exports.getApplicationCountsByStudyMode = (applications) => {
  const studyModes = SystemHelper.studyModes
  const counts = {}
  studyModes.forEach((studyMode, i) => {
    counts[studyMode] = applications.filter(application => application.studyMode === studyMode).length
  })
  return counts
}

exports.getApplicationCountsByFundingType = (applications) => {
  const fundingTypes = SystemHelper.fundingTypes
  const counts = {}
  fundingTypes.forEach((fundingType, i) => {
    counts[fundingType] = applications.filter(application => application.fundingType === fundingType).length
  })
  return counts
}

exports.getApplicationCountsBySubject = (applications) => {
  const subjects = SystemHelper.subjects
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getApplicationCountsBySubjectAndStatus = (applications) => {
  const subjects = SystemHelper.subjects
  const statuses = SystemHelper.statuses
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    statuses.forEach((status, i) => {
      counts[subject.name][status] = applications.filter(application => application.subject === subject.name && application.status === status).length
    })
    counts[subject.name]['total'] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getApplicationCountsBySubjectAndTrainingProvider = (applications) => {
  const filePath = dataDirectoryPath + '/organisations.json'
  const rawData = fs.readFileSync(filePath)
  let organisations = JSON.parse(rawData)
  const subjects = SystemHelper.subjects
  const counts = {}
  organisations = organisations.filter(organisation => organisation.isAccreditedBody === false)
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    organisations.forEach((organisation, i) => {
      counts[subject.name][organisation.name] = applications.filter(application => application.subject === subject.name && application.provider === organisation.name).length
    })
    counts[subject.name]['total'] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getApplicationCountsBySubjectAndLocation = (applications) => {
  const subjects = SystemHelper.subjects
  const locations = SystemHelper.trainingLocations
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    locations.forEach((location, i) => {
      counts[subject.name][location] = applications.filter(application => application.subject === subject.name && application.location === location).length
    })
    counts[subject.name]['total'] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getApplicationCountsByOrganisation = (applications) => {
  const filePath = dataDirectoryPath + '/organisations.json'
  const rawData = fs.readFileSync(filePath)
  let organisations = JSON.parse(rawData)
  const counts = {}
  organisations = organisations.filter(organisation => organisation.isAccreditedBody === false)
  organisations.forEach((organisation, i) => {
    counts[organisation.name] = applications.filter(application => application.provider === organisation.name).length
  })
  return counts
}

exports.getApplicationCountsByTrainingLocation = (applications) => {
  const trainingLocations = SystemHelper.trainingLocations
  const counts = {}
  trainingLocations.forEach((location, i) => {
    counts[location] = applications.filter(application => application.location === location).length
  })
  return counts
}

exports.getApplicationCountsByReasonsForRejection = (applications) => {
  const reasonsForRejection = SystemHelper.reasonsForRejection
  const counts = {}
  reasonsForRejection.forEach((reason, i) => {
    counts[reason.name] = applications.filter(application => {
      if (application.rejectedReasons) {
        return application.status === 'Rejected' && application.rejectedReasons[reason.code] === 'Yes'
      }
    }).length
  })
  return counts
}

exports.getApplicationCountsByCandidateNationality = (applications) => {
  const countries = SystemHelper.countries
  const counts = {}

  counts['British'] = 0
  counts['British (Dual)'] = 0
  counts['Irish'] = 0
  counts['Europe'] = 0
  counts['Europe (Dual)'] = 0
  counts['Rest of world'] = 0
  counts['Rest of world (Dual)'] = 0

  countries.forEach((country, i) => {

      if (country.nationality === 'British') {
        counts['British'] = applications.filter(application => {
          if (application.personalDetails.nationality.length === 1) {
            return application.personalDetails.nationality.includes(country.nationality)
          }
        }).length

        counts['British (Dual)'] = applications.filter(application => {
          if (application.personalDetails.nationality.length > 1) {
            return application.personalDetails.nationality.includes(country.nationality)
          }
        }).length
      }

      if (country.nationality === 'Irish') {
        counts['Irish'] = applications.filter(application => {
          if (application.personalDetails.nationality.length === 1) {
            return application.personalDetails.nationality.includes(country.nationality)
          }
        }).length
      }

      // EU, Switzerland, Norway, Iceland or Liechtenstein
      if (country.region === 'europe') {
        counts['Europe'] += applications.filter(application => {
          return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
        }).length

        // counts['Europe'] += applications.filter(application => {
        //   if (application.personalDetails.nationality.length === 1) {
        //     return application.personalDetails.nationality.includes(country.nationality)
        //   }
        // }).length
        //
        // counts['Europe (Dual)'] += applications.filter(application => {
        //   if (application.personalDetails.nationality.length > 1) {
        //     return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
        //   }
        // }).length
      }

      if (country.region === 'row') {

        counts['Rest of world'] += applications.filter(application => {
          return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
        }).length

        // counts['Rest of world'] += applications.filter(application => {
        //   if (application.personalDetails.nationality.length === 1) {
        //     return application.personalDetails.nationality.includes(country.nationality)
        //   }
        // }).length
        //
        // counts['Rest of world (Dual)'] += applications.filter(application => {
        //   if (application.personalDetails.nationality.length > 1) {
        //     return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
        //   }
        // }).length
      }
    })

  return counts
}

exports.getApplicationCountsByCandidateResidence = (applications) => {
  const residenceTypes = ['uk','international']
  const counts = {}
  residenceTypes.forEach((type, i) => {
    counts[type] = applications.filter(application => application.contactDetails.addressType === type).length
  })
  return counts
}

exports.getApplicationCountsByCandidateRightToWorkStudy = (applications) => {
  const hasRightToWorkStudy = ['Yes', 'Not yet, or not sure']
  const counts = {}
  hasRightToWorkStudy.forEach((right, i) => {
    counts[right] = applications.filter(application => application.personalDetails.residency.rightToWorkStudy === right).length
  })
  return counts
}

exports.getApplicationCountsByCandidateLanguageAssessment = (applications) => {
  const hasEnglishLanguageQualifictions = ['Yes', 'No', 'Not needed']
  const counts = {}
  hasEnglishLanguageQualifictions.forEach((qualification, i) => {
    counts[qualification] = applications.filter(application => application.englishLanguageQualification.hasQualification === qualification).length
  })
  return counts
}
