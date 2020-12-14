const { v4: uuidv4 } = require('uuid')

module.exports = router => {

  router.get('/applications/:applicationId/offer/new', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions;

    // cleanse data gah
    if(req.session.data['new-offer'] && req.session.data['new-offer']['conditions']) {
      req.session.data['new-offer']['conditions'] = req.session.data['new-offer']['conditions'].filter(c => c != '')
    }

    conditions = req.session.data['new-offer']['conditions']

    res.render('applications/offer/new/index', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/new', (req, res) => {
    const applicationId = req.params.applicationId
    res.redirect(`/applications/${applicationId}/offer/new/check`)
  })

  router.get('/applications/:applicationId/offer/new/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    var conditions = []

    if(req.session.data['new-offer']['standard-conditions'].length) {
      conditions = conditions.concat(req.session.data['new-offer']['standard-conditions'])
    }

    req.session.data['new-offer']['conditions'].filter(c => c != '').forEach(c => {
      conditions.push(c)
    })

    conditions = conditions.map(c => {
      return {
        description: c,
        status: "Pending"
      }
    })

    res.render('applications/offer/new/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/new/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.status = 'Offered'
    application.offer = {
      madeDate: new Date().toISOString()
    }

    // save standard conditions
    if(req.session.data['new-offer']['standard-conditions'].length) {
      application.offer.standardConditions = req.session.data['new-offer']['standard-conditions'].map(c => {
        return {
          id: uuidv4(),
          description: c,
          status: "Pending"
        }
      })
    }

    // save further conditions
    application.offer.conditions = req.session.data['new-offer']['conditions'].filter(c => c != '').map(c => {
      return {
        id: uuidv4(),
        description: c,
        status: "Pending"
      }
    })

    delete req.session.data['new-offer']
    delete req.session.data.decision

    req.flash('success', 'Offer successfully made')
    res.redirect(`/applications/${req.params.applicationId}/offer`)
  })


  router.get('/applications/:applicationId/offer/new/provider', (req, res) => {

    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    res.render('applications/offer/new/provider', {
      application
    })
  })

  router.post('/applications/:applicationId/offer/new/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/course`)
  })

  router.get('/applications/:applicationId/offer/new/course', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    res.render('applications/offer/new/course', {
      application
    })
  })

  router.post('/applications/:applicationId/offer/new/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/location`)
  })

  router.get('/applications/:applicationId/offer/new/location', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    res.render('applications/offer/new/location', {
      application
    })
  })

  router.post('/applications/:applicationId/offer/new/location', (req, res) => {
    if(!req.session.data['new-offer']['standard-conditions'] || !req.session.data['new-offer'].conditions) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
    }
  })

}
