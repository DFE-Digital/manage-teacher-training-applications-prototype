var uuid = require('uuid/v4');
const utils = require( '../data/application-utils')

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
    const applicationId = req.params.applicationId;
    const application = req.session.data.applications[applicationId];
    application.status = "Rejected";
    application.rejectedDate = new Date().toISOString();
    application.rejectedReasons = utils.getRejectReasons(req.session.data);
    req.flash('success', 'rejected');
    res.redirect(`/application/${applicationId}`);
  })

}
