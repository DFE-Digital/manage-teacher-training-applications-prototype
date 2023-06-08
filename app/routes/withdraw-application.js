const ApplicationHelper = require('../data/helpers/application')
const content = require('../data/content')

module.exports = router => {

  router.get('/applications/:applicationId/withdraw', (req, res) => {
    const applicationId = req.params.applicationId
    res.redirect(`/applications/${applicationId}/withdraw/reasons`)
  })


  router.get('/applications/:applicationId/withdraw/reasons', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/withdraw/reasons', {
      application
    })
  })

  router.post('/applications/:applicationId/withdraw/reasons', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    if((application.status == 'Received' || application.status == 'Interviewing') && req.session.data['withdraw-application'].reason == 'Other') {
      res.redirect(`/applications/${applicationId}/withdraw/exit`)
    } else {
      res.redirect(`/applications/${applicationId}/withdraw/check`)
    }
  })

  router.get('/applications/:applicationId/withdraw/exit', (req, res) => {
    const applicationId = req.params.applicationId
    res.render('applications/withdraw/exit', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.get('/applications/:applicationId/withdraw/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/withdraw/check', {
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/withdraw/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Application withdrawn'

    application.withdrawal = {
      date: new Date().toISOString(),
      feedback: {
        reason: req.session.data['withdraw-application'].reason,
        'other-reason-details': req.session.data['withdraw-application']['other-reason-details']
      }
    }

    // let reason = req.session.data['withdraw-application'].reason
    // TODO change reason on cancel interview
    ApplicationHelper.getUpcomingInterviews(application).forEach((interview) => {
      ApplicationHelper.cancelInterview({ application, interview, cancellationReason: "You withdrew your application." })
    })

    delete req.session.data['withdraw-application']

    ApplicationHelper.addEvent(application, {
      "title": content.withdrawApplication.event.title,
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })

    res.redirect(`/applications/${applicationId}/feedback`)
  })


}
