var uuid = require('uuid/v4');
const utils = require( '../data/application-utils')

module.exports = router => {

  router.get('/application/:applicationId/reject', (req, res) => {
    res.render('application/reject/index', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/reject', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/reject/course-choice-and-safeguarding`);
  })

  router.get('/application/:applicationId/reject/course-choice-and-safeguarding', (req, res) => {
    res.render('application/reject/course-choice-and-safeguarding', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/reject/course-choice-and-safeguarding', (req, res) => {

    if( req.session.data['candidate-actions'] !== "Yes" &&
        req.session.data['missing-qualifications'] !== "Yes" &&
        req.session.data['appplication-quality'] !== "Yes" &&
        req.session.data['interview-performance'] !== "Yes" &&
        req.session.data['course-full'] !== "Yes" &&
        req.session.data['other-offer'] !== "Yes" &&
        req.session.data.safeguarding !== "Yes") {

      res.redirect(`/application/${req.params.applicationId}/reject/other-reasons-for-rejection`);

    } else {

      res.redirect(`/application/${req.params.applicationId}/reject/check`);

    }

  })

  router.get('/application/:applicationId/reject/other-reasons-for-rejection', (req, res) => {
    res.render('application/reject/other-reasons-for-rejection', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/reject/other-reasons-for-rejection', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/reject/check`);
  })

  router.get('/application/:applicationId/reject/check', (req, res) => {
    res.render('application/reject/check', {
      applicationId: req.params.applicationId,
      reasons: req.session.data.comments
    })
  })

  router.post('/application/:applicationId/reject/check', (req, res) => {
    const applicationId = req.params.applicationId;
    const application = req.session.data.applications[applicationId];
    application.status = "Rejected";
    application.rejectedDate = new Date().toISOString();
    application.rejectedReasons = utils.getRejectReasons(req.session.data);
    req.flash('success', 'rejected');
    res.redirect(`/application/${applicationId}`);
  })

}
