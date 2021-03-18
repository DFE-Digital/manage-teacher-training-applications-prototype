const ApplicationHelper = require('../data/helpers/application')
const { v4: uuidv4 } = require('uuid')
const _ = require('lodash');

module.exports = router => {

  router.get('/applications/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/offer/show', {
      application,
      conditions: ApplicationHelper.getConditions(application.offer),
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

    req.flash('success', 'Offer deferred')
    res.redirect(`/applications/${applicationId}/offer`)
  })

  // Edit condition statuses (in bulk)
  router.get('/applications/:applicationId/offer/edit-condition-statuses', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const conditions = ApplicationHelper.getConditions(application.offer)

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
    let conditions = ApplicationHelper.getConditions(application.offer).map(condition => {
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

    let conditions = ApplicationHelper.getConditions(application.offer).forEach(c => {
      let condition = ApplicationHelper.getCondition(application.offer, c.id)
      condition.status = req.session.data['edit-condition-statuses']['conditions'][condition.id]
    })

    var flash

    if (ApplicationHelper.hasMetAllConditions(application.offer)) {
      application.status = 'Ready to enroll';
      flash = "Conditions marked as met";
      ApplicationHelper.addEvent(application, {
        title: "Conditions marked as met",
        user: "Ben Brown",
        date: new Date().toISOString(),
        meta: {
          offer: {
            provider: application.offer.provider,
            course: application.offer.course,
            location: application.offer.location,
            accreditedBody: application.offer.accreditedBody,
            conditions: ApplicationHelper.getConditions(application.offer)
          }
        }
      })
    } else if(ApplicationHelper.getConditions(application.offer).some(c => c.status == "Not met")) {
      application.status = 'Conditions not met';
      flash = "Conditions marked as not met";
      ApplicationHelper.addEvent(application, {
        title: "Conditions marked as not met",
        user: "Ben Brown",
        date: new Date().toISOString(),
        meta: {
          offer: {
            provider: application.offer.provider,
            course: application.offer.course,
            location: application.offer.location,
            accreditedBody: application.offer.accreditedBody,
            conditions: ApplicationHelper.getConditions(application.offer)
          }
        }
      })
    } else {
      flash = "Status of conditions updated"
      ApplicationHelper.addEvent(application, {
        title: "Status of conditions updated",
        user: "Ben Brown",
        date: new Date().toISOString(),
        meta: {
          offer: {
            provider: application.offer.provider,
            course: application.offer.course,
            location: application.offer.location,
            accreditedBody: application.offer.accreditedBody,
            conditions: ApplicationHelper.getConditions(application.offer)
          }
        }
      })
    }

    req.flash('success', flash)
    res.redirect(`/applications/${req.params.applicationId}/offer`)
  })

}
