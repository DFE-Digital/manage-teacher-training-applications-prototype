const utils = require( '../data/application-utils')

module.exports = router => {

  router.get('/application/:applicationId/mark-conditions', (req, res) => {
    const applicationId = req.params.applicationId;
    const application = req.session.data.applications[applicationId]

    res.render('application/mark-conditions', {
      applicationId: applicationId,
      conditions: utils.getConditions(application)
    })
  })

  router.post('/application/:applicationId/mark-conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const { conditionsmet } = req.body

    if (conditionsmet === 'yes') {
      res.redirect(`/application/${applicationId}/confirm-conditions-met`)
    } else {
      res.redirect(`/application/${applicationId}/confirm-conditions-not-met`)
    }
  })

  router.get('/application/:applicationId/confirm-conditions-met', (req, res) => {
    const applicationId = req.params.applicationId;
    const application = req.session.data.applications[applicationId]

    res.render('application/confirm-conditions-met', {
      applicationId: applicationId,
      conditions: utils.getConditions(application)
    })
  })

  router.post('/application/:applicationId/confirm-conditions-met', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    application.status = "Conditions met";
    application.status.conditionsMetDate = new Date().toISOString()
    req.flash('success', 'conditions-met');
    res.redirect(`/application/${applicationId}`);
  })

  router.get('/application/:applicationId/confirm-conditions-not-met', (req, res) => {
    const applicationId = req.params.applicationId;
    const application = req.session.data.applications[applicationId]

    res.render('application/confirm-conditions-not-met', {
      applicationId: applicationId,
      conditions: utils.getConditions(application)
    })
  })

  router.post('/application/:applicationId/confirm-conditions-not-met', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    application.status = "Conditions not met";
    application.status.conditionsNotMetDate = new Date().toISOString()
    req.flash('success', 'conditions-not-met');
    res.redirect(`/application/${applicationId}`);
  })


}
