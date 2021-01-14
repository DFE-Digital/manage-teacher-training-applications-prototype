const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/withdraw', (req, res) => {
    res.render('applications/withdraw/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/withdraw', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/withdraw/other-reasons-for-rejection`)
  })

  router.get('/applications/:applicationId/withdraw/other-reasons-for-rejection', (req, res) => {
    res.render('applications/withdraw/other-reasons-for-rejection', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/withdraw/other-reasons-for-rejection', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/withdraw/check`)
  })

  router.get('/applications/:applicationId/withdraw/check', (req, res) => {
    res.render('applications/withdraw/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/withdraw/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Application withdrawn'
    application.withdrawnDate = new Date().toISOString()
    req.flash('success', 'Application withdrawn')
    delete req.session.data.rejectionReasons

    ApplicationHelper.addEvent(application, {
      "title": "Application withdrawn",
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })
    res.redirect(`/applications/${applicationId}`)
  })
}
