var uuid = require('uuid/v4');

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

    let standardConditions = req.session.data['standard-conditions'].map((item) => {
      return {
        description: item
      }
    })

    let furtherConditions = [];

    if (req.session.data['condition-1']) {
      furtherConditions.push({ id: uuid(), description: req.session.data['condition-1'], met: false })
    }
    if (req.session.data['condition-2']) {
      furtherConditions.push({ id: uuid(), description: req.session.data['condition-2'], met: false })
    }
    if (req.session.data['condition-3']) {
      furtherConditions.push({ id: uuid(), description: req.session.data['condition-3'], met: false })
    }
    if (req.session.data['condition-4']) {
      furtherConditions.push({ id: uuid(), description: req.session.data['condition-4'], met: false })
    }

    let recommendations = req.session.data.recommendations
    res.render(`application/different-course--confirm`, {
      applicationId: req.params.applicationId,
      standardConditions,
      furtherConditions,
      recommendations
    })
  })

  router.post('/application/:applicationId/different-course/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]
    application.status = 'Offered';
    application.offer = {
      madeDate: new Date().toISOString()
    };

    application.offer.standardConditions = req.session.data['standard-conditions'].map((item) => {
      return {
        id: uuid(),
        description: item,
        complete: false
      }
    })

    const conditions = []
    if (req.session.data['condition-1']) {
      conditions.push({ id: uuid(), description: req.session.data['condition-1'], met: false })
    }
    if (req.session.data['condition-2']) {
      conditions.push({ id: uuid(), description: req.session.data['condition-2'], met: false })
    }
    if (req.session.data['condition-3']) {
      conditions.push({ id: uuid(), description: req.session.data['condition-3'], met: false })
    }
    if (req.session.data['condition-4']) {
      conditions.push({ id: uuid(), description: req.session.data['condition-4'], met: false })
    }
    application.offer.conditions = conditions;

    application.offer.recommendations = req.session.data.recommendations
    req.flash('success', 'different-course-offered')
    res.redirect(`/application/${req.params.applicationId}`)
  })
}
