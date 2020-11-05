const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/application/:applicationId', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/index', {
      application,
      statusText: utils.getStatusText(application)
    })
  })

  router.get('/application/:applicationId/timeline', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/timeline', {
      application,
      statusText: utils.getStatusText(application),
      timeline: utils.getTimeline(application),
      conditions: utils.getConditions(application)
    })
  })

  router.get('/application/:applicationId/decision', (req, res) => {
    res.render('application/decision', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/decision', (req, res) => {
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
      res.redirect(`/application/${applicationId}/offer/new`)
    } else if (decision === '2') {
      res.redirect(`/application/${applicationId}/offer/new/provider`)
    } else {
      res.redirect(`/application/${applicationId}/reject`)
    }
  })


}
