const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/applications/:applicationId/offer/edit-provider', (req, res) => {
    res.render('applications/offer/edit-provider/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-provider/course`)
  })

  router.get('/applications/:applicationId/offer/edit-provider/course', (req, res) => {
    res.render('applications/offer/edit-provider/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-provider/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-provider/location`)
  })

  router.get('/applications/:applicationId/offer/edit-provider/location', (req, res) => {
    res.render('applications/offer/edit-provider/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit-provider/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit-provider/check`)
  })

  router.get('/applications/:applicationId/offer/edit-provider/check', (req, res) => {
    let application =  req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions = utils.getConditions(application)
    res.render('applications/offer/edit-provider/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit-provider/check', (req, res) => {
    const applicationId = req.params.applicationId
    req.flash('success', 'New offer sent')
    res.redirect(`/applications/${applicationId}/offer`)
  })
}
