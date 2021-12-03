const { v4: uuidv4 } = require('uuid')
const ApplicationHelper = require('../data/helpers/application')
const Utils = require('../data/helpers/utils')

const locations = require('../data/locations')

const getLocationItems = (selectedItem) => {
  const items = []

  locations.forEach((location, i) => {
    const item = {}

    item.text = location.name
    item.value = location.id
    item.id = location.id
    item.checked = (selectedItem && selectedItem.includes(location.id)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = Utils.arrayToList(
        array = Object.values(location.address),
        join = ', ',
        final = ', '
      )

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

const getLocation = (locationId) => {
  return locations.find(location => location.id === locationId)
}

module.exports = router => {

  router.get('/applications/:applicationId/offer/new', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions

    // cleanse data gah
    if (req.session.data['new-offer']
      && req.session.data['new-offer']['conditions']) {
      req.session.data['new-offer']['conditions'] = req.session.data['new-offer']['conditions'].filter(condition => condition !== '')
    }

    conditions = req.session.data['new-offer']['conditions']

    res.render('applications/offer/new/index', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/new', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
  })

  router.get('/applications/:applicationId/offer/new/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions = []

    if (req.session.data['new-offer']
      && req.session.data['new-offer']['standard-conditions']
      && req.session.data['new-offer']['standard-conditions'].length) {
      conditions = conditions.concat(req.session.data['new-offer']['standard-conditions'])
    }

    if (req.session.data['new-offer']['conditions']) {
      req.session.data['new-offer']['conditions']
        .filter(condition => condition !== '')
        .forEach(condition => {
        conditions.push(condition)
      })
    }

    conditions = conditions.map(condition => {
      return {
        description: condition,
        status: "Pending"
      }
    })

    res.render('applications/offer/new/check', {
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application,
      conditions,
      location: getLocation(req.session.data['new-offer'].location)
    })
  })

  router.post('/applications/:applicationId/offer/new/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    ApplicationHelper.getUpcomingInterviews(application).forEach((interview) => {
      ApplicationHelper.cancelInterview({ application, interview, cancellationReason: "We made you an offer." })
    })

    application.status = 'Offered'

    application.offer = {
      madeDate: new Date().toISOString(),
      provider: req.session.data['new-offer'].provider || application.provider,
      course: req.session.data['new-offer'].course || application.course,
      location: getLocation(req.session.data['new-offer'].location) || application.location,
      studyMode: req.session.data['new-offer'].studyMode || application.studyMode,
      accreditedBody: application.accreditedBody,
      fundingType: req.session.data['new-offer'].fundingType || application.fundingType
    }

    application.offer.declineByDate = ApplicationHelper.calculateDeclineDate(application)
    application.offer.daysToDecline = ApplicationHelper.calculateDaysToDecline(application)

    // save standard conditions
    if (req.session.data['new-offer']
      && req.session.data['new-offer']['standard-conditions']
      && req.session.data['new-offer']['standard-conditions'].length) {
      application.offer.standardConditions = req.session.data['new-offer']['standard-conditions'].map(condition => {
        return {
          id: uuidv4(),
          description: condition,
          status: "Pending"
        }
      })
    }

    // save further conditions
    if (req.session.data['new-offer']['conditions']) {
      let furtherConditions = req.session.data['new-offer']['conditions']
        .filter(condition => condition != '')
        .map(condition => {
          return {
            id: uuidv4(),
            description: c,
            status: "Pending"
          }
        })

      if (furtherConditions.length) {
        application.offer.conditions = furtherConditions
      }
    }

    ApplicationHelper.addEvent(application, {
      title: 'Offer made',
      user: req.session.data.user.firstName + ' ' + req.session.data.user.lastName,
      date: application.offer.madeDate,
      meta: {
        offer: {
          provider: application.offer.provider,
          course: application.offer.course,
          location: application.offer.location,
          studyMode: application.offer.studyMode,
          accreditedBody: application.offer.accreditedBody,
          conditions: ApplicationHelper.getConditions(application.offer)
        }
      }
    })

    delete req.session.data['new-offer']
    delete req.session.data.decision

    req.flash('success', 'Offer sent')
    res.redirect(`/applications/${req.params.applicationId}/offer`)
  })

  // ---------------------------------------------------------------------------
  // Change course flow
  // ---------------------------------------------------------------------------

  router.get('/applications/:applicationId/offer/new/provider', (req, res) => {
    res.render('applications/offer/new/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/new/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/course?referrer=provider`)
  })

  router.get('/applications/:applicationId/offer/new/course', (req, res) => {
    res.render('applications/offer/new/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/new/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/study-mode?referrer=course`)
  })

  router.get('/applications/:applicationId/offer/new/study-mode', (req, res) => {
    res.render('applications/offer/new/study-mode', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/new/study-mode', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/location?referrer=study-mode`)
  })

  router.get('/applications/:applicationId/offer/new/location', (req, res) => {
    let selectedLocation
    if (req.session.data['new-offer'] && req.session.data['new-offer'].location) {
      selectedLocation = req.session.data['new-offer'].location
    }

    res.render('applications/offer/new/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      locations: getLocationItems(selectedLocation)
    })
  })

  router.post('/applications/:applicationId/offer/new/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/funding-type?referrer=location`)
  })

  router.get('/applications/:applicationId/offer/new/funding-type', (req, res) => {
    res.render('applications/offer/new/funding-type', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/new/funding-type', (req, res) => {
    if (!(req.session.data['new-offer']['standard-conditions']
      || req.session.data['new-offer'].conditions)) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
    }
  })

  router.get('/applications/:applicationId/offer/new/course/cancel', (req, res) => {
    // delete data we don't need
    delete req.session.data['new-offer'].provider
    delete req.session.data['new-offer'].course
    delete req.session.data['new-offer'].studyMode
    delete req.session.data['new-offer'].location
    delete req.session.data['new-offer'].accreditedBody
    delete req.session.data['new-offer'].fundingType

    if (!(req.session.data['new-offer']['standard-conditions']
      || req.session.data['new-offer'].conditions)) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
    }
  })

  router.get('/applications/:applicationId/offer/new/cancel', (req, res) => {
    delete req.session.data['new-offer']
    res.redirect(`/applications/${req.params.applicationId}`)
  })

}
