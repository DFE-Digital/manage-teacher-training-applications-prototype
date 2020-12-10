const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/applications/:applicationId/offer/edit-location', (req, res) => {
    res.render('application/offer/edit-location/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-location/check`)
  })

  router.get('/applications/:applicationId/offer/edit-location/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions = utils.getConditions(application)

    res.render('application/offer/edit-location/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit-location/check', (req, res) => {
    const applicationId = req.params.applicationId
    req.flash('success', 'New offer sent')
    res.redirect(`/applications/${applicationId}/offer`)
  })
}
