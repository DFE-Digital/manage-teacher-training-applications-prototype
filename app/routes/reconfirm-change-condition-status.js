const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/application/:applicationId/reconfirm/condition/:conditionId/change-status', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    console.log('hello world')
    const condition = utils.getCondition(application, req.params.conditionId)
    res.render('offer/reconfirm/change-condition-status/status', {
      application,
      condition
    })
  })

  router.post('/application/:applicationId/reconfirm/condition/:conditionId/change-status', (req, res) => {
    const data = req.session.data
    let conditionStatus = data.conditionstatus

    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)

    let previousStatus = condition.status
    let statusChanged = (previousStatus != conditionStatus)? true : false

    // Confirm not met as it's dangerous
    if (conditionStatus == "Not met"){
      res.redirect(`/application/${req.params.applicationId}/reconfirm/condition/${req.params.conditionId}/change-status/confirm-not-met`)
    }
    else {

      // Flash messages not built yet
      // if (statusChanged){
      //   if (conditionStatus == "Pending"){
      //     req.flash('success', 'change-condition-status-to-pending')
      //   }
      //   if (conditionStatus == "Met"){
      //     req.flash('success', 'change-condition-status-to-met')
      //   }
      // }
      condition.status = req.session.data.conditionstatus

      res.redirect(`/application/${req.params.applicationId}/offer/reconfirm`)
    }
  })

  // Routes below here not used for now

  // router.get('/application/:applicationId/reconfirm/condition/:conditionId/change-status/confirm-met', (req, res) => {
  //   const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
  //   const condition = utils.getCondition(application, req.params.conditionId)
  //   const hasOnlyOneConditionNotMet = utils.hasOnlyOneConditionNotMet(application)
  //   res.render('offer/reconfirm/change-condition-status/confirm-met', {
  //     application,
  //     condition,
  //     hasOnlyOneConditionNotMet
  //   })
  // })

  // router.post('/application/:applicationId/reconfirm/condition/:conditionId/change-status/confirm-met', (req, res) => {
  //   const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
  //   const condition = utils.getCondition(application, req.params.conditionId)

  //   condition.status = req.session.data.conditionstatus

  //   if (utils.hasMetAllConditions(application)) {
  //     // application.status = 'Conditions met'
  //   }

  //   req.flash('success', 'change-condition-status-to-met')
  //   res.redirect(`/application/${req.params.applicationId}/offer/reconfirm`)
  // })

  router.get('/application/:applicationId/reconfirm/condition/:conditionId/change-status/confirm-not-met', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)
    res.render('offer/reconfirm/change-condition-status/confirm-not-met', {
      application,
      condition
    })
  })

  router.post('/application/:applicationId/reconfirm/condition/:conditionId/change-status/confirm-not-met', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)

    condition.status = req.session.data.conditionstatus

    // application.status = 'Conditions not met'

    req.flash('success', 'change-condition-status-to-not-met')
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm`)
  })
}
