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

  // Submit decision
  router.post('/application/:applicationId/decision', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]
    const { decision } = req.body

    if (decision === 'offer-conditional') {
      res.redirect(`/application/${applicationId}/offer`)
    } else if (decision === 'offer-unconditional') {
      res.redirect(`/application/${applicationId}/confirm?type=unconditional`)
    } else {
      // Update application status with rejection decision
      const rejected = {
        date: new Date().toISOString(),
        reason: req.body['reject-reason'] || '',
        comments: req.body['reject-comments'] || ''
      }
      application.status.rejected = rejected

      res.redirect(`/application/${req.params.applicationId}`)
    }
  })

  // Submit offer conditions
  router.post('/application/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Update application status with offer conditions
    application.status.offer = {}
    const conditions = []
    if (req.body['condition-1']) { conditions.push(req.body['condition-1']) }
    if (req.body['condition-2']) { conditions.push(req.body['condition-2']) }
    if (req.body['condition-3']) { conditions.push(req.body['condition-3']) }
    if (req.body['condition-4']) { conditions.push(req.body['condition-4']) }
    application.status.offer.conditions = conditions

    res.redirect(`/application/${applicationId}/confirm?type=conditional`)
  })

  // Show offer confirmation
  router.get('/application/:applicationId/confirm', (req, res) => {
    const type = req.query.type
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Get conditions if provided
    let conditions = false
    if (application.status.offer) {
      conditions = application.status.offer.conditions
    }

    res.render('application/confirm', {
      applicationId: req.params.applicationId,
      conditions,
      type
    })
  })

  router.post('/application/:applicationId/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Get conditions if provided
    let conditions = false
    if (application.status.offer) {
      conditions = application.status.offer.conditions
    }

    // Update application status with offer decision
    const offer = {
      date: new Date().toISOString(),
      conditions
    }
    application.status.offer = offer

    // Delete previous decision
    delete req.session.data.decision

    res.redirect(`/application/${req.params.applicationId}`)
  })

  // Render other application pages
  router.all('/application/:applicationId/:view', (req, res) => {
    res.render(`application/${req.params.view}`, {
      applicationId: req.params.applicationId
    })
  })
}
