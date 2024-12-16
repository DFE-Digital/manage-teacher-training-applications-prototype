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

    if ( reason == 'withdraw-offer' ) {
      res.redirect(`/applications/${applicationId}/offer/withdraw` )
    } else {
      application.pendingWithdrawal = true

      var dateWithdrawn = new Date()
      dateWithdrawn.setDate(new Date().getDate()+2);
      application.pendingWithdrawalDate = dateWithdrawn.toISOString()

      res.redirect(`/applications/${applicationId}?confirm=withdraw-request` )
    }

    /*
    application.status = 'Application withdrawn'

    application.withdrawal = {
      date: new Date().toISOString(),
      feedback: {
        reason: req.session.data['withdraw-application'].reason
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

    res.redirect(`/applications/${applicationId}/` )

    */
  })

}
