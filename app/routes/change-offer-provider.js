module.exports = router => {
  router.get('/application/:applicationId/offer/change-provider', (req, res) => {
    res.render('application/offer/edit-provider/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-provider', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/change-provider/course`)
  })

  router.get('/application/:applicationId/offer/change-provider/course', (req, res) => {
    res.render('application/offer/edit-provider/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-provider/course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/change-provider/location`)
  })

  router.get('/application/:applicationId/offer/change-provider/location', (req, res) => {
    res.render('application/offer/edit-provider/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-provider/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/change-provider/confirm`)
  })

  router.get('/application/:applicationId/offer/change-provider/confirm', (req, res) => {
    res.render('application/offer/edit-provider/confirm', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-provider/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    // const application = req.session.data.applications.find(app => app.id == applicationId)
    req.flash('success', 'Offer successfully changed')
    res.redirect(`/application/${applicationId}/offer`)
  })
}
