const utils = require( '../data/application-utils')

module.exports = router => {

  router.get('/application/:applicationId/notes', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'note-added': 'Note successfully added'
      }
    })

    res.render('application/notes/index', {
      applicationId: applicationId,
      flashMessage
    })
  })

  router.get('/application/:applicationId/notes/new', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications[applicationId]

    res.render('application/notes/new', {
      applicationId: applicationId
    })
  })

  router.post('/application/:applicationId/notes/new', (req, res) => {
    const applicationId = req.params.applicationId;
    req.flash('success', 'note-added');
    res.redirect(`/application/${applicationId}/notes`);
  })

}
