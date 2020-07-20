const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/application/:applicationId/withdraw', (req, res) => {
    res.render('offer/withdraw/withdraw', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/withdraw', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/withdraw/confirm`)
  })

  router.get('/application/:applicationId/withdraw/confirm', (req, res) => {
    res.render('offer/withdraw/confirm', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/withdraw/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.status = 'Offer withdrawn'
    application.offer.withdrawnDate = new Date().toISOString()
    application.offer.withdrawnReasons = utils.getRejectReasons(req.session.data)
    req.flash('success', 'offer-withdrawn')
    res.redirect(`/application/${applicationId}/offer`)
  })
}
