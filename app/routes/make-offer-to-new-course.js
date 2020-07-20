const { v4: uuidv4 } = require('uuid')

module.exports = router => {
  router.get('/application/:applicationId/new/change-course', (req, res) => {
    res.render('offer/new/change-course/course', {
      application: req.session.data.applications.find(app => app.id == req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/new/change-course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/new/change-course/location`)
  })

  router.get('/application/:applicationId/new/change-course/location', (req, res) => {
    res.render('offer/new/change-course/location', {
      application: req.session.data.applications.find(app => app.id == req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/new/change-course/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/new/change-course/conditions`)
  })

  router.get('/application/:applicationId/new/change-course/conditions', (req, res) => {
    res.render('offer/new/change-course/conditions', {
      application: req.session.data.applications.find(app => app.id == req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/new/change-course/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/new/change-course/confirm`)
  })

  router.get('/application/:applicationId/new/change-course/confirm', (req, res) => {
    const standardConditions = req.session.data['standard-conditions'].map((item) => {
      return {
        description: item
      }
    })

    const furtherConditions = []

    if (req.session.data['condition-1']) {
      furtherConditions.push({ description: req.session.data['condition-1'] })
    }
    if (req.session.data['condition-2']) {
      furtherConditions.push({ description: req.session.data['condition-2'] })
    }
    if (req.session.data['condition-3']) {
      furtherConditions.push({ description: req.session.data['condition-3'] })
    }
    if (req.session.data['condition-4']) {
      furtherConditions.push({ description: req.session.data['condition-4'] })
    }

    res.render('offer/new/change-course/confirm', {
      application: req.session.data.applications.find(app => app.id == req.params.applicationId),
      conditions: standardConditions.concat(furtherConditions)
    })
  })

  router.post('/application/:applicationId/new/change-course/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id == applicationId)
    application.status = 'Offered'
    application.offer = {
      madeDate: new Date().toISOString()
    }

    application.offer.standardConditions = req.session.data['standard-conditions'].map((item) => {
      return {
        id: uuidv4(),
        description: item,
        status: 'Pending'
      }
    })

    const conditions = []
    if (req.session.data['condition-1']) {
      conditions.push({ id: uuidv4(), description: req.session.data['condition-1'], status: 'Pending' })
    }
    if (req.session.data['condition-2']) {
      conditions.push({ id: uuidv4(), description: req.session.data['condition-2'], status: 'Pending' })
    }
    if (req.session.data['condition-3']) {
      conditions.push({ id: uuidv4(), description: req.session.data['condition-3'], status: 'Pending' })
    }
    if (req.session.data['condition-4']) {
      conditions.push({ id: uuidv4(), description: req.session.data['condition-4'], status: 'Pending' })
    }
    application.offer.conditions = conditions

    application.offer.recommendations = req.session.data.recommendations
    req.flash('success', 'offer-made-to-new-course')
    res.redirect(`/application/${req.params.applicationId}/offer`)
  })
}
