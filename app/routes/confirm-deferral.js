const ApplicationHelper = require('../data/helpers/application')
const CycleHelper = require('../data/helpers/cycles')

module.exports = router => {

  router.get('/applications/:applicationId/offer/reconfirm/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('applications/offer/confirm-deferral/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.madeDate = new Date().toISOString()
    application.status = 'Conditions pending' // work this out
    application.cycle = CycleHelper.CURRENT_CYCLE.code

    ApplicationHelper.addEvent(application, {
      date: new Date().toISOString(),
      user: "Alicia Grenada",
      title: "Offer reconfirmed",
      meta: {
        offer: {
          provider: application.offer.provider,
          course: application.offer.course,
          location: application.offer.location,
          accreditedBody: application.offer.accreditedBody,
          conditions: application.offer.standardConditions.concat(application.offer.conditions)
        }
      }
    })
    req.flash('success', 'Deferred offer successfully confirmed for current cycle')
    res.redirect(`/applications/${applicationId}/offer`)
  })


  router.get('/applications/:applicationId/offer/reconfirm/location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('applications/offer/confirm-deferral/location', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/reconfirm/check`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('applications/offer/confirm-deferral/unavailable', {
      application
    })
  })

  router.get('/applications/:applicationId/offer/reconfirm/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.offerAvailable = true

    res.render('applications/offer/reconfirm/conditions', {
      application: application,
      standardConditions: application.offer.standardConditions,
      furtherConditions: application.offer.conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/conditions', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/reconfirm/check`)
  })

  /*************************************************************
   *
   * Unavailable location
   *
   ****************************************************************/

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-location/statuses', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('applications/offer/reconfirm/unavailable-location/statuses', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-location/statuses', (req, res) => {
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
    res.redirect(`/applications/${applicationId}/offer/reconfirm/unavailable-location/check`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-location/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/offer/reconfirm/unavailable-location/conditions', {
      application: application,
      standardConditions: application.offer.standardConditions,
      furtherConditions: application.offer.conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-location/conditions', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/reconfirm/unavailable-location/check`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-location/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('applications/offer/reconfirm/unavailable-location/check', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-location/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.madeDate = new Date().toISOString()
    application.offer.provider = req.session.data.trainingProviders[0].name
    application.offer.course = 'Primary (5-11) (X100)'
    application.offer.location = req.session.data.location

    application.status = 'Recruited' // work this out
    application.cycle = CycleHelper.CURRENT_CYCLE.code
    application.events.items.push({
      date: new Date().toISOString(),
      user: "Alicia Grenada",
      title: "Offer reconfirmed"
    })

    req.flash('success', 'Deferred offer successfully confirmed for current cycle')
    res.redirect(`/applications/${applicationId}/offer`)
  })

  /*************************************************************
   *
   * Unavailable course
   *
   ****************************************************************/

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-course', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('applications/offer/reconfirm/unavailable-course/action', {
      application,
      conditions: conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/reconfirm/unavailable-course/course`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-course/provider', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('applications/offer/reconfirm/unavailable-course/provider', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-course/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/reconfirm/unavailable-course/course`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-course/course', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('applications/offer/reconfirm/unavailable-course/course', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-course/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/reconfirm/unavailable-course/location`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-course/location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('applications/offer/reconfirm/unavailable-course/location', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-course/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/reconfirm/unavailable-course/statuses`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-course/statuses', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('applications/offer/reconfirm/unavailable-course/statuses', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-course/statuses', (req, res) => {
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
    res.redirect(`/applications/${applicationId}/offer/reconfirm/unavailable-course/check`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-course/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/offer/reconfirm/unavailable-course/conditions', {
      application: application,
      standardConditions: application.offer.standardConditions,
      furtherConditions: application.offer.conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-course/conditions', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/reconfirm/unavailable-course/check`)
  })

  router.get('/applications/:applicationId/offer/reconfirm/unavailable-course/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('applications/offer/reconfirm/unavailable-course/check', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/applications/:applicationId/offer/reconfirm/unavailable-course/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.madeDate = new Date().toISOString();
    application.offer.provider =  req.session.data.trainingProviders[0].name;
    application.offer.course = 'Primary (5-11) (X100)';
    application.offer.location = req.session.data.location;

    application.status = 'Recruited' // work this out
    application.cycle = CycleHelper.CURRENT_CYCLE.code
    application.events.items.push({
      date: new Date().toISOString(),
      user: "Alicia Grenada",
      title: "Offer reconfirmed"
    })

    req.flash('success', 'Deferred offer successfully confirmed for current cycle')
    res.redirect(`/applications/${applicationId}/offer`)
  })

}
