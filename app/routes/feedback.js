const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/feedback', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('applications/feedback/index', {
      application
    })
  })

  router.post('/applications/:applicationId/feedback', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/feedback/check`)
  })

  router.get('/applications/:applicationId/feedback/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('applications/feedback/check', {
      application
    })
  })

  router.post('/applications/:applicationId/feedback/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.rejectedDate = new Date().toISOString()
    application.rejectedReasons = ApplicationHelper.getRejectReasons(req.session.data.rejectionReasons)
    delete req.session.data.rejectionReasons
    req.flash('success', 'Feedback sent')
    res.redirect(`/applications/${applicationId}`)
  })
}
