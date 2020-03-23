var uuid = require('uuid/v4');

module.exports = router => {

  router.get('/application/:applicationId/reject', (req, res) => {
    res.render('application/reject', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/reject', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/confirm-reject`);
  })

  router.get('/application/:applicationId/confirm-reject', (req, res) => {
    res.render('application/confirm-rejection', {
      applicationId: req.params.applicationId,
      reasons: req.session.data.comments
    })
  })

  router.post('/application/:applicationId/confirm-reject', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]
    application.status = "Rejected";
    application.rejectedDate = new Date().toISOString();
    var data = req.session.data;

    console.log(data);
    application.rejectedReasons = {

      // Candidate actions
      "candidate-actions": data["candidate-actions"],
      "candidate-actions-reasons": data["candidate-actions-reasons"],
      "candidate-actions-reasons-other": data["candidate-actions-reasons-other"],

      // Course full
      "course-full": data["course-full"],

      // Missing qualifications
      "missing-qualifications": data["missing-qualifications"],
      "missing-qualifications-reasons": data["missing-qualifications-reasons"],
      "missing-qualifications-reasons-other": data["missing-qualifications-reasons-other"],

      // Application quality
      "application-quality": data["application-quality"],
      "application-quality-reasons": data["application-quality-reasons"],
      "application-quality-reasons-other": data["application-quality-reasons-other"],
      "application-quality-reasons-subject-knowledge": data["application-quality-reasons-subject-knowledge"],
      "application-quality-reasons-personal-statement": data["application-quality-reasons-personal-statement"],

      // Safeguarding
      "safeguarding": data["safeguarding"],
      "safeguarding-reasons": data["safeguarding-reasons"],
      "safeguarding-reasons-false-information": data["safeguarding-reasons-false-information"],
      "safeguarding-reasons-plagiarism": data["safeguarding-reasons-plagiarism"],
      "safeguarding-reasons-reference-information": data["safeguarding-reasons-reference-information"],
      "safeguarding-reasons-disclosed-information": data["safeguarding-reasons-disclosed-information"],
      "safeguarding-reasons-vetting-information": data["safeguarding-reasons-vetting-information"],
      "safeguarding-reasons-other": data["safeguarding-reasons-other"],

      // Another issue
      "another-issue": data["another-issue"],
      "another-issue-details": data["another-issue-details"],

      // Other feedback
      "other-feedback": data["other-feedback"],
      "other-feedback-details": data["other-feedback-details"],

      // Future applications
      "future-applications": data["future-applications"],
      "future-applications-details": data["future-applications-details"]
    };
    req.flash('success', 'rejected')
    res.redirect(`/application/${applicationId}`)
  })

}
