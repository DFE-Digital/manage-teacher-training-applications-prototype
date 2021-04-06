const { v4: uuidv4 } = require('uuid')
const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/applications/:applicationId/offer/new', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions;

    // cleanse data gah
    if(req.session.data['new-offer'] && req.session.data['new-offer']['conditions']) {
      req.session.data['new-offer']['conditions'] = req.session.data['new-offer']['conditions'].filter(c => c != '')
    }

    conditions = req.session.data['new-offer']['conditions']

    res.render('applications/offer/new/index', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/new', (req, res) => {
    const applicationId = req.params.applicationId
    res.redirect(`/applications/${applicationId}/offer/new/check`)
  })

  router.get('/applications/:applicationId/offer/new/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    var conditions = []
    if(req.session.data['new-offer'] && req.session.data['new-offer']['standard-conditions'] && req.session.data['new-offer']['standard-conditions'].length) {
      conditions = conditions.concat(req.session.data['new-offer']['standard-conditions'])
    }

    req.session.data['new-offer']['conditions'].filter(c => c != '').forEach(c => {
      conditions.push(c)
    })

    conditions = conditions.map(c => {
      return {
        description: c,
        status: "Pending"
      }
    })

    res.render('applications/offer/new/check', {
      hasUpcomingInterviews: ApplicationHelper.getUpcomingInterviews(application).length > 0,
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/new/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.status = 'Offered'
    application.offer = {
      madeDate: new Date().toISOString(),
      provider: req.session.data['new-offer'].provider || application.provider,
      course: req.session.data['new-offer'].course || application.course,
      location: req.session.data['new-offer'].location || application.location,
      studyMode: req.session.data['new-offer'].studyMode || application.studyMode,
      accreditedBody: application.accreditedBody
    }

    application.offer.declineByDate = ApplicationHelper.calculateDeclineDate(application)
    application.offer.daysToDecline = ApplicationHelper.calculateDaysToDecline(application)

    // save standard conditions
    if(req.session.data['new-offer'] && req.session.data['new-offer']['standard-conditions'] && req.session.data['new-offer']['standard-conditions'].length) {
      application.offer.standardConditions = req.session.data['new-offer']['standard-conditions'].map(c => {
        return {
          id: uuidv4(),
          description: c,
          status: "Pending"
        }
      })
    }

    // save further conditions
    let furtherConditions = req.session.data['new-offer'].conditions.filter(c => c != '').map(c => {
      return {
        id: uuidv4(),
        description: c,
        status: "Pending"
      }
    })

    if(furtherConditions.length) {
      application.offer.conditions = furtherConditions
    }

    ApplicationHelper.addEvent(application, {
      title: 'Offer made',
      user: 'Adam Davids',
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


  router.get('/applications/:applicationId/offer/new/provider', (req, res) => {

    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    res.render('applications/offer/new/provider', {
      application
    })
  })

  router.post('/applications/:applicationId/offer/new/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/course`)
  })

  router.get('/applications/:applicationId/offer/new/course', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    res.render('applications/offer/new/course', {
      application
    })
  })

  router.post('/applications/:applicationId/offer/new/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/location`)
  })

  router.get('/applications/:applicationId/offer/new/location', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    res.render('applications/offer/new/location', {
      application
    })
  })

  router.post('/applications/:applicationId/offer/new/location', (req, res) => {
    if(!req.session.data['new-offer']['standard-conditions'] || !req.session.data['new-offer'].conditions) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
    }
  })

}
