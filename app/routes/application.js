/**
 * Application routes
 */

const applications = require( '../data/applications')

module.exports = router => {
  // Render application page
  router.all('/', (req, res) => {

    // Clone and turn into an array
    let apps = Object.values(applications).reverse();
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
          statusValid = statuses.includes(app.statusA)
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
    let conditions = [];

    if(application.status.offered) {

      if(application.status.offered['standard-conditions']) {
        application.status.offered['standard-conditions'].map((item) => {
          return {
            text: item.description,
            href: '#',
            complete: item.complete,
            tag: {
              classes: 'app-tag--grey',
              text: 'Incomplete'
            }
          }
        }).forEach((item) => {
          conditions.push(item)
        });
      }

      if(application.status.offered.conditions) {
        application.status.offered.conditions.map((item) => {
          return {
            text: item.description,
            href: '#',
            complete: item.complete,
            tag: {
              classes: 'app-tag--grey',
              text: 'Incomplete'
            }
          }
        }).forEach((item) => {
          conditions.push(item)
        });
      }

    }

    var successFlash = req.flash('success')

    if (successFlash[0] === 'application-withdrawn') {
      var flash = "Offer successfully withdrawn";
    }

    res.render('application/index', {
      applicationId: applicationId,
      conditions: conditions,
      status: req.query.status,
      success,
      flash: flash
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

    if (decision === 'different-offer') {
      res.redirect(`/application/${applicationId}/different-offer`)
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
    application.statusA = "withdrawn";
    application.status.withdrawn = {}
    application.status.withdrawn.comments = req.body.comments
    req.flash('success', 'application-withdrawn')
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
  router.all('/application/:applicationId/:view', (req, res) => {
    res.render(`application/${req.params.view}`, {
      applicationId: req.params.applicationId
    })
  })
}
