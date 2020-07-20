module.exports = router => {
  router.get('/application/:applicationId/offer/change-location', (req, res) => {
    res.render('offer/change-location/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/change-location/confirm`)
  })

  router.get('/application/:applicationId/offer/change-location/confirm', (req, res) => {
    res.render('offer/change-location/confirm', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-location/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    // const application = req.session.data.applications.find(app => app.id == applicationId)
    req.flash('success', 'change-offer-location')
    res.redirect(`/application/${applicationId}/offer`)
  })
}
