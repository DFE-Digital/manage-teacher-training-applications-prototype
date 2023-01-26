const ApplicationHelper = require('../data/helpers/application')
const content = require('../data/content')

module.exports = router => {

  router.get('/applications/:applicationId/reject/degree', (req, res) => {
    res.render('applications/reject/degree', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject/degree-answer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)


    const hasMathsGCSE = (
      application.gcse.maths.type == 'GCSE' &&
      application.gcse.maths.country == 'United Kingdom' &&
      (
       ["A", "B", "C"].includes(application.gcse.maths.grade[0].grade)
      )
    )

    const hasEnglishGCSE = (
      application.gcse.english.type == 'GCSE' &&
      application.gcse.english.country == 'United Kingdom' &&
      (
       ["A", "B", "C"].includes(application.gcse.english.grade[0].grade)
      )
    )

    /* If they don't have an English GCSE C/4 or above */
    if (!hasEnglishGCSE) {
      res.redirect(`/applications/${applicationId}/reject/english`)

    /* If they don’t have a Maths GCSE C/4 or above */
    } else if (!hasMathsGCSE) {
      res.redirect(`/applications/${applicationId}/reject/maths`)

    /* If they meet the degree criteria and have English and maths GCSEs */
    } else if (hasMathsGCSE && hasEnglishGCSE) {
      res.redirect(`/applications/${applicationId}/reject/reasons`)

    /* If they didn’t meet the degree criteria but have English and maths GCSEs */
    } else {
      res.redirect(`/applications/${applicationId}/reject/other-reasons`)
    }

  })

  router.get('/applications/:applicationId/reject/english', (req, res) => {
    res.render('applications/reject/english', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject/english-answer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)


    const hasMathsGCSE = (
      application.gcse.maths.type == 'GCSE' &&
      application.gcse.maths.country == 'United Kingdom' &&
      (
       ["A", "B", "C"].includes(application.gcse.maths.grade[0].grade)
      )
    )


    /* If they don’t have a Maths GCSE C/4 or above */
    if (!hasMathsGCSE) {
      res.redirect(`/applications/${applicationId}/reject/maths`)

    /* If they meet the degree criteria and the English criteria and has a math GCSEs */
    } else if (hasMathsGCSE) {
      res.redirect(`/applications/${applicationId}/reject/reasons`)

    /* If they didn’t meet the degree criteria or the English criteria */
    } else {
      res.redirect(`/applications/${applicationId}/reject/other-reasons`)
    }

  })

  router.get('/applications/:applicationId/reject/maths', (req, res) => {
    res.render('applications/reject/maths', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject/maths-answer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    const rejection = req.session.data.rejection

    const metDegreeCriteria = (rejection.degreeCriteria == 'met')
    const metEnglishCriteria = (rejection.englishCriteria == 'met-qualification' || rejection.englishCriteria == 'met-standard')
    const metMathsCriteria = (rejection.mathsCriteria == 'met-qualification' || rejection.mathsCriteria == 'met-standard')

    const metAllITTCriteria = (metDegreeCriteria && metEnglishCriteria && metMathsCriteria)

    /* If they met the degree, English and maths criteria */
    if (metAllITTCriteria) {
      res.redirect(`/applications/${applicationId}/reject/reasons`)

    /* If they didn’t meet one of the ITT criteria */
    } else {
      res.redirect(`/applications/${applicationId}/reject/other-reasons`)
    }

  })

  router.get('/applications/:applicationId/reject/science', (req, res) => {
    const applicationId = req.params.applicationId

    res.render('applications/reject/science', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })


  router.get('/applications/:applicationId/reject/reasons', (req, res) => {
    const applicationId = req.params.applicationId
    res.render('applications/reject/reasons', {
      applicationId: applicationId,
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.get('/applications/:applicationId/reject/other-reasons', (req, res) => {
    const applicationId = req.params.applicationId

    res.render('applications/reject/other-reasons', {
      applicationId: applicationId,
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.get('/applications/:applicationId/reject/recommend', (req, res) => {
    res.render('applications/reject/recommend', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })


  router.get('/applications/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    res.render('applications/reject/check', {
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.status = 'Rejected'
    application.rejectedDate = application.rejectedFeedbackDate = new Date().toISOString()
    application.rejectedReasons = JSON.parse(JSON.stringify(req.session.data.rejection))
    req.flash('success', content.rejectApplication.successMessage)
    ApplicationHelper.addEvent(application, {
      "title": content.rejectApplication.event.title,
      "user": "Ben Brown",
      "date": new Date().toISOString()
    })

    delete req.session.data.rejection
    res.redirect(`/applications/${applicationId}/feedback`)
  })
}
