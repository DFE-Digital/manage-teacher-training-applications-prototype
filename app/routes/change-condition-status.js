const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/application/:applicationId/condition/:conditionId/change-status', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)
    res.render('offer/change-condition-status/status', {
      application,
      condition
    })
  })

  router.post('/application/:applicationId/condition/:conditionId/change-status', (req, res) => {
    if (req.body.conditionstatus === 'Met') {
      res.redirect(`/application/${req.params.applicationId}/condition/${req.params.conditionId}/change-status/confirm-met`)
    } else {
      res.redirect(`/application/${req.params.applicationId}/condition/${req.params.conditionId}/change-status/confirm-not-met`)
    }
  })

  router.get('/application/:applicationId/condition/:conditionId/change-status/confirm-met', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)
    const hasOnlyOneConditionNotMet = utils.hasOnlyOneConditionNotMet(application)
    res.render('offer/change-condition-status/confirm-met', {
      application,
      condition,
      hasOnlyOneConditionNotMet
    })
  })

  router.post('/application/:applicationId/condition/:conditionId/change-status/confirm-met', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)

    condition.status = req.session.data.conditionstatus

    if (utils.hasMetAllConditions(application)) {
      application.status = 'Conditions met'
    }

    req.flash('success', 'change-condition-status-to-met')
    res.redirect(`/application/${req.params.applicationId}/offer`)
  })

  router.get('/application/:applicationId/condition/:conditionId/change-status/confirm-not-met', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)
    res.render('offer/change-condition-status/confirm-not-met', {
      application,
      condition
    })
  })

  router.post('/application/:applicationId/condition/:conditionId/change-status/confirm-not-met', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)

    condition.status = req.session.data.conditionstatus

    application.status = 'Conditions not met'

    req.flash('success', 'change-condition-status-to-not-met')
    res.redirect(`/application/${req.params.applicationId}/offer`)
  })
}
