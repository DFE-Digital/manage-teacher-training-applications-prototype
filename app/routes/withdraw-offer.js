const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/applications/:applicationId/offer/withdraw', (req, res) => {
    res.render('applications/offer/withdraw/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/withdraw', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/withdraw/check`)
  })

  router.get('/applications/:applicationId/offer/withdraw/check', (req, res) => {
    res.render('applications/offer/withdraw/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/withdraw/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Offer withdrawn'
    application.offer.withdrawalDate = new Date().toISOString()
    application.offer.withdrawalReasons = ApplicationHelper.getRejectReasons(req.session.data.rejection)
    req.flash('success', 'Offer withdrawn')

    ApplicationHelper.addEvent(application, {
      "title": "Offer withdrawn",
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })

    delete req.session.data.rejectionReasons
    res.redirect(`/applications/${applicationId}/feedback`)
  })
}
