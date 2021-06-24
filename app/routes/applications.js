const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    let assignedUsers = []

    // get the assigned users for the user's current organisation
    if (application.assignedUsers && application.assignedUsers.length) {
      assignedUsers = application.assignedUsers.filter(user => user.organisation.id === req.session.data.user.organisation.id)
      assignedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))
    }

    // remove the search keywords if present to reset the search
    delete req.session.data.keywords

    // combine work history and school experience
    let experience = application.workHistory.items
    if(application.schoolExperience) {
      experience = experience.concat(application.schoolExperience)
    }

    experience.sort((a, b) => {
      return new Date(b.startDate) - new Date(a.startDate);
    })

    res.render('applications/show', {
      experience,
      application,
      assignedUsers
    })
  })

  router.get('/applications/:applicationId/timeline', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const events = application.events.items.map(item => {

      // interview
      if(item.title == 'Interview set up') {
        var interview = application.interviews.items.find(interview => interview.id === item.meta.interview.id)
        if(interview) {
          item.meta.interview.exists = true
        }
      }

      // interview
      if(item.title == 'Interview changed') {
        var interview = application.interviews.items.find(interview => interview.id === item.meta.interview.id)
        if(interview) {
          item.meta.interview.exists = true
        }
      }

      // note
      if(item.title == 'Note added') {
        var note = application.notes.items.find(note => note.id === item.meta.note.id)
        if(note) {
          item.meta.note.exists = true
        }
      }

      return item;
    })

    res.render('applications/timeline/show', {
      application,
      events: events,
      conditions: ApplicationHelper.getConditions(application.offer)
    })
  })

  router.get('/applications/:applicationId/feedback', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/feedback/show', {
      application
    })
  })

  router.get('/applications/:applicationId/decision', (req, res) => {
    res.render('applications/decision', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/decision', (req, res) => {
    const applicationId = req.params.applicationId
    const { decision, option } = req.body

    const data = req.session.data;
    // Clear data from previous journeys
    delete data['further-conditions']

    data["standard-conditions"] = [
      "Fitness to teach check",
      "Disclosure and barring service check"
    ]

    if (decision === '1') {
      res.redirect(`/applications/${applicationId}/offer/new`)
    } else if (decision === '2') {
      res.redirect(`/applications/${applicationId}/offer/new/provider`)
    } else {
      res.redirect(`/applications/${applicationId}/reject`)
    }
  })

}
