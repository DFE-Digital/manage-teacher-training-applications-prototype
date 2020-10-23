module.exports = router => {
  router.get('/application/:applicationId/offer/change-course', (req, res) => {
    res.render('application/offer/edit-course/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/change-course/location`)
  })

  router.get('/application/:applicationId/offer/change-course/location', (req, res) => {
    res.render('application/offer/edit-course/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-course/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/change-course/confirm`)
  })

  router.get('/application/:applicationId/offer/change-course/confirm', (req, res) => {
    res.render('application/offer/edit-course/confirm', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-course/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    req.flash('success', 'Offer successfully changed')
    res.redirect(`/application/${applicationId}/offer`)
  })
}
