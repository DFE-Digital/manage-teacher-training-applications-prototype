const { v4: uuidv4 } = require('uuid')
const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/applications/:applicationId/offer/edit/provider', (req, res) => {
    res.render('applications/offer/edit/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/course`)
  })

  router.get('/applications/:applicationId/offer/edit/course', (req, res) => {
    res.render('applications/offer/edit/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/location`)
  })


  router.get('/applications/:applicationId/offer/edit/location', (req, res) => {
    res.render('applications/offer/edit/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/check`)
  })

  router.get('/applications/:applicationId/offer/edit/conditions', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let standardConditions;
    let conditions;

    if(!req.session.data['edit-offer'] || !req.session.data['edit-offer']['standard-conditions']) {

      if(application.offer.standardConditions) {
        standardConditions = application.offer.standardConditions.map(condition => {
          return condition.description
        })
      }

    }

    // cleanse data gah
    if(req.session.data['edit-offer'] && req.session.data['edit-offer']['conditions']) {
      req.session.data['edit-offer']['conditions'] = req.session.data['edit-offer']['conditions'].filter(c => c != '')
    }

    // if the form has been used in some way
    if(req.session.data['edit-offer'] && req.session.data['edit-offer']['submitted-conditions-page'] == 'true') {
      conditions = req.session.data['edit-offer']['conditions']
    } else {
      if(application.offer.conditions) {
        conditions = application.offer.conditions.map(c => {
          return c.description
        })
      }
    }

    res.render('applications/offer/edit/conditions', {
      application,
      standardConditions,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit/conditions', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/check`)
  })

  router.get('/applications/:applicationId/offer/edit/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    var conditions = []

    // if it's been submitted then build conditions from data
    if(req.session.data['edit-offer'] && req.session.data['edit-offer']['submitted-conditions-page'] == 'true') {

      // standard conditions
      if(req.session.data['edit-offer']['standard-conditions'] && req.session.data['edit-offer']['standard-conditions'].length) {
        conditions = conditions.concat(req.session.data['edit-offer']['standard-conditions'])
      }

      if(req.session.data['edit-offer']['conditions'] && req.session.data['edit-offer']['conditions'].length) {
        req.session.data['edit-offer']['conditions'].filter(c => c != '').forEach(c => {
          conditions.push(c)
        })
      }

      conditions = conditions.map(c => {
        return {
          description: c,
          status: "Pending"
        }
      })

    // not submitted, build from application.offer object
    } else {
      conditions = ApplicationHelper.getConditions(application.offer)
    }

    res.render('applications/offer/edit/check', {
      application,
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.offer.provider = req.session.data['edit-offer'].provider || application.offer.provider
    application.offer.course = req.session.data['edit-offer'].course || application.offer.course
    application.offer.location = req.session.data['edit-offer'].location || application.offer.location

    // save standard conditions
    application.offer.standardConditions = [];
    if(req.session.data['edit-offer']['standard-conditions'] && req.session.data['edit-offer']['standard-conditions'].length) {
      req.session.data['edit-offer']['standard-conditions'].forEach(condition => {
        application.offer.standardConditions.push({
          id: uuidv4(),
          description: condition,
          status: "Pending"
        })
      });
    }

    // save further conditions
    application.offer.conditions = [];

    req.session.data['edit-offer']['conditions'].filter(c => c != '').forEach(c => {
      application.offer.conditions.push({
        id: uuidv4(),
        description: c,
        status: "Pending"
      })
    })

    ApplicationHelper.addEvent(application, {
      title: "Offer changed",
      user: "Ben Brown",
      date: new Date().toISOString(),
      meta: {
        offer: {
          provider: application.offer.provider,
          course: application.offer.course,
          location: application.offer.location,
          accreditedBody: application.offer.accreditedBody,
          conditions: ApplicationHelper.getConditions(application.offer)
        }
      }
    })
    req.flash('success', 'New offer sent')
    res.redirect(`/applications/${applicationId}/offer`)
  })

}
