module.exports = router => {

  router.get('/application/:applicationId/offer/course/edit', (req, res) => {
    res.render('offer/course/edit-course', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/course/edit', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/course/edit-location`);
  })

  router.get('/application/:applicationId/offer/course/edit-location', (req, res) => {
    res.render('offer/course/edit-location', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/course/edit-location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/offer/course/edit-confirm`);
  })

  router.get('/application/:applicationId/offer/course/edit-confirm', (req, res) => {
    res.render('offer/course/edit-confirm', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/offer/course/edit-confirm', (req, res) => {
    const applicationId = req.params.applicationId
    // const application = req.session.data.applications[applicationId]
    req.flash('success', 'change-offer-course')
    res.redirect(`/application/${applicationId}`)
  })

}
