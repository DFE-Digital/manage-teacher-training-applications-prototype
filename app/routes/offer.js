const ApplicationHelper = require('../data/helpers/application')
const { v4: uuidv4 } = require('uuid')
const _ = require('lodash');

module.exports = router => {

  router.get('/applications/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/offer/show', {
      application,
      conditions: ApplicationHelper.getConditions(application),
      statusText: ApplicationHelper.getStatusText(application)
    })
  })

  router.get('/applications/:applicationId/offer/defer/check', (req, res) => {
    res.render('applications/offer/defer/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/defer/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Deferred'
    application.events.items.push({
      date: new Date().toISOString(),
      user: "Alicia Grenada",
      title: "Offer deferred"
    })

    req.flash('success', 'Offer successfully deferred')
    res.redirect(`/applications/${applicationId}/offer`)
  })

  router.get('/applications/:applicationId/offer/edit-conditions', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let standardConditions;
    let conditions;

    if(!req.session.data['edit-conditions'] || !req.session.data['edit-conditions']['standard-conditions']) {
      standardConditions = application.offer.standardConditions.map(condition => {
        return condition.description
      })
    }

    // cleanse data gah
    if(req.session.data['edit-conditions'] && req.session.data['edit-conditions']['conditions']) {
      req.session.data['edit-conditions']['conditions'] = req.session.data['edit-conditions']['conditions'].filter(c => c != '')
    }

    // if the form has been used in some way
    if(req.session.data['edit-conditions']) {
      conditions = req.session.data['edit-conditions']['conditions']
    } else {
      conditions = application.offer.conditions.map(c => {
        return c.description
      })
    }

    res.render('applications/offer/edit-conditions/index', {
      application,
      standardConditions,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit-conditions', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-conditions/check`)
  })

  router.get('/applications/:applicationId/offer/edit-conditions/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    var conditions = []

    if(req.session.data['edit-conditions']['standard-conditions'] && req.session.data['edit-conditions']['standard-conditions'].length) {
      conditions = conditions.concat(req.session.data['edit-conditions']['standard-conditions'])
    }

    req.session.data['edit-conditions']['conditions'].filter(c => c != '').forEach(c => {
      conditions.push(c)
    })

    conditions = conditions.map(c => {
      return {
        description: c,
        status: "Pending"
      }
    })

    res.render('applications/offer/edit-conditions/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit-conditions/check', (req, res) => {
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

    req.flash('success', 'New offer sent')
    res.redirect(`/applications/${req.params.applicationId}/offer`)
  })


  // delete a condition
  router.get('/applications/:applicationId/condition/:conditionId/delete', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const condition = ApplicationHelper.getCondition(application, req.params.conditionId)
    const remainingConditions = ApplicationHelper.getConditions(application).filter(c => c.id !== condition.id)
    let hasRemainingConditions = remainingConditions.length;
    let allRemainingConditionsComplete = false;
    if(remainingConditions.length) {
      allRemainingConditionsComplete = remainingConditions.every(condition => condition.status == "Met")
    }

    res.render('applications/offer/delete-condition/index', {
      application,
      condition,
      hasRemainingConditions,
      allRemainingConditionsComplete
    })
  })

  router.post('/applications/:applicationId/condition/:conditionId/delete', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    ApplicationHelper.deleteCondition(application, req.params.conditionId)

    if(Application.getConditions(application).length == 0) {
      application.status = "Conditions met";
    }

    req.flash('success', 'Condition deleted successfully')
    res.redirect(`/applications/${req.params.applicationId}/offer`)

  })


  // Edit condition statuses (in bulk)
  router.get('/applications/:applicationId/offer/edit-condition-statuses', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const conditions = ApplicationHelper.getConditions(application)

    res.render('applications/offer/edit-condition-statuses/index', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit-condition-statuses', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    res.redirect(`/applications/${req.params.applicationId}/offer/edit-condition-statuses/check`)
  })

  router.get('/applications/:applicationId/offer/edit-condition-statuses/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    // mixin new data statuses with conditions
    let conditions = ApplicationHelper.getConditions(application).map(condition => {
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

    res.render('applications/offer/edit-condition-statuses/check', {
      application,
      conditions,
      hasNotMetConditions,
      allConditionsMet
    })
  })

  router.post('/applications/:applicationId/offer/edit-condition-statuses/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let conditions = ApplicationHelper.getConditions(application).forEach(c => {
      let condition = ApplicationHelper.getCondition(application, c.id)
      condition.status = req.session.data['edit-condition-statuses']['conditions'][condition.id]
    })

    var flash = "Status of conditions updated"

    if (ApplicationHelper.hasMetAllConditions(application)) {
      application.status = 'Conditions met';
      flash = "Conditions marked as met";
      ApplicationHelper.addEvent(application, {
        "title": "Conditions marked as met",
        "user": "Ben Brown",
        "date": new Date().toISOString()
      })
    } else if(ApplicationHelper.getConditions(application).some(c => c.status == "Not met")) {
      application.status = 'Conditions not met';
      flash = "Conditions marked as not met";
      ApplicationHelper.addEvent(application, {
        "title": "Conditions marked as not met",
        "user": "Ben Brown",
        "date": new Date().toISOString()
      })
    } else {
      ApplicationHelper.addEvent(application, {
        "title": "Status of conditions updated",
        "user": "Ben Brown",
        "date": new Date().toISOString()
      })
    }



    req.flash('success', flash)
    res.redirect(`/applications/${req.params.applicationId}/offer`)

  })

  // delete conditions (in bulk)
  router.get('/applications/:applicationId/offer/delete-conditions', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const conditionItems = ApplicationHelper.getConditions(application).map(c => {
      return {
        value: c.description,
        text: c.description
      }
    })

    res.render('applications/offer/delete-conditions/index', {
      application,
      conditionItems
    })
  })

  router.post('/applications/:applicationId/offer/delete-conditions', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    res.redirect(`/applications/${req.params.applicationId}/offer/delete-conditions/check`)
  })

  router.get('/applications/:applicationId/offer/delete-conditions/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const remainingConditions = ApplicationHelper.getConditions(application)
      .filter(c => !req.session.data['delete-conditions'].conditions.includes(c.description))

    const hasRemainingConditions = remainingConditions.length
    let allRemainingConditionsComplete = false;
    if(remainingConditions.length) {
      allRemainingConditionsComplete = remainingConditions.every(condition => condition.status == "Met")
    }

    res.render('applications/offer/delete-conditions/check', {
      application,
      hasRemainingConditions,
      allRemainingConditionsComplete
    })
  })

  router.post('/applications/:applicationId/offer/delete-conditions/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    // delete conditions
    ApplicationHelper.getConditions(application)
      .filter(c => req.session.data['delete-conditions'].conditions.includes(c.description))
      .forEach(c => {
        ApplicationHelper.deleteCondition(application, c.id)
      })

    if(Application.getConditions(application).length == 0 || !Application.hasPendingConditions(application)) {
      application.status = "Conditions met";
    }

    req.flash('success', 'Conditions successfully deleted')
    res.redirect(`/applications/${req.params.applicationId}/offer`)

  })
}
