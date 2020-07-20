const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/application/:applicationId/reject', (req, res) => {
    res.render('application/reject/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/reject', (req, res) => {
    // skip last page if safeguarding, honesty or other offer given
    if (req.session.data.rejectionReasons.honesty === 'Yes' || req.session.data.rejectionReasons.safeguarding === 'Yes') {
      res.redirect(`/application/${req.params.applicationId}/reject/check`)
    } else {
      res.redirect(`/application/${req.params.applicationId}/reject/other-reasons-for-rejection`)
    }
  })

  router.get('/application/:applicationId/reject/other-reasons-for-rejection', (req, res) => {
    var data = req.session.data.rejectionReasons

    var noReasonsGivenYet = data.actions !== 'Yes' && data['missing-qualifications'] !== 'Yes' && data['application-quality'] !== 'Yes' && data['interview-performance'] !== 'Yes' && data['course-full'] !== 'Yes' && data['other-offer'] !== 'Yes' && data.honesty !== 'Yes' && data.safeguarding !== 'Yes'

    res.render('application/reject/other-reasons-for-rejection', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      noReasonsGivenYet: noReasonsGivenYet
    })
  })

  router.post('/application/:applicationId/reject/other-reasons-for-rejection', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/reject/check`)
  })

  router.get('/application/:applicationId/reject/check', (req, res) => {
    res.render('application/reject/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/application/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Rejected'
    application.rejectedDate = new Date().toISOString()
    application.rejectedReasons = utils.getRejectReasons(req.session.data.rejectionReasons)
    delete req.session.data.rejectionReasons

    req.flash('success', 'rejected')
    res.redirect(`/application/${applicationId}`)
  })
}
