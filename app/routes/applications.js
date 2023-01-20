const ApplicationHelper = require('../data/helpers/application')
const courses = require('../data/courses')

module.exports = router => {
  router.get('/applications/:applicationId', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)
    const course = courses.find(course => course.code === application.courseCode)

    // remove the search keywords if present to reset the search
    delete req.session.data.keywords

    // combine work history and school experience
    let experience = application.workHistory.items
    if(application.schoolExperience) {
      experience = experience.concat(application.schoolExperience)
    }

    experience.sort((a, b) => {
      return new Date(b.startDate) - new Date(a.startDate)
    })

    const hasOtherNonUkQualifications = application.otherQualifications && application.otherQualifications.find(qualification => qualification.country != 'United Kingdom')

    if(application.otherQualifications) {
      application.otherQualifications = application.otherQualifications.sort((a, b) => {
        return b.year - a.year
      })
    }

    res.render('applications/show', {
      experience,
      application,
      course,
      hasOtherNonUkQualifications,
      assignedUsers,
      otherApplications: ApplicationHelper.getOtherApplications(application, req.session.data.applications)
    })
  })

  router.get('/applications/:applicationId/references', (req, res) => {
    res.render('applications/references/index', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
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
      if(item.title == 'Interview updated') {
        interview = application.interviews.items.find(interview => interview.id === item.meta.interviewId)
        if(interview) {
          item.meta.interviewExists = true
        } else {
          item.meta.interviewExists = false
        }
      }

      // note
      if(item.title == 'Note added' || item.title == 'Note updated') {
        let note = application.notes.items.find(note => note.id === item.meta.note.id)
        if(note) {
          item.meta.note.exists = true
        } else {
          item.meta.note.exists = false
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
      assignedUsers,
      otherApplications: ApplicationHelper.getOtherApplications(application, req.session.data.applications)
    })
  })

  router.get('/applications/:applicationId/other-applications', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)

    res.render('applications/other-applications/index', {
      application,
      assignedUsers,
      otherApplications: ApplicationHelper.getOtherApplications(application, req.session.data.applications)
    })
  })

  router.get('/applications/:applicationId/feedback', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)

    res.render('applications/feedback/show', {
      application,
      assignedUsers,
      otherApplications: ApplicationHelper.getOtherApplications(application, req.session.data.applications)
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
      "Fitness to train to teach check",
      "Disclosure and Barring Service (DBS) check"
    ]

    if (decision === '1') {
      res.redirect(`/applications/${applicationId}/offer/new`)
    } else if (decision === '2') {
      res.redirect(`/applications/${applicationId}/offer/new/course?referrer=decision`)
    } else {
      res.redirect(`/applications/${applicationId}/reject/degree`)
    }
  })

}
