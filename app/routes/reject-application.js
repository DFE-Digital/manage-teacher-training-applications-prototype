const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/reject', (req, res) => {
    res.render('applications/reject/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject', (req, res) => {
    // skip last page if safeguarding, honesty or other offer given
    if (req.session.data.rejectionReasons.honesty === 'Yes' || req.session.data.rejectionReasons.safeguarding === 'Yes') {
      res.redirect(`/applications/${req.params.applicationId}/reject/check`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/reject/other-reasons-for-rejection`)
    }
  })

  router.get('/applications/:applicationId/reject/other-reasons-for-rejection', (req, res) => {
    var data = req.session.data.rejectionReasons

    var noReasonsGivenYet = data.actions !== 'Yes' && data['missing-qualifications'] !== 'Yes' && data['application-quality'] !== 'Yes' && data['interview-performance'] !== 'Yes' && data['course-full'] !== 'Yes' && data['other-offer'] !== 'Yes' && data.honesty !== 'Yes' && data.safeguarding !== 'Yes' && data.asked !== 'Yes'

    res.render('applications/reject/other-reasons-for-rejection', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      noReasonsGivenYet: noReasonsGivenYet
    })
  })

  router.post('/applications/:applicationId/reject/other-reasons-for-rejection', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/reject/check`)
  })

  router.get('/applications/:applicationId/reject/check', (req, res) => {
    res.render('applications/reject/check', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Rejected'
    application.rejectedDate = new Date().toISOString()
    application.rejectedReasons = ApplicationHelper.getRejectReasons(req.session.data.rejectionReasons)
    delete req.session.data.rejectionReasons

    req.flash('success', 'Application rejected')
    res.redirect(`/applications/${applicationId}`)
  })
}
