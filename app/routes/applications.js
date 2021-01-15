const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    // remove the search keywords if present to reset the search
    delete req.session.data.keywords

    res.render('applications/show', {
      application,
      statusText: ApplicationHelper.getStatusText(application)
    })
  })

  router.get('/applications/:applicationId/timeline', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/timeline/show', {
      application,
      statusText: ApplicationHelper.getStatusText(application),
      timeline: ApplicationHelper.getTimeline(application),
      conditions: ApplicationHelper.getConditions(application)
    })
  })

  router.get('/applications/:applicationId/feedback', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/feedback/show', {
      application,
      statusText: ApplicationHelper.getStatusText(application)
    })
  })

  router.get('/applications/:applicationId/decision', (req, res) => {
    res.render('applications/decision', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/decision', (req, res) => {
    const applicationId = req.params.applicationId
    const { decision, option } = req.body

    const data = req.session.data;
    // Clear data from previous journeys
    delete data['further-conditions']

    data["standard-conditions"] = [
      "Fitness to teach check",
      "Disclosure and barring service check"
    ]

    if (decision === '1') {
      res.redirect(`/applications/${applicationId}/offer/new`)
    } else if (decision === '2') {
      res.redirect(`/applications/${applicationId}/offer/new/provider`)
    } else {
      res.redirect(`/applications/${applicationId}/reject`)
    }
  })


}
