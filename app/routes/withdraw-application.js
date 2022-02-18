const ApplicationHelper = require('../data/helpers/application')
const content = require('../data/content')

module.exports = router => {

  router.get('/applications/:applicationId/withdraw', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    if(application.status == 'Received' || application.status == 'Interviewing') {
      res.redirect(`/applications/${applicationId}/withdraw/confirm`)
    } else {
      res.redirect(`/applications/${applicationId}/withdraw/reasons`)
    }
  })

  router.get('/applications/:applicationId/withdraw/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/withdraw/confirm', {
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/withdraw/confirm', (req, res) => {
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

  router.get('/applications/:applicationId/withdraw/reasons', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/withdraw/reasons', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/withdraw/reasons', (req, res) => {
    const applicationId = req.params.applicationId
    res.redirect(`/applications/${applicationId}/withdraw/check`)
  })

  router.get('/applications/:applicationId/withdraw/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/withdraw/check', {
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })


}
