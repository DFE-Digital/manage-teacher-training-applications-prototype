const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/applications/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)

    res.render('applications/offer/show', {
      application,
      conditions: ApplicationHelper.getConditions(application.offer),
      assignedUsers
    })
  })

}
