const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/application/:applicationId', (req, res) => {
    const success = req.query.success
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    var flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'offer-withdrawn': 'Offer successfully withdrawn',
        'conditions-met': 'Conditions successfully marked as met',
        'conditions-not-met': 'Conditions successfully marked as not met',
        offered: 'Offer successfully made',
        rejected: 'Application successfully rejected',
        'change-offer-location': 'Offer successfully changed ',
        'change-offer-course': 'Offer successfully changed ',
        'change-offer-provider': 'Offer successfully changed ',
        'change-condition-status-to-met': 'Condition successfully updated to met',
        'change-condition-status-to-not-met': 'Condition successfully updated to not met',
        'offer-made-to-new-provider': 'Offer successfully made',
        'offer-made-to-new-course': 'Offer successfully made',
        'offer-made-to-new-location': 'Offer successfully made',
        'feedback-given': 'Feedback successfully sent'
      }
    })

    res.render('application/index', {
      application,
      status: req.query.status,
      success,
      flash: flashMessage
    })
  })

  router.get('/application/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'offer-withdrawn': 'Offer successfully withdrawn',
        'conditions-met': 'Conditions successfully marked as met',
        'conditions-not-met': 'Conditions successfully marked as not met',
        offered: 'Offer successfully made',
        rejected: 'Application successfully rejected',
        'change-offer-location': 'Offer successfully changed ',
        'change-offer-course': 'Offer successfully changed ',
        'change-offer-provider': 'Offer successfully changed ',
        'change-condition-status-to-met': 'Condition successfully updated to met',
        'change-condition-status-to-not-met': 'Condition successfully updated to not met',
        'offer-made-to-new-provider': 'Offer successfully made',
        'offer-made-to-new-course': 'Offer successfully made',
        'offer-made-to-new-location': 'Offer successfully made',
        'offer-reconfirmed': 'Deferred offer successfully confirmed for current cycle',
        'offer-deferred': 'Offer successfully deferred',
      }
    })

    res.render('application/offer/index', {
      application,
      conditions: utils.getConditions(application),
      flash: flashMessage
    })
  })

  router.get('/application/:applicationId/timeline', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/timeline', {
      application,
      timeline: utils.getTimeline(application),
      conditions: utils.getConditions(application)
    })
  })

  router.get('/application/:applicationId/decision', (req, res) => {
    res.render('application/decision', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/decision', (req, res) => {
    const applicationId = req.params.applicationId
    const { decision } = req.body

    if (decision === 'offer') {
      res.redirect(`/application/${applicationId}/offer/new`)
    } else if (decision === 'different-course') {
      res.redirect(`/application/${applicationId}/new/change-course`)
    } else if (decision === 'different-location') {
      res.redirect(`/application/${applicationId}/new/change-location`)
    } else if (decision === 'different-provider') {
      res.redirect(`/application/${applicationId}/new/change-provider`)
    } else {
      res.redirect(`/application/${applicationId}/reject`)
    }
  })

  router.get('/application/:applicationId/offer/defer/check', (req, res) => {
    res.render('application/offer/defer/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/offer/defer/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
      application.status = 'Deferred'
    // if (application.cycle === 'Next cycle (2021 to 2022)') {
    //   application.previousOffer = application.offer
    //   application.previousStatus = application.status
    //   application.offer = null
    //   application.status = 'Deferred'
    // } else {
    //   application.offer = application.previousOffer
    //   application.previousOffer = null
    //   application.status = application.previousStatus
    //   application.previousStatus = null
    // }
    req.flash('success', 'offer-deferred')
    res.redirect(`/application/${applicationId}/offer`)
  })
}
