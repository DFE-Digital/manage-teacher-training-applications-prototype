const ApplicationHelper = require('../data/helpers/application')
const CycleHelper = require('../data/helpers/cycles')
const content = require('../data/content')
const { v4: uuidv4 } = require('uuid')

module.exports = router => {

  router.get('/applications/:applicationId/offer/confirm-deferred-offer/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    var conditions = []

    // if it's been submitted then build conditions from data
    if(req.session.data['confirm-deferred-offer'] && req.session.data['confirm-deferred-offer']['submitted-conditions-page'] == 'true') {

      // standard conditions
      if(req.session.data['confirm-deferred-offer']['standard-conditions'] && req.session.data['confirm-deferred-offer']['standard-conditions'].length) {
        conditions = conditions.concat(req.session.data['confirm-deferred-offer']['standard-conditions'])
      }

      if(req.session.data['confirm-deferred-offer']['conditions'] && req.session.data['confirm-deferred-offer']['conditions'].length) {
        req.session.data['confirm-deferred-offer']['conditions'].filter(c => c != '').forEach(c => {
          conditions.push(c)
        })
      }

      conditions = conditions.map(c => {
        return {
          description: c,
          status: "Pending"
        }
      })

    // not submitted, build from application.offer object
    } else {
      conditions = ApplicationHelper.getConditions(application.offer)
    }

    res.render('applications/offer/confirm-deferred-offer/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/confirm-deferred-offer/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.provider = req.session.data['confirm-deferred-offer'] && req.session.data['confirm-deferred-offer'].provider || application.offer.provider
    application.offer.course = req.session.data['confirm-deferred-offer'] && req.session.data['confirm-deferred-offer'].course || application.offer.course
    application.offer.location = req.session.data['confirm-deferred-offer'] && req.session.data['confirm-deferred-offer'].location || application.offer.location
    application.offer.studyMode = req.session.data['confirm-deferred-offer'] && req.session.data['confirm-deferred-offer'].studyMode || application.offer.studyMode

    // if it's been submitted then save conditions from data
    if(req.session.data['confirm-deferred-offer'] && req.session.data['confirm-deferred-offer']['submitted-conditions-page'] == 'true') {
      // save standard conditions
      application.offer.standardConditions = [];
      if(req.session.data['confirm-deferred-offer']['standard-conditions'] && req.session.data['confirm-deferred-offer']['standard-conditions'].length) {
        req.session.data['confirm-deferred-offer']['standard-conditions'].forEach(condition => {
          application.offer.standardConditions.push({
            id: uuidv4(),
            description: condition,
            status: "Pending"
          })
        });
      }

      // save further conditions
      application.offer.conditions = [];

      req.session.data['confirm-deferred-offer']['conditions'].filter(c => c != '').forEach(c => {
        application.offer.conditions.push({
          id: uuidv4(),
          description: c,
          status: "Pending"
        })
      })
    }

    ApplicationHelper.addEvent(application, {
      title: content.confirmDeferredOffer.event.title,
      user: "Ben Brown",
      date: new Date().toISOString(),
      meta: {
        offer: {
          provider: application.offer.provider,
          course: application.offer.course,
          location: application.offer.location,
          studyMode: application.offer.studyMode,
          accreditedBody: application.offer.accreditedBody,
          conditions: ApplicationHelper.getConditions(application.offer),
          qualifications: application.offer.qualifications,
          fundingType: application.offer.fundingType
        }
      }
    })

    application.offer.madeDate = new Date().toISOString()

    if(ApplicationHelper.hasMetAllConditions(application.offer)) {
      application.status = 'Recruited'
    } else {
      application.status = 'Conditions pending'
    }

    application.cycle = CycleHelper.CURRENT_CYCLE.code

    delete req.session.data['confirm-deferred-offer']

    req.flash('success', content.confirmDeferredOffer.successMessage)
    res.redirect(`/applications/${applicationId}/offer`)
  })


  router.get('/applications/:applicationId/offer/confirm-deferred-offer/location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('applications/offer/confirm-deferred-offer/location', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/applications/:applicationId/offer/confirm-deferred-offer/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/confirm-deferred-offer/check`)
  })

  router.get('/applications/:applicationId/offer/confirm-deferred-offer/unavailable', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('applications/offer/confirm-deferred-offer/unavailable', {
      application,
      conditions: ApplicationHelper.getConditions(application.offer)
    })
  })

  router.get('/applications/:applicationId/offer/confirm-deferred-offer/conditions', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let standardConditions;
    let conditions;

    if(!req.session.data['confirm-deferred-offer'] || !req.session.data['confirm-deferred-offer']['standard-conditions']) {

      if(application.offer.standardConditions) {
        standardConditions = application.offer.standardConditions.map(condition => {
          return condition.description
        })
      }

    }

    // cleanse data gah
    if(req.session.data['confirm-deferred-offer'] && req.session.data['confirm-deferred-offer']['conditions']) {
      req.session.data['confirm-deferred-offer']['conditions'] = req.session.data['confirm-deferred-offer']['conditions'].filter(c => c != '')
    }

    // if the form has been used in some way
    if(req.session.data['confirm-deferred-offer'] && req.session.data['confirm-deferred-offer']['submitted-conditions-page'] == 'true') {
      conditions = req.session.data['confirm-deferred-offer']['conditions']
    } else {
      if(application.offer.conditions) {
        conditions = application.offer.conditions.map(c => {
          return c.description
        })
      }
    }

    res.render('applications/offer/confirm-deferred-offer/conditions', {
      application,
      standardConditions,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/confirm-deferred-offer/conditions', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/confirm-deferred-offer/check`)
  })

  router.get('/applications/:applicationId/offer/confirm-deferred-offer/statuses', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    let conditions = []

    if(application.offer.standardConditions) {
      conditions = conditions.concat(application.offer.standardConditions)
    }

    if(application.offer.conditions) {
      conditions = conditions.concat(application.offer.conditions)
    }

    res.render('applications/offer/confirm-deferred-offer/statuses', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/confirm-deferred-offer/statuses', (req, res) => {
    const applicationId = req.params.applicationId
    const data = req.session.data
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = ApplicationHelper.getConditions(application.offer)
    if (data.allConditionsMet){
      let allConditionsMet = (data.allConditionsMet == 'true') ? true : false
      delete data.allConditionsMet
      conditions.forEach( (condition, index) => condition.status = (allConditionsMet)? 'Met' : 'Pending')
    }
    if (data.conditionStatus){
      let newConditionStatuses = data.conditionStatus
      delete data.conditionStatus
      conditions.forEach( (condition, index) => condition.status = newConditionStatuses[index])
    }
    res.redirect(`/applications/${applicationId}/offer/confirm-deferred-offer/check`)
  })



}
