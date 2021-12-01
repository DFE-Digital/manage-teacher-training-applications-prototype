
module.exports = router => {

  router.get('/applications/:applicationId/course/edit/provider', (req, res) => {
    res.render('applications/course/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/course`)
  })

  router.get('/applications/:applicationId/course/edit/course', (req, res) => {
    res.render('applications/course/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/study-mode`)
  })

  router.get('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    res.render('applications/course/study-mode', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/location`)
  })

  router.get('/applications/:applicationId/course/edit/location', (req, res) => {
    res.render('applications/course/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/funding-type`)
  })

  router.get('/applications/:applicationId/course/edit/funding-type', (req, res) => {
    res.render('applications/course/funding-type', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/funding-type', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}`)
  })

}
