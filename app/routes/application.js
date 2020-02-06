/**
 * Application routes
 */

const applications = require( '../data/applications')
const utils = require( '../data/application-utils')

module.exports = router => {
  // Render application page
  router.all('/', (req, res) => {

    // Clone and turn into an array
    let apps = Object.values(req.session.data.applications).reverse();
    const { status, provider } = req.query

    let statuses = status && (Array.isArray(status) ? status : [ status ].filter((status) => {
      return status !== '_unchecked'
    })) || req.session.data.status;
    let providers = provider && (Array.isArray(provider) ? provider : [ provider ].filter((provider) => {
      return provider !== '_unchecked'
    })) || req.session.data.provider;
    const hasFilters = !!( ( statuses && statuses.length > 0) || ( providers && providers.length > 0 ) )

    if( hasFilters ){
      apps = apps.filter((app) => {
        let statusValid = true;
        let providerValid = true;

        if( statuses && statuses.length ){
          statusValid = statuses.includes(app.status)
        }

        if( providers && providers.length ){
          providerValid = providers.includes(app.provider)
        }

        return statusValid && providerValid;
      })
    }

    let selectedFilters = null;
    if(hasFilters) {
      selectedFilters = {
        categories: []
      }

      if(statuses && statuses.length) {
        selectedFilters.categories.push({
          heading: { text: "Status" },
          items: statuses.map((status) => {
            return {
              text: status,
              href: `/remove-status-filter/${status}`
            }
          })
        })
      }


      if(providers && providers.length) {
        selectedFilters.categories.push({
          heading: { text: "Provider" },
          items: providers.map((provider) => {
            return {
              text: provider,
              href: `/remove-provider-filter/${provider}`
            }
          })
        })
      }
    }

    res.render('index', {
      applications: apps,
      selectedFilters: selectedFilters
    })
  })

  router.get('/remove-status-filter/:status', (req, res) => {
    req.session.data.status = req.session.data.status.filter(item => item !== req.params.status);
    res.redirect('/');
  })

  router.get('/remove-provider-filter/:provider', (req, res) => {
    req.session.data.provider = req.session.data.provider.filter(item => item !== req.params.provider);
    res.redirect('/');
  })

  router.get('/remove-all-filters', (req, res) => {
    req.session.data.status = null;
    req.session.data.provider = null;
    res.redirect('/');
  })


  // Render application page
  router.all('/application/:applicationId', (req, res) => {
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
        'enrolled': 'Candidate successfully enrolled'
      }
    })

    res.render('application/index', {
      applicationId: applicationId,
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
    } else {
      res.redirect(`/application/${applicationId}/reject`)
    }
  })

  // Change decision
  router.post('/application/:applicationId/edit-response', (req, res) => {
    const applicationId = req.params.applicationId
    const { decision } = req.body

    if (decision === 'different-course') {
      res.redirect(`/application/${applicationId}/different-course`)
    } else {
      res.redirect(`/application/${applicationId}/withdraw`)
    }
  })

   // Show rejection options
   router.get('/application/:applicationId/withdraw', (req, res) => {
    res.render('application/withdraw', {
      applicationId: req.params.applicationId
    })
  })

  // post comments about withdrawing
  router.post('/application/:applicationId/withdraw', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/confirm-withdraw`)
  })

  // post comments about withdrawing
  router.post('/application/:applicationId/confirm-withdraw', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Update application status with reject reasons
    application.statusA = "withdrawn-by-us";
    application.status['withdrawn-by-us'] = {}
    application.status['withdrawn-by-us'].comments = req.body.comments
    req.flash('success', 'offer-withdrawn')
    res.redirect(`/application/${applicationId}`)
  })


  // Submit offer conditions
  router.post('/application/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Update application status with offer conditions
    application.status.offered = {}
    const conditions = []
    if (req.body['condition-1']) { conditions.push({ description: req.body['condition-1'], complete: false }) }
    if (req.body['condition-2']) { conditions.push({ description: req.body['condition-2'], complete: false }) }
    if (req.body['condition-3']) { conditions.push({ description: req.body['condition-3'], complete: false }) }
    if (req.body['condition-4']) { conditions.push({ description: req.body['condition-4'], complete: false }) }
    application.status.offered.conditions = conditions

    application.status.offered['standard-conditions'] = req.body['standard-conditions'].map((item) => {
      return {
        description: item,
        complete: false
      }
    })

    // application.status.offered['standard-conditions'] = req.body['standard-conditions']
    application.status.offered.recommendations = req.body.recommendations

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
    application.status.rejected.comments = req.body.comments

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
  router.get('/application/:applicationId/edit-response', (req, res) => {
    res.render(`application/edit-response`, {
      applicationId: req.params.applicationId
    })
  })

  router.get('/application/:applicationId/edit-respoinse', (req, res) => {
    res.render(`application/edit-response`, {
      applicationId: req.params.applicationId
    })
  })

  router.get('/application/:applicationId/confirm-withdraw', (req, res) => {
    res.render(`application/confirm-withdraw`, {
      applicationId: req.params.applicationId
    })
  })

  router.get('/application/:applicationId/withdraw', (req, res) => {
    res.render(`application/withdraw`, {
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

  router.get('/application/:applicationId/different-course', (req, res) => {
    res.render(`application/different-course`, {
      applicationId: req.params.applicationId
    })
  })

  router.get('/application/:applicationId/confirm-enrollment', (req, res) => {
    res.render(`application/confirm-enrollment`, {
      applicationId: req.params.applicationId
    })
  })

  // post comments about withdrawing
  router.post('/application/:applicationId/confirm-enrollment', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Update application status with reject reasons
    application.statusA = "enrolled";
    application.status['enrolled'] = { date: new Date().toISOString() };
    req.flash('success', 'enrolled')
    res.redirect(`/application/${applicationId}`)
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
    res.render(`application/different-course--confirm`, {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/different-course/confirm', (req, res) => {
    req.flash('success', 'different-course-offered')
    res.redirect(`/application/${req.params.applicationId}`)
  })
}
