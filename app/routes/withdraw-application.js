const ApplicationHelper = require('../data/helpers/application')
const content = require('../data/content')

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
    req.flash('success', content.withdrawApplication.successMessage)
    delete req.session.data.withdraw

    ApplicationHelper.getUpcomingInterviews(application).forEach((interview) => {
      ApplicationHelper.cancelInterview({ application, interview, cancellationReason: "You withdrew your application." })
    })

    ApplicationHelper.addEvent(application, {
      "title": content.withdrawApplication.event.title,
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })
    res.redirect(`/applications/${applicationId}`)
  })
}
