const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/reject', (req, res) => {
    res.render('applications/reject/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/reject/check`)
  })

  router.get('/applications/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('applications/reject/check', {
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    ApplicationHelper.getUpcomingInterviews(application).forEach((interview) => {
      ApplicationHelper.cancelInterview({ application, interview, cancellationReason: "Your application was unsuccessful." })
    })

    if(application.status == "Rejected") {
      application.rejectedReasons = ApplicationHelper.getRejectReasons(req.session.data.rejection)
      application.rejectedFeedbackDate = new Date().toISOString()
      req.flash('success', 'Feedback sent')
      ApplicationHelper.addEvent(application, {
        "title": "Feedback sent",
        "user": "Ben Brown",
        "date": new Date().toISOString()
      })
    } else {
      application.status = 'Rejected'
      application.rejectedDate = application.rejectedFeedbackDate = new Date().toISOString()
      application.rejectedReasons = ApplicationHelper.getRejectReasons(req.session.data.rejection)
      req.flash('success', 'Application rejected')
      ApplicationHelper.addEvent(application, {
        "title": "Application rejected",
        "user": "Ben Brown",
        "date": new Date().toISOString()
      })
    }

    delete req.session.data.rejection
    res.redirect(`/applications/${applicationId}/feedback`)
  })
}
