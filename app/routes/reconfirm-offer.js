var uuid = require('uuid/v4');

module.exports = router => {

  router.get('/application/:applicationId/offer/reconfirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId];
    const conditions = application.previousOffer.standardConditions.concat(application.previousOffer.conditions);

    res.render(`offer/reconfirm/check`, {
      applicationId: applicationId,
      conditions: conditions
    })
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

}
