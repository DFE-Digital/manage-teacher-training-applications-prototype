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
        'change-condition-status-to-pending': 'Condition successfully updated to pending',
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

    const data = req.session.data;
    // Clear data from previous journeys
    delete data['further-conditions']

    data["standard-conditions"] = [
      "Fitness to teach check",
      "Disclosure and barring service check"
    ]

    if (decision === 'offer') {
      res.redirect(`/application/${applicationId}/offer/new`)
    } else if (decision === 'different-course') {
      res.redirect(`/application/${applicationId}/new/change-course`)
    } else if (decision === 'different-location') {
      res.redirect(`/application/${applicationId}/new/change-location`)
    } else if (decision === 'different-provider') {
      res.redirect(`/application/${applicationId}/new/change-provider`)
    } else if (decision === 'reject') {
      res.redirect(`/application/${applicationId}/reject`)
    } else {
        res.redirect(`/application/${applicationId}/decision`)
      }
  })


}
