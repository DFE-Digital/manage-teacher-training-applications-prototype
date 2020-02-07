module.exports = router => {

  router.get('/application/:applicationId/different-course', (req, res) => {
    res.render(`application/different-course`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/different-course', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    var changing = req.body['course-change'];

    if (changing === 'provider') {
      res.redirect(`/application/${applicationId}/different-course/provider`)
    } else if (changing === 'course') {
      res.redirect(`/application/${applicationId}/different-course/course`)
    } else if (changing === 'location') {
      res.redirect(`/application/${applicationId}/different-course/location`)
    }
  })

  router.get('/application/:applicationId/different-course/provider', (req, res) => {
    res.render(`application/different-course--provider`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/different-course/provider', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/different-course/course`)
  })

  router.get('/application/:applicationId/different-course/course', (req, res) => {
    res.render(`application/different-course--course`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/different-course/course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/different-course/location`)
  })

  router.get('/application/:applicationId/different-course/location', (req, res) => {
    res.render(`application/different-course--location`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/different-course/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/different-course/conditions`)
  })

  router.get('/application/:applicationId/different-course/conditions', (req, res) => {
    res.render(`application/different-course--conditions`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/different-course/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/different-course/confirm`)
  })

  router.get('/application/:applicationId/different-course/confirm', (req, res) => {
    res.render(`application/different-course--confirm`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/different-course/confirm', (req, res) => {
    req.flash('success', 'different-course-offered')
    res.redirect(`/application/${req.params.applicationId}`)
  })
}
