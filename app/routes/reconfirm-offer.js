var uuid = require('uuid/v4');

module.exports = router => {

  router.get('/application/:applicationId/offer/reconfirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);

    if(application.offerCanNotBeReconfirmed) {
      if(application.offerCanNotBeReconfirmed.reason == 'location') {
        res.redirect(`/application/${applicationId}/offer/reconfirm/unavailable-location`)
      } else {
        res.redirect(`/application/${applicationId}/offer/reconfirm/unavailable-course`)
      }
    } else {
      res.render(`offer/reconfirm/check`, {
        applicationId: applicationId,
        conditions: conditions
      })
    }
  })

  router.post('/application/:applicationId/offer/reconfirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];

    application.offer = {
      madeDate: new Date().toISOString()
    };

    application.status = 'Conditions met'; // work this out

    application.offer.standardConditions = application.previousOffer.standardConditions;
    application.offer.conditions = application.previousOffer.conditions;

    req.flash('success', 'offer-reconfirmed');
    res.redirect(`/application/${applicationId}/offer`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);

    res.render(`offer/reconfirm/unavailable-location/action`, {
      applicationId: applicationId,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-location/location`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location/location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);

    res.render(`offer/reconfirm/unavailable-location/location`, {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-location/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];

    res.render(`offer/reconfirm/unavailable-location/conditions`, {
      application: application,
      standardConditions: application.previousOffer.standardConditions,
      furtherConditions: application.previousOffer.conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-location/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-location/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);
    res.render(`offer/reconfirm/unavailable-location/check`, {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-location/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];

    application.offer = {
      madeDate: new Date().toISOString(),
      provider: req.session.data.organisations[0].name,
      course: 'Primary (5-11) (X100)',
      locationname: req.session.data.location
    };

    application.status = 'Conditions met'; // work this out

    application.offer.standardConditions = application.previousOffer.standardConditions;
    application.offer.conditions = application.previousOffer.conditions;

    req.flash('success', 'offer-reconfirmed');
    res.redirect(`/application/${applicationId}/offer`)
  })





  router.get('/application/:applicationId/offer/reconfirm/unavailable-course', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);

    res.render(`offer/reconfirm/unavailable-course/action`, {
      applicationId: applicationId,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/provider`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/provider', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);

    res.render(`offer/reconfirm/unavailable-course/provider`, {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/provider', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/course`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/course', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);
    res.render(`offer/reconfirm/unavailable-course/course`, {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/location`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/location', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);

    res.render(`offer/reconfirm/unavailable-course/location`, {
      application: application,
      conditions: conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];

    res.render(`offer/reconfirm/unavailable-course/conditions`, {
      application: application,
      standardConditions: application.previousOffer.standardConditions,
      furtherConditions: application.previousOffer.conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/unavailable-course/check`)
  })

  router.get('/application/:applicationId/offer/reconfirm/unavailable-course/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);
    res.render(`offer/reconfirm/unavailable-course/check`, {
      application: application,
      conditions: conditions
    })
  })


  router.post('/application/:applicationId/offer/reconfirm/unavailable-course/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];

    application.offer = {
      madeDate: new Date().toISOString(),
      provider: 'data.organisations[0].name',
      course: 'Primary (5-11) (X100)',
      locationname: req.session.data.location
    };

    application.status = 'Conditions met'; // work this out

    application.offer.standardConditions = application.previousOffer.standardConditions;
    application.offer.conditions = application.previousOffer.conditions;

    req.flash('success', 'offer-reconfirmed');
    res.redirect(`/application/${applicationId}/offer`)
  })








  router.get('/application/:applicationId/offer/reconfirm/provider', (req, res) => {
    res.render(`offer/reconfirm/provider`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/provider', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/course`)
  })

  router.get('/application/:applicationId/offer/reconfirm/course', (req, res) => {
    res.render(`offer/reconfirm/course`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/location`)
  })

  router.get('/application/:applicationId/offer/reconfirm/location', (req, res) => {
    res.render(`offer/reconfirm/location`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm/conditions`)
  })

  router.get('/application/:applicationId/offer/reconfirm/conditions', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    application.offerAvailable = true;

    res.render(`offer/reconfirm/conditions`, {
      application: application,
      standardConditions: application.previousOffer.standardConditions,
      furtherConditions: application.previousOffer.conditions
    })
  })

  router.post('/application/:applicationId/offer/reconfirm/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/reconfirm`)
  })

}
