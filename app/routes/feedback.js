const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/application/:applicationId/feedback', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('application/feedback/index', {
      application
    })
  })

  router.post('/application/:applicationId/feedback', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/feedback/check`)
  })

  router.get('/application/:applicationId/feedback/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('application/feedback/check', {
      application
    })
  })

  router.post('/application/:applicationId/feedback/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.rejectedDate = new Date().toISOString()
    application.rejectedReasons = utils.getRejectReasons(req.session.data.rejectionReasons)
    delete req.session.data.rejectionReasons
    req.flash('success', 'feedback-given')
    res.redirect(`/application/${applicationId}`)
  })
}
