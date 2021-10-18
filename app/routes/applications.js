const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)

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

    const hasOtherNonUkQualifications = application.otherQualifications && application.otherQualifications.find(qualification => qualification.country != 'United Kingdom')

    res.render('applications/show', {
      experience,
      application,
      hasOtherNonUkQualifications,
      assignedUsers
    })
  })

  router.get('/applications/:applicationId/timeline', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)

    const events = application.events.items.map(item => {
      let interview = null;

      // interview
      if(item.title == 'Interview set up') {
        interview = application.interviews.items.find(interview => interview.id === item.meta.interviewId)
        if(interview) {
          item.meta.interviewExists = true
        } else {
          item.meta.interviewExists = false
        }
      }

      // interview
      if(item.title == 'Interview changed') {
        interview = application.interviews.items.find(interview => interview.id === item.meta.interviewId)
        if(interview) {
          item.meta.interviewExists = true
        } else {
          item.meta.interviewExists = false
        }
      }

      // note
      if(item.title == 'Note added') {
        let note = application.notes.items.find(note => note.id === item.meta.note.id)
        if(note) {
          item.meta.note.exists = true
        }
      }

      // get assigned users for the user's organisation
      if (item.title === 'User assigned' || item.title === 'Users assigned' || item.title === 'Assigned users updated') {
        item.assignedUsers = item.assignedUsers.filter(user => user.organisation.id === req.session.data.user.organisation.id)
      }

      return item;
    })

    res.render('applications/timeline/show', {
      application,
      events: events,
      conditions: ApplicationHelper.getConditions(application.offer),
      assignedUsers
    })
  })

  router.get('/applications/:applicationId/feedback', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)

    res.render('applications/feedback/show', {
      application,
      assignedUsers
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
