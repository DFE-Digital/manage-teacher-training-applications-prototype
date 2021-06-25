const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId/notes', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    let assignedUsers = []

    // get the assigned users for the user's current organisation
    if (application.assignedUsers && application.assignedUsers.length) {
      assignedUsers = application.assignedUsers.filter(user => user.organisation.id === req.session.data.user.organisation.id)
      assignedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))
    }

    res.render('applications/notes/index', {
      application,
      assignedUsers
    })
  })

  router.get('/applications/:applicationId/notes/first-time', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/notes/first-time', {
      application
    })
  })

  router.post('/applications/:applicationId/notes/first-time', (req, res) => {
    const applicationId = req.params.applicationId
    res.redirect(`/applications/${applicationId}/notes/new`)
  })

  router.get('/applications/:applicationId/notes/new', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/notes/new', {
      application
    })
  })

  router.post('/applications/:applicationId/notes/new', (req, res) => {
    const applicationId = req.params.applicationId
    req.flash('success', 'Note added')
    res.redirect(`/applications/${applicationId}/notes`)
  })

  router.get('/applications/:applicationId/notes/:noteId', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/notes/show', {
      application,
      note: application.notes.items.filter(note => note.id === req.params.noteId)[0]
    })
  })
}
