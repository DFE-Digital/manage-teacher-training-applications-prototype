const utils = require('../data/application-utils')
const { v4: uuidv4 } = require('uuid')
const { DateTime } = require('luxon')

function getTimeObject(time) {
  var hours;
  var mins;
  var isAm = time.indexOf('am') > -1;
  if(isAm) {
    time = time.split('am')[0].trim()
    if(time.indexOf(":") > -1) {
      hours = time.split(":")[0]
      mins = time.split(":")[1]
    } else {
      hours = time
      min = "00"
    }

    // if they selected 12am
    if(hours == "12") {
      hours = "00"
    }
  } else {
    time = time.split('pm')[0].trim()
    if(time.indexOf(":") > -1) {
      hours = time.split(":")[0]
      mins = time.split(":")[1]
    } else {
      hours = time
      mins = "00"
    }

    // convert to 24 hour only if not 12, if it's 12pm it's fine as 12
    if(hours != "12") {
      hours = parseInt(hours, 10) + 12;
    }
  }

  return {hours, mins}
}

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

    application.interviews.items = application.interviews.items || [];

    var id = uuidv4();

    var time = getTimeObject(req.session.data.interview.time);

    var date = DateTime.local(parseInt(req.session.data.interview.date.year, 10), parseInt(req.session.data.interview.date.month, 10), parseInt(req.session.data.interview.date.day, 10), parseInt(time.hours, 10), parseInt(time.mins, 10));

    application.interviews.items.push({
      id,
      date: date.toISO(),
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

  router.get('/application/:applicationId/interviews/:interviewId/edit', (req, res) => {
    const applicationId = req.params.applicationId
    const interviewId = req.params.interviewId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('application/interviews/edit/index', {
      application,
      interview: application.interviews.items.find(interview => interview.id === interviewId)
    })
  })

  router.post('/application/:applicationId/interviews/:interviewId/edit', (req, res) => {
    res.redirect(`/application/${req.params.applicationId}/interviews/${req.params.interviewId}/edit/check`)
  })

  router.get('/application/:applicationId/interviews/:interviewId/edit/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const interviewId = req.params.interviewId

    res.render('application/interviews/edit/check', {
      application,
      interview: application.interviews.items.find(interview => interview.id === interviewId)
    })
  })

  router.post('/application/:applicationId/interviews/:interviewId/edit/check', (req, res) => {

    const applicationId = req.params.applicationId
    const interviewId = req.params.interviewId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const interview = application.interviews.items.find(interview => interview.id === interviewId)

    var time = getTimeObject(req.session.data.interview.time);
    var date = DateTime.local(parseInt(req.session.data.interview.date.year, 10), parseInt(req.session.data.interview.date.month, 10), parseInt(req.session.data.interview.date.day, 10), parseInt(time.hours, 10), parseInt(time.mins, 10));

    interview.date = date.toISO()
    interview.details = req.session.data.interview.details

    application.events.items.push({
      title: "Interview updated",
      user: "Angela Mode",
      date: new Date().toISOString(),
      meta: {
        interviewId: interview.id
      }
    })

    delete req.session.data.interview

    req.flash('success', 'interview changed')
    res.redirect(`/application/${applicationId}/interviews`)

  })


}
