const utils = require('../data/application-utils')

module.exports = router => {
  router.get('/application/:applicationId/notes', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'note-added': 'Note successfully added'
      }
    })

    res.render('application/notes/index', {
      application,
      flashMessage
    })
  })

  router.get('/application/:applicationId/notes/first-time', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/notes/first-time', {
      application
    })
  })

  router.post('/application/:applicationId/notes/first-time', (req, res) => {
    const applicationId = req.params.applicationId
    res.redirect(`/application/${applicationId}/notes/new`)
  })

  router.get('/application/:applicationId/notes/new', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/notes/new', {
      application
    })
  })

  router.post('/application/:applicationId/notes/new', (req, res) => {
    const applicationId = req.params.applicationId
    req.flash('success', 'note-added')
    res.redirect(`/application/${applicationId}/notes`)
  })

  router.get('/application/:applicationId/notes/:noteId', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/notes/show', {
      application,
      note: application.notes.items.filter(note => note.id === req.params.noteId)[0]
    })
  })
}
