module.exports = router => {

  router.get('/application/:applicationId/offer/location/edit', (req, res) => {
    res.render('offer/location/edit', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/location/edit', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/location/edit/confirm`);
  })

  router.get('/application/:applicationId/offer/location/edit/confirm', (req, res) => {
    res.render('offer/location/edit-confirm', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/location/edit/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    // const application = req.session.data.applications[applicationId]
    req.flash('success', 'change-offer-location')
    res.redirect(`/application/${applicationId}`)
  })

}
