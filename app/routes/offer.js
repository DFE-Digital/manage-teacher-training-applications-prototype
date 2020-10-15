const utils = require('../data/application-utils')
const { v4: uuidv4 } = require('uuid')
const _ = require('lodash');

module.exports = router => {

  router.get('/application/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/offer/index', {
      application,
      conditions: utils.getConditions(application)
    })
  })

  router.get('/application/:applicationId/offer/defer/check', (req, res) => {
    res.render('application/offer/defer/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/defer/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Deferred'
    application.events.items.push({
      date: new Date().toISOString(),
      user: "Alicia Grenada",
      title: "Offer deferred"
    })

    req.flash('success', 'Offer successfully deferred')
    res.redirect(`/application/${applicationId}/offer`)
  })

  router.get('/application/:applicationId/offer/edit-conditions', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    if(!req.session.data['edit-conditions'] || !req.session.data['edit-conditions']['standard-conditions']) {
      var standardConditions = application.offer.standardConditions.map(condition => {
        return condition.description
      })
    }

    // cleanse data gah
    if(req.session.data['edit-conditions'] && req.session.data['edit-conditions']['conditions']) {
      req.session.data['edit-conditions']['conditions'] = req.session.data['edit-conditions']['conditions'].filter(c => c != '')
    }


    res.render('application/offer/edit-conditions/index', {
      application,
      standardConditions
    })
  })

  router.post('/application/:applicationId/offer/edit-conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/edit-conditions/check`)
  })

  router.get('/application/:applicationId/offer/edit-conditions/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    var conditions = []

    if(req.session.data['edit-conditions']['standard-conditions'].length) {
      conditions = conditions.concat(req.session.data['edit-conditions']['standard-conditions'])
    }

    req.session.data['edit-conditions']['conditions'].filter(c => c != '').forEach(c => {
      conditions.push(c)
    })

    res.render('application/offer/edit-conditions/check', {
      application,
      conditions
    })
  })

  router.post('/application/:applicationId/offer/edit-conditions/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    // save standard conditions
    application.offer.standardConditions = [];
    if(req.session.data['edit-conditions']['standard-conditions'].length) {
      req.session.data['edit-conditions']['standard-conditions'].forEach(condition => {
        application.offer.standardConditions.push({
          id: uuidv4(),
          description: condition,
          status: "Pending"
        })
      });
    }

    // save further conditions
    application.offer.conditions = [];

    req.session.data['edit-conditions']['conditions'].filter(c => c != '').forEach(c => {
      application.offer.conditions.push({
        id: uuidv4(),
        description: c,
        status: "Pending"
      })
    })

    req.flash('success', 'Offer updated successfully')
    res.redirect(`/application/${req.params.applicationId}/offer`)
  })


  // delete a condition
  router.get('/application/:applicationId/condition/:conditionId/delete', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = utils.getCondition(application, req.params.conditionId)
    const remainingConditions = utils.getConditions(application).filter(c => c.id !== condition.id)
    let hasRemainingConditions = remainingConditions.length;
    let allRemainingConditionsComplete = false;
    if(remainingConditions.length) {
      allRemainingConditionsComplete = remainingConditions.every(condition => condition.status == "Met")
    }

    res.render('application/offer/delete-condition/index', {
      application,
      condition,
      hasRemainingConditions,
      allRemainingConditionsComplete
    })
  })

  router.post('/application/:applicationId/condition/:conditionId/delete', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    utils.deleteCondition(application, req.params.conditionId)

    if(utils.getConditions(application).length == 0) {
      application.status = "Conditions met";
    }

    req.flash('success', 'Condition deleted successfully')
    res.redirect(`/application/${req.params.applicationId}/offer`)

  })


  // Edit condition statuses (in bulk)
  router.get('/application/:applicationId/offer/edit-condition-statuses', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const conditions = utils.getConditions(application)

    res.render('application/offer/edit-condition-statuses/index', {
      application,
      conditions
    })
  })

  router.post('/application/:applicationId/offer/edit-condition-statuses', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    res.redirect(`/application/${req.params.applicationId}/offer/edit-condition-statuses/check`)
  })

  router.get('/application/:applicationId/offer/edit-condition-statuses/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    // mixin new data statuses with conditions
    let conditions = utils.getConditions(application).map(condition => {
      return {
        id: condition.id,
        description: condition.description,
        status: req.session.data['edit-condition-statuses']['conditions'][condition.id]
      }
    })

    let hasNotMetConditions = _.some(conditions, (condition) => {
      return condition.status === "Not met"
    })

    let allConditionsMet = _.every(conditions, (condition) => {
      return condition.status === "Met"
    })

    res.render('application/offer/edit-condition-statuses/check', {
      application,
      conditions,
      hasNotMetConditions,
      allConditionsMet
    })
  })

  router.post('/application/:applicationId/offer/edit-condition-statuses/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let conditions = utils.getConditions(application).forEach(c => {
      let condition = utils.getCondition(application, c.id)
      condition.status = req.session.data['edit-condition-statuses']['conditions'][condition.id]
    })

    if (utils.hasMetAllConditions(application)) {
      application.status = 'Conditions met'
    }

    if(utils.getConditions(application).some(c => c.status == "Not met")) {
      application.status = 'Conditions not met'
    }

    req.flash('success', 'Status of conditions updated successfully')
    res.redirect(`/application/${req.params.applicationId}/offer`)

  })

  // delete conditions (in bulk)
  router.get('/application/:applicationId/offer/delete-conditions', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const conditionItems = utils.getConditions(application).map(c => {
      return {
        value: c.description,
        text: c.description
      }
    })

    res.render('application/offer/delete-conditions/index', {
      application,
      conditionItems
    })
  })

  router.post('/application/:applicationId/offer/delete-conditions', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    res.redirect(`/application/${req.params.applicationId}/offer/delete-conditions/check`)
  })

  router.get('/application/:applicationId/offer/delete-conditions/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const remainingConditions = utils.getConditions(application)
      .filter(c => !req.session.data['delete-conditions'].conditions.includes(c.description))

    const hasRemainingConditions = remainingConditions.length
    let allRemainingConditionsComplete = false;
    if(remainingConditions.length) {
      allRemainingConditionsComplete = remainingConditions.every(condition => condition.status == "Met")
    }

    res.render('application/offer/delete-conditions/check', {
      application,
      hasRemainingConditions,
      allRemainingConditionsComplete
    })
  })

  router.post('/application/:applicationId/offer/delete-conditions/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    // delete conditions
    utils.getConditions(application)
      .filter(c => req.session.data['delete-conditions'].conditions.includes(c.description))
      .forEach(c => {
        utils.deleteCondition(application, c.id)
      })

    if(utils.getConditions(application).length == 0 || !utils.hasPendingConditions(application)) {
      application.status = "Conditions met";
    }

    req.flash('success', 'Conditions successfully deleted')
    res.redirect(`/application/${req.params.applicationId}/offer`)

  })
}
