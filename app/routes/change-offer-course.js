const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/offer/edit-course', (req, res) => {
    res.render('applications/offer/edit-course/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-course/location`)
  })

  router.get('/applications/:applicationId/offer/edit-course/location', (req, res) => {
    res.render('applications/offer/edit-course/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-course/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-course/check`)
  })

  router.get('/applications/:applicationId/offer/edit-course/check', (req, res) => {
    let application =  req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions = ApplicationHelper.getConditions(application)
    res.render('applications/offer/edit-course/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit-course/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

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
          standardConditions: application.offer.standardConditions,
          conditions: application.offer.conditions
        }
      }
    })

    req.flash('success', 'New offer sent')
    res.redirect(`/applications/${applicationId}/offer`)
  })
}
