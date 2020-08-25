const utils = require('../data/application-utils')

module.exports = router => {

  /*************************************************************
   *
   * Course is available (happy path)
   *
   ****************************************************************/

  router.get('/application/:applicationId/offer/reconfirm', (req, res) => {
    const applicationId = req.params.applicationId

    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    if (application.offerCanNotBeReconfirmed) {
      if (application.offerCanNotBeReconfirmed.reason === 'location') {
        res.redirect(`/application/${applicationId}/offer/reconfirm/unavailable-location`)
      } else {
        res.redirect(`/application/${applicationId}/offer/reconfirm/unavailable-course`)
      }
    } else {
      res.redirect(`/application/${applicationId}/offer/reconfirm/statuses`)
    }
  })

  router.get('/application/:applicationId/offer/reconfirm/statuses', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('offer/reconfirm/statuses', {
      application,
      conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/statuses', (req, res) => {
    const applicationId = req.params.applicationId
    const data = req.session.data
    let newConditionStatuses = data.conditionStatus
    delete data.conditionStatus
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = utils.getConditions(application)
    conditions.forEach( (condition, index) => condition.status = newConditionStatuses[index])
    res.redirect(`/application/${applicationId}/offer/reconfirm/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/check-conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('offer/reconfirm/check-conditions', {
      application,
      conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/check-conditions', (req, res) => {
    const applicationId = req.params.applicationId

    if(req.body['add-or-change-conditions'] == "Yes") {
      res.redirect(`/application/${applicationId}/offer/reconfirm/conditions`)
    } else {
      res.redirect(`/application/${applicationId}/offer/reconfirm/check`)
    }

  })

  router.get('/application/:applicationId/offer/reconfirm/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('offer/reconfirm/check', {
      application,
      conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.madeDate = new Date().toISOString()
    application.status = 'Conditions met' // work this out

    req.flash('success', 'offer-reconfirmed')
    res.redirect(`/application/${applicationId}/offer`)
  })

  /*************************************************************
   *
   * Unavailable location
   *
   ****************************************************************/

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('offer/reconfirm/unavailable-location/action', {
      application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-location/location`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location/location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('offer/reconfirm/unavailable-location/location', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-location/statuses`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location/statuses', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('offer/reconfirm/unavailable-location/statuses', {
      application,
      conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location/statuses', (req, res) => {
    const applicationId = req.params.applicationId
    res.redirect(`/application/${applicationId}/offer/reconfirm/unavailable-location/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('offer/reconfirm/unavailable-location/conditions', {
      application: application,
      standardConditions: application.offer.standardConditions,
      furtherConditions: application.offer.conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-location/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('offer/reconfirm/unavailable-location/check', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.madeDate = new Date().toISOString()
    application.offer.provider = req.session.data.trainingProviders[0].name
    application.offer.course = 'Primary (5-11) (X100)'
    application.offer.locationname = req.session.data.location

    application.status = 'Conditions met' // work this out

    req.flash('success', 'offer-reconfirmed')
    res.redirect(`/application/${applicationId}/offer`)
  })

  /*************************************************************
   *
   * Unavailable course
   *
   ****************************************************************/

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('offer/reconfirm/unavailable-course/action', {
      application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/course`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/provider', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('offer/reconfirm/unavailable-course/provider', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/provider', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/course`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/course', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('offer/reconfirm/unavailable-course/course', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/location`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)

    res.render('offer/reconfirm/unavailable-course/location', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('offer/reconfirm/unavailable-course/conditions', {
      application: application,
      standardConditions: application.offer.standardConditions,
      furtherConditions: application.offer.conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const conditions = application.offer.standardConditions.concat(application.offer.conditions)
    res.render('offer/reconfirm/unavailable-course/check', {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.madeDate = new Date().toISOString();
    application.offer.provider =  req.session.data.trainingProviders[0].name;
    application.offer.course = 'Primary (5-11) (X100)';
    application.offer.locationname = req.session.data.location;

    application.status = 'Conditions met' // work this out

    req.flash('success', 'offer-reconfirmed')
    res.redirect(`/application/${applicationId}/offer`)
  })

  router.get('/application/:applicationId/offer/reconfirm/provider', (req, res) => {
    res.render('offer/reconfirm/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/provider', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/course`)
  })

  router.get('/application/:applicationId/offer/reconfirm/course', (req, res) => {
    res.render('offer/reconfirm/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/location`)
  })

  router.get('/application/:applicationId/offer/reconfirm/location', (req, res) => {
    res.render('offer/reconfirm/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/conditions`)
  })

  router.get('/application/:applicationId/offer/reconfirm/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.offerAvailable = true

    res.render('offer/reconfirm/conditions', {
      application: application,
      standardConditions: application.offer.standardConditions,
      furtherConditions: application.offer.conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/check`)
  })
}
