const utils = require('../data/application-utils')
const { v4: uuidv4 } = require('uuid')
const { DateTime } = require('luxon')

module.exports = router => {
  router.get('/interviews', (req, res) => {
    const apps = req.session.data.applications

    let allInterviews = []

    apps.forEach(app => {
      const interviews = app.interviews.items.map(item => {
        return {
          app: app,
          interview: item
        }
      })
      allInterviews = allInterviews.concat(interviews)
    })

    allInterviews.sort((a, b) => {
      return new Date(b.interview.date) - new Date(a.interview.date)
    })


    res.render('interviews/index', {
      interviews: allInterviews.slice(0, 50)
    })
  })


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
      statusText: utils.getStatusText(application),
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

    application.status = 'Awaiting interview';
    application.interviews.items = application.interviews.items || [];

    var id = uuidv4();

    var time;
    var isAm = req.session.data.interview.time.indexOf('am');
    if(isAm) {
      time = req.session.data.interview.time.split('am')[0]
    } else {
      time = req.session.data.interview.time.split('pm')[0]

      // if time == 12 leave it
      // if time is not 12, say 1, then make it 13pm
      // if 2 make it 14pm
      // if 13 leave it alone

    }



    var date = DateTime.local(req.session.data.interview.date.year, req.session.data.interview.date.month, req.session.data.interview.date.day)



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
