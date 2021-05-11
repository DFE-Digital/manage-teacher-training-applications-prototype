const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/applications/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/offer/show', {
      application,
      conditions: ApplicationHelper.getConditions(application.offer)
    })
  })

}
