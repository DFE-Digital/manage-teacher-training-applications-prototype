/**
 * Application routes
 */
module.exports = router => {
  // Render application page
  router.all('/', (req, res) => {
    res.render('index', {
      status: req.query.status
    })
  })

  // Render application page
  router.all('/application/:applicationId', (req, res) => {
    res.render('application/index', {
      applicationId: req.params.applicationId,
      status: req.query.status
    })
  })

  router.post('/application/:applicationId/decision/answer', (req, res) => {
    if (req.body.status === 'offer-conditional') {
      res.redirect(`/application/${req.params.applicationId}/conditions`)
    } else if (req.body.status === 'offer-unconditional') {
      res.redirect(`/application/${req.params.applicationId}/confirm?type=unconditional`)
    } else {
      res.redirect(`/application/${req.params.applicationId}`)
    }
  })

  router.all('/application/:applicationId/confirm', (req, res) => {
    const type = req.query.type

    res.render('application/confirm', {
      applicationId: req.params.applicationId,
      type
    })
  })

  // Render other application pages
  router.all('/application/:applicationId/:view', (req, res) => {
    res.render(`application/${req.params.view}`, {
      applicationId: req.params.applicationId
    })
  })
}
