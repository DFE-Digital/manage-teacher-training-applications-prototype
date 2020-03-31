module.exports = router => {
  router.get('/application/:applicationId/enrol/confirm', (req, res) => {
    res.render(`application/enrol/confirm`, {
      applicationId: req.params.applicationId
    })
  })

  // post comments about withdrawing
  router.post('/application/:applicationId/enrol/confirm', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Update application status with reject reasons
    application.status = "Enrolled";
    application.offer.enrolledDate = new Date().toISOString();
    req.flash('success', 'enrolled')
    res.redirect(`/application/${applicationId}/offer`)
  })

}
