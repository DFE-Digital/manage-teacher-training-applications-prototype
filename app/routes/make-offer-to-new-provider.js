const { v4: uuidv4 } = require('uuid')

module.exports = router => {
  router.get('/application/:applicationId/new/change-provider', (req, res) => {
    res.render('offer/new/change-provider/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/new/change-provider', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/new/change-provider/course`)
  })

  router.get('/application/:applicationId/new/change-provider/course', (req, res) => {
    res.render('offer/new/change-provider/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/new/change-provider/course', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/new/change-provider/location`)
  })

  router.get('/application/:applicationId/new/change-provider/location', (req, res) => {
    res.render('offer/new/change-provider/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/new/change-provider/location', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/new/change-provider/conditions`)
  })

  router.get('/application/:applicationId/new/change-provider/conditions', (req, res) => {
    res.render('offer/new/change-provider/conditions', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/new/change-provider/conditions', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/new/change-provider/confirm`)
  })

  router.get('/application/:applicationId/new/change-provider/confirm', (req, res) => {
    const data = req.session.data;
    if (req.session.data['standard-conditions']) {
      data.standardConditions = req.session.data['standard-conditions'].map((item) => {
        return {
          description: item
        }
      })
    }

    data.furtherConditions = []

    if (data['further-conditions']['condition-1']){
      data.furtherConditions.push({ description: data['further-conditions']['condition-1'] })
    }
    if (data['further-conditions']['condition-2']){
      data.furtherConditions.push({ description: data['further-conditions']['condition-2'] })
    }
    if (data['further-conditions']['condition-3']){
      data.furtherConditions.push({ description: data['further-conditions']['condition-3'] })
    }
    if (data['further-conditions']['condition-4']){
      data.furtherConditions.push({ description: data['further-conditions']['condition-4'] })
    }

    res.render('offer/new/change-provider/confirm', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      conditions: data.standardConditions.concat(data.furtherConditions)
    })
  })

  router.post('/application/:applicationId/new/change-provider/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const data = req.session.data;
    application.status = 'Offered'
    application.offer = {
      madeDate: new Date().toISOString()
    }

    application.offer.standardConditions = data.standardConditions.map((item) => {
      return {
        id: uuidv4(),
        description: item.description,
        status: 'Pending'
      }
    })

    const conditions = []

    data.furtherConditions.forEach(condition => {
      conditions.push({ id: uuidv4(), description: condition.description, status: 'Pending' })
    })

    // Delete form field data
    delete data['standard-conditions']
    delete data['further-conditions']
    // Delete transformed data
    delete data.furtherConditions
    delete data.standardConditions

    application.offer.conditions = conditions

    application.offer.recommendations = req.session.data.recommendations
    req.flash('success', 'offer-made-to-new-provider')
    res.redirect(`/application/${req.params.applicationId}/offer`)
  })
}
