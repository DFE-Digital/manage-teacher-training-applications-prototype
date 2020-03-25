var uuid = require('uuid/v4');
const utils = require( '../data/application-utils')

module.exports = router => {

  router.get('/application/:applicationId/reject', (req, res) => {
    res.render('application/reject/reject', {
      applicationId: req.params.applicationId
    })
  })

  router.post('/application/:applicationId/reject', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/reject/confirm`);
  })

  router.get('/application/:applicationId/reject/confirm', (req, res) => {
    res.render('application/reject/confirm', {
      applicationId: req.params.applicationId,
      reasons: req.session.data.comments
    })
  })

  router.post('/application/:applicationId/reject/confirm', (req, res) => {
    const applicationId = req.params.applicationId;
    const application = req.session.data.applications[applicationId];
    application.status = "Rejected";
    application.rejectedDate = new Date().toISOString();
    application.rejectedReasons = utils.getRejectReasons(req.session.data);
    req.flash('success', 'rejected');
    res.redirect(`/application/${applicationId}`);
  })

}
