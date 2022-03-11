const ApplicationHelper = require('../data/helpers/application')
const content = require('../data/content')
const { v4: uuidv4 } = require('uuid')

module.exports = router => {
  router.get('/applications/:applicationId/notes', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)

    res.render('applications/notes/index', {
      application,
      assignedUsers,
      otherApplications: ApplicationHelper.getOtherApplications(application, req.session.data.applications)
    })
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
    const application = req.session.data.applications.find(app => app.id === applicationId)

    let note = {
      id: uuidv4(),
      message: req.body.note,
      sender: req.session.data.user.firstName + ' ' + req.session.data.user.lastName,
      date: new Date().toISOString()
    }

    application.notes.items.push(note)

    ApplicationHelper.addEvent(application, {
      title: content.createNote.event.title,
      user: note.sender,
      date: note.date,
      meta: {
        note
      }
    })

    req.session.data.note = null

    req.flash('success', content.createNote.successMessage)
    res.redirect(`/applications/${applicationId}/notes`)
  })

  router.get('/applications/:applicationId/notes/:noteId/edit', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const note = application.notes.items.find(note => note.id === req.params.noteId)
    res.render('applications/notes/edit', {
      application,
      note
    })
  })

  router.post('/applications/:applicationId/notes/:noteId/edit', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const note = application.notes.items.find(note => note.id === req.params.noteId)
    note.sender = "Bob Smith"
    note.message = req.body.note

    ApplicationHelper.addEvent(application, {
      title: content.updateNote.event.title,
      user: note.sender,
      date: note.date,
      meta: {
        note
      }
    })

    req.session.data.note = null

    req.flash('success', content.updateNote.successMessage)
    res.redirect(`/applications/${applicationId}/notes`)
  })


  // router.get('/applications/:applicationId/notes/:noteId', (req, res) => {
  //   const applicationId = req.params.applicationId
  //   const application = req.session.data.applications.find(app => app.id === applicationId)

  //   res.render('applications/notes/show', {
  //     application,
  //     note: application.notes.items.filter(note => note.id === req.params.noteId)[0]
  //   })
  // })
}
