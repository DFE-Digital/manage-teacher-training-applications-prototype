const utils = require( '../data/application-utils')

module.exports = router => {

  router.get('/application/:applicationId', (req, res) => {
    const success = req.query.success
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    var flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'offer-withdrawn': 'Offer successfully withdrawn',
        'conditions-met': 'Conditions successfully marked as met',
        'conditions-not-met': 'Conditions successfully marked as not met',
        'different-course-offered': 'Course offered successfully',
        'enrolled': 'Candidate successfully enrolled',
        'offered': 'Offer successfully made to candidate',
        'rejected': 'Application rejected successfully'
      }
    })

    let timeline = [];

    if(application.submittedDate) {
      timeline.push({
        label: {
          text:  "Application submitted"
        },
        datetime: {
          timestamp: application.submittedDate,
          type: "datetime"
        },
        byline: {
          text: "candidate"
        }
      })
    }

    if(application.offer && application.offer.madeDate) {
      timeline.push({
        label: {
          text:  "Offer made"
        },
        datetime: {
          timestamp: application.offer.madeDate,
          type: "datetime"
        },
        byline: {
          text: "provider"
        }
      })
    }

    if(application.offer && application.offer.declinedDate) {
      timeline.push({
        label: {
          text:  "Offer declined"
        },
        datetime: {
          timestamp: application.offer.declinedDate,
          type: "datetime"
        },
        byline: {
          text: "candidate"
        }
      })
    }

    if(application.rejectedDate) {
      timeline.push({
        label: {
          text:  "Application rejected"
        },
        datetime: {
          timestamp: application.rejectedDate,
          type: "datetime"
        },
        byline: {
          text: "provider"
        }
      })
    }

    if(application.withdrawnDate) {
      timeline.push({
        label: {
          text:  "Application withdrawn"
        },
        datetime: {
          timestamp: application.withdrawnDate,
          type: "datetime"
        },
        byline: {
          text: "candidate"
        }
      })
    }

    if(application.offer && application.offer.acceptedDate) {
      timeline.push({
        label: {
          text:  "Offer accepted"
        },
        datetime: {
          timestamp: application.offer.acceptedDate,
          type: "datetime"
        },
        byline: {
          text: "candidate"
        }
      })
    }

    if(application.offer && application.offer.conditionsMetDate) {
      timeline.push({
        label: {
          text:  "Conditions met"
        },
        datetime: {
          timestamp: application.offer.conditionsMetDate,
          type: "datetime"
        },
        byline: {
          text: "provider"
        }
      })
    }

    if(application.offer && application.offer.withdrawnDate) {
      timeline.push({
        label: {
          text:  "Offer withdrawn"
        },
        datetime: {
          timestamp: application.offer.withdrawnDate,
          type: "datetime"
        },
        byline: {
          text: "provider"
        }
      })
    }

    if(application.offer && application.offer.enrolledDate) {
      timeline.push({
        label: {
          text:  "Enrolled"
        },
        datetime: {
          timestamp: application.offer.enrolledDate,
          type: "datetime"
        },
        byline: {
          text: "provider"
        }
      })
    }

    res.render('application/index', {
      applicationId: applicationId,
      timeline: timeline.reverse(),
      conditions: utils.getConditions(application),
      status: req.query.status,
      success,
      flash: flashMessage
    })
  })

  // Submit decision
  router.post('/application/:applicationId/decision', (req, res) => {
    const applicationId = req.params.applicationId
    const { decision } = req.body

    if (decision === 'offer') {
      res.redirect(`/application/${applicationId}/offer`)
    } else if (decision === 'different-course') {
        res.redirect(`/application/${applicationId}/different-course`)
    } else {
      res.redirect(`/application/${applicationId}/reject`)
    }
  })

  // Submit offer conditions
  router.post('/application/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Update application status with offer conditions
    application.status = "Offered";
    application.offer = {};
    const conditions = []
    if (req.body['condition-1']) { conditions.push({ description: req.body['condition-1'], complete: false }) }
    if (req.body['condition-2']) { conditions.push({ description: req.body['condition-2'], complete: false }) }
    if (req.body['condition-3']) { conditions.push({ description: req.body['condition-3'], complete: false }) }
    if (req.body['condition-4']) { conditions.push({ description: req.body['condition-4'], complete: false }) }
    application.offer.conditions = conditions

    application.offer.standardConditions = req.body['standard-conditions'].map((item) => {
      return {
        description: item,
        complete: false
      }
    })

    application.offer.recommendations = req.body.recommendations

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
    application.status = "Rejected";
    application.rejectedReasons = req.body.reasons
    application.rejectedComments = req.body.comments

    res.redirect(`/application/${applicationId}/confirm?type=reject`)

  })

  // Show confirmation
  router.get('/application/:applicationId/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]
    const status = application.status
    const type = req.query.type

    // Get conditions if provided
    // const conditions = application.offer.conditions
    //   ? application.offer.conditions
    //   : false

    res.render('application/confirm', {
      applicationId: req.params.applicationId,
      // conditions,
      type
    })
  })

  router.post('/application/:applicationId/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]
    const status = application.status

    // Update application offer/rejected status with decision date (and offer type)
    if (status == "Rejected") {
      rejectedDate = new Date().toISOString()
      req.flash('success', 'rejected')
    } else if (status == "Offered") {
      application.offer.madeDate = new Date().toISOString()
      req.flash('success', 'offered')
    }

    delete req.session.data.decision

    res.redirect(`/application/${req.params.applicationId}`)
  })

  router.get('/application/:applicationId/edit-response', (req, res) => {
    res.render(`application/edit-response`, {
      applicationId: req.params.applicationId
    })
  })

  router.get('/application/:applicationId/decision', (req, res) => {
    res.render(`application/decision`, {
      applicationId: req.params.applicationId
    })
  })

  router.get('/application/:applicationId/offer', (req, res) => {
    res.render(`application/offer`, {
      applicationId: req.params.applicationId
    })
  })
}
