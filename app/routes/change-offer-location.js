const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/offer/edit-location', (req, res) => {
    res.render('applications/offer/edit-location/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-location/check`)
  })

  router.get('/applications/:applicationId/offer/edit-location/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions = ApplicationHelper.getConditions(application)

    res.render('applications/offer/edit-location/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit-location/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    ApplicationHelper.addEvent(application, {
      title: "Offer changed",
      user: "Ben Brown",
      date: new Date().toISOString(),
      meta: {
        offer: {
          provider: application.offer.provider,
          course: application.offer.course,
          location: req.session.data['change-offer'].location,
          accreditedBody: application.offer.accreditedBody,
          standardConditions: application.offer.standardConditions,
          conditions: application.offer.conditions
        }
      }
    })
    req.flash('success', 'New offer sent')
    res.redirect(`/applications/${applicationId}/offer`)
  })
}
