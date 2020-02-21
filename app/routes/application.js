var uuid = require('uuid/v4');
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
        'offered': 'Offer successfully made',
        'rejected': 'Application successfully rejected'
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

    if(application.offer && application.offer.conditionsNotMetDate) {
      timeline.push({
        label: {
          text:  "Conditions not met"
        },
        datetime: {
          timestamp: application.offer.conditionsNotMetDate,
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

  router.get('/application/:applicationId/decision', (req, res) => {
    res.render(`application/decision`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/decision', (req, res) => {
    const applicationId = req.params.applicationId
    const { decision } = req.body

    if (decision === 'offer') {
      res.redirect(`/application/${applicationId}/offer`)
    } else if (decision === 'different-course') {
      res.redirect(`/application/${applicationId}/different-course/course`)
    } else if (decision === 'different-location') {
      res.redirect(`/application/${applicationId}/different-course/location`)
    } else if (decision === 'different-provider') {
      res.redirect(`/application/${applicationId}/different-course/provider`)
    } else {
      res.redirect(`/application/${applicationId}/reject`)
    }
  })
}
