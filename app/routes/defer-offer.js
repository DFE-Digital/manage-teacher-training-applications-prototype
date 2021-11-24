const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/applications/:applicationId/offer/defer/check', (req, res) => {
    res.render('applications/offer/defer/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/defer/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Deferred'
    application.events.items.push({
      date: new Date().toISOString(),
      user: "Alicia Grenada",
      title: "Offer deferred",
      meta: {
        offer: application.offer
      }
    })

    req.flash('success', 'Offer deferred')
    res.redirect(`/applications/${applicationId}/offer`)
  })


}
