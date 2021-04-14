const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/withdraw', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('applications/withdraw/check', {
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/withdraw', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Application withdrawn'
    application.withdrawalDate = new Date().toISOString()
    req.flash('success', 'Application withdrawn')
    delete req.session.data.withdraw

    ApplicationHelper.getUpcomingInterviews(application).forEach((interview) => {
      ApplicationHelper.cancelInterview({ application, interview, cancellationReason: "You withdrew your application." })
    })

    ApplicationHelper.addEvent(application, {
      "title": "Application withdrawn",
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })
    res.redirect(`/applications/${applicationId}`)
  })
}
