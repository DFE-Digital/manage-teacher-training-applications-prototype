const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/applications/:applicationId/offer/withdraw', (req, res) => {
    res.render('applications/offer/withdraw/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/withdraw', (req, res) => {
    // skip last page if safeguarding, honesty or other offer given
    if (req.session.data.rejectionReasons.honesty === 'Yes' || req.session.data.rejectionReasons.safeguarding === 'Yes') {
      res.redirect(`/applications/${req.params.applicationId}/offer/withdraw/check`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/withdraw/other-reasons-for-rejection`)
    }
  })

  router.get('/applications/:applicationId/offer/withdraw/other-reasons-for-rejection', (req, res) => {
    var data = req.session.data.rejectionReasons

    var noReasonsGivenYet = data.actions !== 'Yes' && data['missing-qualifications'] !== 'Yes' && data['application-quality'] !== 'Yes' && data['interview-performance'] !== 'Yes' && data['course-full'] !== 'Yes' && data['other-offer'] !== 'Yes' && data.honesty !== 'Yes' && data.safeguarding !== 'Yes'

    res.render('applications/offer/withdraw/other-reasons-for-rejection', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      noReasonsGivenYet: noReasonsGivenYet
    })
  })

  router.post('/applications/:applicationId/offer/withdraw/other-reasons-for-rejection', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/withdraw/check`)
  })

  router.get('/applications/:applicationId/offer/withdraw/check', (req, res) => {
    res.render('applications/offer/withdraw/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/withdraw/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Offer withdrawn'
    application.withdrawnDate = new Date().toISOString()
    application.withdrawnReasons = ApplicationHelper.getRejectReasons(req.session.data.rejectionReasons)
    delete req.session.data.rejectionReasons

    req.flash('success', 'Offer successfully withdrawn')
    res.redirect(`/applications/${applicationId}/offer`)
  })
}
