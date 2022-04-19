const content = require('../data/content')

module.exports = router => {

  router.post('/applications/:applicationId/shortlist', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    application.status = 'Shortlisted'
    application.events.items.push({
      date: new Date().toISOString(),
      user: "Alicia Grenada",
      title: content.addToShortlist.event.title,
      meta: {
        course: {
          provider: application.provider,
          course: application.course,
          location: application.location,
          studyMode: application.studyMode,
          accreditedBody: application.accreditedBody,
          fundingType: application.fundingType,
          qualifications: application.qualifications
        }
      }
    })

    req.flash('success', content.addToShortlist.successMessage)
    res.redirect(`/applications/${applicationId}`)
  })


}
