module.exports = router => {
  router.get('/application/:applicationId/offer/change-course', (req, res) => {
    res.render('offer/change-course/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/change-course/location`)
  })

  router.get('/application/:applicationId/offer/change-course/location', (req, res) => {
    res.render('offer/change-course/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-course/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/change-course/confirm`)
  })

  router.get('/application/:applicationId/offer/change-course/confirm', (req, res) => {
    res.render('offer/change-course/confirm', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/change-course/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    // const application = req.session.data.applications.find(app => app.id == applicationId)
    req.flash('success', 'change-offer-course')
    res.redirect(`/application/${applicationId}/offer`)
  })
}
