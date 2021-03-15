const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/offer/edit-provider', (req, res) => {
    res.render('applications/offer/edit-provider/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-provider/course`)
  })

  router.get('/applications/:applicationId/offer/edit-provider/course', (req, res) => {
    res.render('applications/offer/edit-provider/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-provider/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-provider/location`)
  })

  router.get('/applications/:applicationId/offer/edit-provider/location', (req, res) => {
    res.render('applications/offer/edit-provider/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-provider/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-provider/check`)
  })

  router.get('/applications/:applicationId/offer/edit-provider/check', (req, res) => {
    let application =  req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions = ApplicationHelper.getConditions(application)
    res.render('applications/offer/edit-provider/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit-provider/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.provider = req.session.data['change-offer'].provider
    application.offer.course = req.session.data['change-offer'].course
    application.offer.location = req.session.data['change-offer'].location

    ApplicationHelper.addEvent(application, {
      title: "Offer changed",
      user: "Ben Brown",
      date: new Date().toISOString(),
      meta: {
        offer: {
          provider: application.offer.provider,
          course: application.offer.course,
          location: application.offer.location,
          accreditedBody: application.offer.accreditedBody,
          conditions: ApplicationHelper.getConditions(application)
        }
      }
    })

    req.flash('success', 'New offer sent')
    res.redirect(`/applications/${applicationId}/offer`)
  })
}
