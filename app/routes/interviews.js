const utils = require('../data/application-utils')
const { v4: uuidv4 } = require('uuid')

module.exports = router => {
  router.get('/application/:applicationId/interviews', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'interview-added': 'Interview successfully set up'
      }
    })

    res.render('application/interviews/index', {
      application,
      flashMessage
    })
  })

  router.get('/application/:applicationId/interviews/new', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/interviews/new/index', {
      application
    })
  })

  router.post('/application/:applicationId/interviews/new', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/interviews/new/check`)
  })

  router.get('/application/:applicationId/interviews/new/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/interviews/new/check', {
      application
    })
  })

  router.post('/application/:applicationId/interviews/new/check', (req, res) => {

    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.status = 'Interviewing';
    application.interviews.items = application.interviews.items || [];

    var id = uuidv4();

    application.interviews.items.push({
      id,
      date: new Date(req.session.data.interview.date.year, parseInt(req.session.data.interview.date.month, 10)-1, req.session.data.interview.date.day).toISOString(),
      time: req.session.data.interview.time,
      details: req.session.data.interview.details
    })

    application.events.items.push({
      title: "Interview added",
      user: "Angela Mode",
      date: new Date().toISOString(),
      meta: {
        interviewId: id
      }
    })

    delete req.session.data.interview

    req.flash('success', 'interview setup')
    res.redirect(`/application/${applicationId}/interviews`)

  })
}
