const { v4: uuidv4 } = require('uuid')

module.exports = router => {

  router.get('/application/:applicationId/offer/new', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions;

    // cleanse data gah
    if(req.session.data['new-offer'] && req.session.data['new-offer']['conditions']) {
      req.session.data['new-offer']['conditions'] = req.session.data['new-offer']['conditions'].filter(c => c != '')
    }

    conditions = req.session.data['new-offer']['conditions']

    res.render('application/offer/new/index', {
      application,
      conditions
    })
  })

  router.post('/application/:applicationId/offer/new', (req, res) => {
    const applicationId = req.params.applicationId
    res.redirect(`/application/${applicationId}/offer/new/check`)
  })

  router.get('/application/:applicationId/offer/new/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    var conditions = []

    if(req.session.data['new-offer']['standard-conditions'].length) {
      conditions = conditions.concat(req.session.data['new-offer']['standard-conditions'])
    }

    req.session.data['new-offer']['conditions'].filter(c => c != '').forEach(c => {
      conditions.push(c)
    })

    res.render('application/offer/new/check', {
      application,
      conditions
    })
  })

  router.post('/application/:applicationId/offer/new/check', (req, res) => {
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

    req.flash('success', 'Offer successfully made')
    res.redirect(`/application/${req.params.applicationId}/offer`)
  })
}
