module.exports = router => {

  router.get('/application/:applicationId/offer/provider/edit', (req, res) => {
    res.render('offer/provider/edit-provider', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/provider/edit', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/provider/edit-course`);
  })

  router.get('/application/:applicationId/offer/provider/edit-course', (req, res) => {
    res.render('offer/provider/edit-course', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/provider/edit-course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/provider/edit-location`);
  })

  router.get('/application/:applicationId/offer/provider/edit-location', (req, res) => {
    res.render('offer/provider/edit-location', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/provider/edit-location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/provider/edit-confirm`);
  })

  router.get('/application/:applicationId/offer/provider/edit-confirm', (req, res) => {
    res.render('offer/provider/edit-confirm', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/provider/edit-confirm', (req, res) => {
    const applicationId = req.params.applicationId
    // const application = req.session.data.applications[applicationId]
    req.flash('success', 'change-offer-provider')
    res.redirect(`/application/${applicationId}`)
  })

}
