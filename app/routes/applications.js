const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {
  router.get('/applications/:applicationId', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    // remove the search keywords if present to reset the search
    delete req.session.data.keywords

    // combine work history and school experience
    let experience = application.workHistory.items.concat(application.schoolExperience).sort((a, b) => {
      return new Date(b.startDate) - new Date(a.startDate);
    })

    res.render('applications/show', {
      experience,
      application,
      statusText: ApplicationHelper.getStatusText(application)
    })
  })

  router.get('/applications/:applicationId/timeline', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const events = application.events.items.map(item => {

      // interview
      if(item.meta && item.meta.interviewId) {
        var interview = application.interviews.items.find(interview => interview.id === item.meta.interviewId)
        item.meta ={
          interview
        }
      }

      // note
      if(item.meta && typeof item.meta.noteIndex === 'number') {
        var note = application.notes.items[item.meta.noteIndex]
        item.meta = {
          note
        }
      }

      return item;
    })


    res.render('applications/timeline/show', {
      application,
      statusText: ApplicationHelper.getStatusText(application),
      events: events,
      conditions: ApplicationHelper.getConditions(application)
    })
  })

  router.get('/applications/:applicationId/feedback', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/feedback/show', {
      application,
      statusText: ApplicationHelper.getStatusText(application)
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
