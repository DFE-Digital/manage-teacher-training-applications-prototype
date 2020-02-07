module.exports = router => {
  router.get('/application/:applicationId/confirm-enrollment', (req, res) => {
    res.render(`application/confirm-enrollment`, {
      applicationId: req.params.applicationId
    })
  })

  // post comments about withdrawing
  router.post('/application/:applicationId/confirm-enrollment', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    // Update application status with reject reasons
    application.status = "Enrolled";
    application.offer.enrolledDate = new Date().toISOString();
    req.flash('success', 'enrolled')
    res.redirect(`/application/${applicationId}`)
  })

}
