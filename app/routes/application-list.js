const utils = require('../data/application-utils')
const { DateTime } = require('luxon')

function getCheckboxValues (name, data) {
  return name && (Array.isArray(name) ? name : [name].filter((name) => {
    return name !== '_unchecked'
  })) || data
}

function getApplicationsByGroup (applications) {

  const previousCyclePendingConditions = applications
    .filter(app => app.status === "Accepted")
    .filter(app => app.cycle === 'Previous cycle (2019 to 2020)')

  const deferredOffersPendingReconfirmation = applications
    .filter(app => app.status === 'Deferred')
    .filter(app => app.cycle === 'Previous cycle (2019 to 2020)')

  const rejectedWithoutFeedback = applications
    .filter(app => app.status === 'Rejected')
    .filter(app => !app.rejectedReasons)

  const aboutToBeRejectedAutomatically = applications
    .filter(app => app.status === 'Submitted')
    .filter(app => app.daysToRespond < 5)

  const awaitingDecision = applications
    .filter(app => app.status === 'Submitted')
    .filter(app => app.daysToRespond >= 5)

  const waitingOn = applications
    .filter(app => app.status === 'Offered')

  const pendingConditions = applications
    .filter(app => app.status === 'Accepted')
    .filter(app => app.cycle === 'Current cycle (2020 to 2021)')

  const conditionsMet = applications
    .filter(app => app.status === 'Conditions met')

  const deferredOffers = applications
    .filter(app => app.status === 'Deferred')
    .filter(app => app.cycle === 'Current cycle (2020 to 2021)')

  let other = applications
    .filter(app => app.status !== 'Submitted')
    .filter(app => app.status !== 'Deferred')
    .filter(app => app.status !== 'Offered')
    .filter(app => app.status !== 'Accepted')
    .filter(app => app.status !== 'Conditions met')
    .filter(app => app.status !== 'Rejected')

  // we have 5 of these
  const rejectedWithFeedback = applications
    .filter(app => app.status === 'Rejected')
    .filter(function (app) {
      return app.rejectedReasons
    })

  other = other.concat(rejectedWithFeedback)

  return {
    deferredOffersPendingReconfirmation,
    previousCyclePendingConditions,
    rejectedWithoutFeedback,
    aboutToBeRejectedAutomatically,
    awaitingDecision,
    waitingOn,
    pendingConditions,
    conditionsMet,
    deferredOffers,
    other
  }
}

function flattenGroup (grouped) {
  var array = []
  array = array.concat(grouped.deferredOffersPendingReconfirmation)
  array = array.concat(grouped.previousCyclePendingConditions)
  array = array.concat(grouped.aboutToBeRejectedAutomatically)
  array = array.concat(grouped.rejectedWithoutFeedback)
  array = array.concat(grouped.awaitingDecision)
  array = array.concat(grouped.waitingOn)
  array = array.concat(grouped.pendingConditions)
  array = array.concat(grouped.conditionsMet)
  array = array.concat(grouped.deferredOffers)
  array = array.concat(grouped.other)
  return array
}

function addHeadings (grouped) {
  var array = []
  if (grouped.deferredOffersPendingReconfirmation.length) {
    array.push({
      heading: 'Deferred offers: review and confirm'
    })
    array = array.concat(grouped.deferredOffersPendingReconfirmation)
  }

  if (grouped.previousCyclePendingConditions.length) {
    array.push({
      heading: 'Offers pending conditions (previous cycle)'
    })
    array = array.concat(grouped.previousCyclePendingConditions)
  }

  if (grouped.aboutToBeRejectedAutomatically.length) {
    array.push({
      heading: 'Deadline approaching: respond to the candidate'
    })
    array = array.concat(grouped.aboutToBeRejectedAutomatically)
  }

  if (grouped.rejectedWithoutFeedback.length) {
    array.push({
      heading: 'Give feedback: you did not respond in time'
    })
    array = array.concat(grouped.rejectedWithoutFeedback)
  }

  if (grouped.awaitingDecision.length) {
    array.push({
      heading: 'Ready for review'
    })
    array = array.concat(grouped.awaitingDecision)
  }

  if (grouped.waitingOn.length) {
    array.push({
      heading: 'Waiting for candidate action'
    })
    array = array.concat(grouped.waitingOn)
  }

  if (grouped.pendingConditions.length) {
    array.push({
      heading: 'Offers pending conditions (current cycle)'
    })
    array = array.concat(grouped.pendingConditions)
  }

  if (grouped.conditionsMet.length) {
    array.push({
      heading: 'Successful candidates'
    })
    array = array.concat(grouped.conditionsMet)
  }

  if (grouped.deferredOffers.length) {
    array.push({
      heading: 'Deferred offers'
    })
    array = array.concat(grouped.deferredOffers)
  }

  if (grouped.other.length) {
    if (grouped.deferredOffersPendingReconfirmation.length || grouped.aboutToBeRejectedAutomatically.length || grouped.rejectedWithoutFeedback.length || grouped.awaitingDecision.length || grouped.waitingOn.length || grouped.pendingConditions.length || grouped.conditionsMet.length) {
      array.push({
        heading: 'No action needed'
      })
    }
    array = array.concat(grouped.other)
  }
  return array
}

module.exports = router => {
  router.all('/', (req, res) => {
    let apps = req.session.data.applications.map(app => app).reverse()

    let { cycle, status, provider, accreditingbody, keywords, locationname } = req.query

    keywords = keywords || req.session.data.keywords

    const cycles = getCheckboxValues(cycle, req.session.data.cycle)
    const statuses = getCheckboxValues(status, req.session.data.status)
    const providers = getCheckboxValues(provider, req.session.data.provider)
    const locationnames = getCheckboxValues(locationname, req.session.data.locationname)
    const accreditingbodies = getCheckboxValues(accreditingbody, req.session.data.accreditingbody)

    const hasFilters = !!((cycles && cycles.length > 0) || (statuses && statuses.length > 0) || (locationnames && locationnames.length > 0) || (providers && providers.length > 0) || (accreditingbodies && accreditingbodies.length > 0) || (keywords))

    if (hasFilters) {
      apps = apps.filter((app) => {
        let cycleValid = true
        let statusValid = true
        let providerValid = true
        let locationnameValid = true
        let accreditingbodyValid = true
        let candidateNameValid = true

        if (cycles && cycles.length) {
          cycleValid = cycles.includes(app.cycle)
        }

        if (statuses && statuses.length) {
          statusValid = statuses.includes(app.status)
        }

        if (locationnames && locationnames.length) {
          locationnameValid = locationnames.includes(app.locationname)
        }

        if (providers && providers.length) {
          providerValid = providers.includes(app.provider)
        }

        if (accreditingbodies && accreditingbodies.length) {
          accreditingbodyValid = accreditingbodies.includes(app.accreditingbody)
        }

        var candidateName = `${app.personalDetails.givenName} ${app.personalDetails.familyName}`

        if (keywords) {
          candidateNameValid = candidateName.toLowerCase().includes(keywords.toLowerCase())
        }

        return cycleValid && statusValid && locationnameValid && providerValid && candidateNameValid && accreditingbodyValid
      })
    }

    let selectedFilters = null
    if (hasFilters) {
      selectedFilters = {
        categories: []
      }

      if (keywords) {
        selectedFilters.categories.push({
          heading: { text: "Candidate's name" },
          items: [{
            text: keywords,
            href: '/remove-keywords-filter'
          }]
        })
      }

      if (cycles && cycles.length) {
        selectedFilters.categories.push({
          heading: { text: 'Cycles' },
          items: cycles.map((cycle) => {
            return {
              text: cycle,
              href: `/remove-cycle-filter/${cycle}`
            }
          })
        })
      }

      if (statuses && statuses.length) {
        selectedFilters.categories.push({
          heading: { text: 'Statuses' },
          items: statuses.map((status) => {
            return {
              text: status,
              href: `/remove-status-filter/${status}`
            }
          })
        })
      }

      if (locationnames && locationnames.length) {
        selectedFilters.categories.push({
          heading: { text: 'Training locations for ' + req.session.data.trainingProviders[1].name },
          items: locationnames.map((locationname) => {
            return {
              text: locationname,
              href: `/remove-locationname-filter/${locationname}`
            }
          })
        })
      }

      if (providers && providers.length) {
        selectedFilters.categories.push({
          heading: { text: 'Providers' },
          items: providers.map((provider) => {
            return {
              text: provider,
              href: `/remove-provider-filter/${provider}`
            }
          })
        })
      }

      if (accreditingbodies && accreditingbodies.length) {
        selectedFilters.categories.push({
          heading: { text: 'Courses ratified by' },
          items: accreditingbodies.map((accreditingbody) => {
            return {
              text: accreditingbody,
              href: `/remove-accreditingbody-filter/${accreditingbody}`
            }
          })
        })
      }
    }

    var applications = apps.map(app => {
      // coz it's in reverse chron
      var lastEvent = utils.getTimeline(app)[0]
      if (lastEvent.label.text === 'Note added') {
        app.lastEventType = 'note'
      } else {
        app.lastEventType = 'status'
      }

      var now = DateTime.fromISO('2019-08-15')
      var rbd = DateTime.fromISO(app.submittedDate).plus({ days: 40 })
      var diff = rbd.diff(now, 'days').toObject().days

      app.daysToRespond = Math.round(diff)
      if (diff < 1) {
        app.daysToRespond = 0
      }

      if (app.status !== 'Submitted') {
        app.daysToRespond = 1000
      }

      app.lastEventDate = lastEvent.datetime.timestamp

      return app
    })

    applications = applications.sort(function (a, b) {
      return a.daysToRespond - b.daysToRespond
    })

    // Whack all the grouped items into an array without headings
    let grouped = getApplicationsByGroup(applications)

    // Put groups into ordered array
    applications = flattenGroup(grouped)

    // Get the page worth of items
    const pageSize = 50
    const page = parseInt(req.query.page, 10) || 1

    // to use zero based indexing in code but normal indexing for the url
    const startIndex = (page - 1) * pageSize
    let endIndex = startIndex + pageSize
    const pageCount = Math.ceil(applications.length / pageSize)
    const totalApplications = applications.length

    if (endIndex > applications.length) {
      endIndex = applications.length
    }

    applications = applications.splice(startIndex, endIndex)

    let pagination;

    if (pageCount > 1) {
      pagination = {
        from: startIndex + 1,
        to: endIndex,
        count: totalApplications,
        items: []
      }

      if (page > 1) {
        pagination.previous = {
          text: 'Previous',
          href: '?page=' + (page - 1)
        }
      }

      if (page !== pageCount) {
        pagination.next = {
          text: 'Next',
          href: '?page=' + (page + 1)
        }
      }

      for (var i = 1; i < pageCount + 1; i++) {
        pagination.items.push({
          text: i,
          href: '?page=' + i,
          selected: i == page
        })
      }
    }

    // now mixin the headings
    grouped = getApplicationsByGroup(applications)
    applications = addHeadings(grouped)

    res.render('index', {
      applications: applications,
      pagination,
      selectedFilters: selectedFilters,
      hasFilters: hasFilters
    })
  })

  router.get('/remove-keywords-filter', (req, res) => {
    req.session.data.keywords = ''
    res.redirect('/')
  })

  router.get('/remove-cycle-filter/:cycle', (req, res) => {
    req.session.data.cycle = req.session.data.cycle.filter(item => item !== req.params.cycle)
    res.redirect('/')
  })

  router.get('/remove-status-filter/:status', (req, res) => {
    req.session.data.status = req.session.data.status.filter(item => item !== req.params.status)
    res.redirect('/')
  })

  router.get('/remove-provider-filter/:provider', (req, res) => {
    req.session.data.provider = req.session.data.provider.filter(item => item !== req.params.provider)
    res.redirect('/')
  })

  router.get('/remove-locationname-filter/:locationname', (req, res) => {
    req.session.data.locationname = req.session.data.locationname.filter(item => item !== req.params.locationname)
    res.redirect('/')
  })

  router.get('/remove-accreditingbody-filter/:accreditingbody', (req, res) => {
    req.session.data.accreditingbody = req.session.data.accreditingbody.filter(item => item !== req.params.accreditingbody)
    res.redirect('/')
  })

  router.get('/remove-all-filters', (req, res) => {
    req.session.data.cycle = null
    req.session.data.status = null
    req.session.data.provider = null
    req.session.data.keywords = null
    req.session.data.accreditingbody = null
    req.session.data.locationname = null
    res.redirect('/')
  })

  router.post('/switch-cycle', (req, res) => {
    res.redirect('/')
  })
}
