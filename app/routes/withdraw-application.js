const ApplicationHelper = require('../data/helpers/application')
const content = require('../data/content')

module.exports = router => {

  router.get('/applications/:applicationId/withdraw', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render(`/applications/withdraw/index`, { application })
  })

  router.post('/applications/:applicationId/withdraw', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const reason = req.session.data['withdrawal-reason']
    delete req.session.data['withdrawal-reason']

    application.withdrawalReason = reason

    if ( reason == 'withdraw-offer' ) {
      res.redirect(`/applications/${applicationId}/offer/withdraw` )
    } else {
      res.redirect(`/applications/${applicationId}/withdraw/check` )
    }
  })


  router.get('/applications/:applicationId/withdraw/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render(`/applications/withdraw/check`, { application })

  })

  router.post('/applications/:applicationId/check', (req, res) => {

    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.pendingWithdrawal = true

    var dateWithdrawn = new Date()
    dateWithdrawn.setDate(new Date().getDate()+30);
    application.pendingWithdrawalDate = dateWithdrawn.toISOString()

    ApplicationHelper.addEvent(application, {
      "title": "Request to withdraw application on candidate's behalf",
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })

    res.redirect(`/applications/${applicationId}?confirm=withdraw-request` )

  })

  router.get('/applications/:applicationId/withdraw/request', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render(`/applications/withdraw/request`, { application })

  })

  router.get('/applications/:applicationId/withdrawal-reject', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    ApplicationHelper.addEvent(application, {
      "title": "Request to withdraw on candidate's behalf rejected",
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })

    delete application.pendingWithdrawal
    delete application.pendingWithdrawalDate

    res.redirect(`/applications/${applicationId}`)

  })

  router.get('/applications/:applicationId/withdrawal-confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Application withdrawn'

    application.withdrawal = {
      date: new Date().toISOString(),
      feedback: {
        reason: 'I do not want to train to teach anymore'
      }
    }

    // let reason = req.session.data['withdraw-application'].reason
    // TODO change reason on cancel interview
    ApplicationHelper.getUpcomingInterviews(application).forEach((interview) => {
      ApplicationHelper.cancelInterview({ application, interview, cancellationReason: "You withdrew your application." })
    })

    ApplicationHelper.addEvent(application, {
      "title": content.withdrawApplication.event.title,
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })

    delete application.pendingWithdrawal
    delete application.pendingWithdrawalDate

    res.redirect(`/applications/${applicationId}/` )

  })


}
