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
    } else if(req.session.data.rejectionReasons.conditions === 'Yes') {
      res.redirect(`/applications/${req.params.applicationId}/reject/conditions`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/reject/other-reasons-for-rejection`)
    }
  })

  router.get('/applications/:applicationId/reject/conditions', (req, res) => {
    res.render('applications/reject/conditions', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.get('/applications/:applicationId/reject/other-reasons-for-rejection', (req, res) => {
    var data = req.session.data.rejectionReasons

    var noReasonsGivenYet = data.actions !== 'Yes' && data['missing-qualifications'] !== 'Yes' && data['application-quality'] !== 'Yes' && data['interview-performance'] !== 'Yes' && data['course-full'] !== 'Yes' && data['other-offer'] !== 'Yes' && data.honesty !== 'Yes' && data.safeguarding !== 'Yes'

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

    if(application.status == "Rejected") {
      application.rejectedReasons = ApplicationHelper.getRejectReasons(req.session.data.rejectionReasons)
      application.rejectedFeedbackDate = new Date().toISOString()
      req.flash('success', 'Feedback sent')
      ApplicationHelper.addEvent(application, {
        "title": "Feedback sent",
        "user": "Ben Brown",
        "date": new Date().toISOString()
      })
    } else {
      application.status = 'Rejected'
      application.rejectedDate = new Date().toISOString()
      application.rejectedReasons = ApplicationHelper.getRejectReasons(req.session.data.rejectionReasons)
      req.flash('success', 'Application rejected')
      ApplicationHelper.addEvent(application, {
        "title": "Rejected",
        "user": "Ben Brown",
        "date": new Date().toISOString()
      })
    }

    delete req.session.data.rejectionReasons
    res.redirect(`/applications/${applicationId}`)
  })
}
