const ApplicationHelper = require('../data/helpers/application')
const content = require('../data/content')

module.exports = router => {

  router.get('/applications/:applicationId/reject/reasons', (req, res) => {
    const applicationId = req.params.applicationId
    res.render('applications/reject/reasons', {
      applicationId: applicationId,
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.get('/applications/:applicationId/reject/other-reasons', (req, res) => {
    const applicationId = req.params.applicationId

    res.render('applications/reject/other-reasons', {
      applicationId: applicationId,
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.get('/applications/:applicationId/reject/recommend', (req, res) => {
    res.render('applications/reject/recommend', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.get('/applications/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('applications/reject/check', {
      content,
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.status = 'Rejected'
    application.rejectedDate = application.rejectedFeedbackDate = new Date().toISOString()
    application.rejectedReasons = JSON.parse(JSON.stringify(req.session.data.rejection))

    ApplicationHelper.addEvent(application, {
      "title": content.rejectApplication.event.title,
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })

    delete req.session.data.rejection
    res.redirect(`/applications/${applicationId}/feedback`)
  })
}
