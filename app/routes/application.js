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
    const success = req.query.success

    res.render('application/index', {
      applicationId: req.params.applicationId,
      status: req.query.status,
      success
    })
  })

  // Submit decision
  router.post('/application/:applicationId/decision', (req, res) => {
    const applicationId = req.params.applicationId
    const { decision } = req.body

    if (decision === 'offer') {
      res.redirect(`/application/${applicationId}/offer`)
    } else {
      res.redirect(`/application/${applicationId}/reject`)
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
    application.status.offer['standard-conditions'] = req.body['standard-conditions']
    application.status.offer.recommendations = req.body.recommendations

    res.redirect(`/application/${applicationId}/confirm?type=offer`)
  })

  // Show rejection options
  router.get('/application/:applicationId/reject', (req, res) => {
    res.render('application/reject', {
      applicationId: req.params.applicationId,
      reasons: req.query.reasons
    })
  })

  // Submit reject reasons
  router.post('/application/:applicationId/reject', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Update application status with reject reasons
    application.status.rejected = {}
    application.status.rejected.reasons = req.body.reasons
    application.status.rejected.comment = req.body.comments

    res.redirect(`/application/${applicationId}/confirm?type=reject`)
  })

  // Show confirmation
  router.get('/application/:applicationId/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]
    const status = application.status
    const type = req.query.type

    // Get conditions if provided
    const conditions = status.offer
      ? status.offer.conditions
      : false

    res.render('application/confirm', {
      applicationId: req.params.applicationId,
      conditions,
      type
    })
  })

  router.post('/application/:applicationId/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]
    const status = application.status

    // Update application offer/rejected status with decision date (and offer type)
    if (status.rejected) {
      status.rejected.date = new Date().toISOString()
    } else if (status.offer) {
      status.offer.date = new Date().toISOString()
    }

    delete req.session.data.decision

    res.redirect(`/application/${req.params.applicationId}?success=true`)
  })

  // Render other application pages
  router.all('/application/:applicationId/:view', (req, res) => {
    res.render(`application/${req.params.view}`, {
      applicationId: req.params.applicationId
    })
  })
}
