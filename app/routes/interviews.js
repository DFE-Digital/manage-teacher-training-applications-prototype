const PaginationHelper = require('../data/helpers/pagination')
const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')
const _ = require('lodash');
const { DateTime } = require('luxon')
const { v4: uuidv4 } = require('uuid')

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
      mins = "00"
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

function getInterviews(applications) {
  let interviews = []
  applications = applications.filter(app => {
    return ApplicationHelper.getStatusText(app) == "Interviewing"
  })

  // update this to use FLATMAP
  applications.forEach(app => {
    const ints = app.interviews.items.map(item => {
      return {
        app: app,
        interview: item
      }
    })
    interviews = interviews.concat(ints)
  })

  interviews.sort((a, b) => {
    return new Date(a.interview.date) - new Date(b.interview.date)
  })

  return interviews
}

function groupInterviewsByDate(interviews) {
  return _.groupBy(interviews, (interview) => {
    var interviewDate = DateTime.fromISO(interview.interview.date);
    var groupDate = DateTime.fromObject({
      day: interviewDate.day,
      month: interviewDate.month,
      year: interviewDate.year,
    })
    return groupDate.toString();
  })
}

module.exports = router => {
  router.get('/interviews', (req, res) => {
    // remove the search keywords if present to reset the search
    delete req.session.data.keywords

    let interviews = getInterviews(req.session.data.applications)
    interviews = interviews.slice(9, interviews.length)

    // Get the pagination data
    let pagination = PaginationHelper.getPagination(interviews, req.query.page, req.query.limit)

    // this is close to SystemHelper.now() and is used to make sure we show the ‘today’ label in this view
    let now = interviews[0].interview.date

    interviews = PaginationHelper.getDataByPage(interviews, req.query.page, req.query.limit)
    interviews = groupInterviewsByDate(interviews)

    res.render('interviews/index', {
      now,
      interviews,
      pagination
    })
  })

  router.get('/interviews/past', (req, res) => {
    let interviews = getInterviews(req.session.data.applications)
    interviews = interviews.slice(0, 9).reverse()
    let pagination = PaginationHelper.getPagination(interviews, req.query.page, req.query.limit)
    interviews = PaginationHelper.getDataByPage(interviews, req.query.page, req.query.limit)
    interviews = groupInterviewsByDate(interviews)
    res.render('interviews/past', {
      interviews,
      pagination
    })
  })


  router.get('/applications/:applicationId/interviews', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    const statusText = ApplicationHelper.getStatusText(application)

    var now = SystemHelper.now()

    let upcomingInterviews = [];
    let pastInterviews = [];

    if(statusText == "Received" || statusText == "Interviewing") {
      upcomingInterviews = ApplicationHelper.getUpcomingInterviews(application)

      pastInterviews = application.interviews.items.filter(interview => {
        return DateTime.fromISO(interview.date) < now;
      })

    } else {
      pastInterviews = application.interviews.items;
    }

    res.render('applications/interviews/index', {
      application,
      upcomingInterviews,
      pastInterviews,
      statusText: ApplicationHelper.getStatusText(application)
    })
  })

  router.get('/applications/:applicationId/interviews/new', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/interviews/new/index', {
      application
    })
  })

  router.post('/applications/:applicationId/interviews/new', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/interviews/new/check`)
  })

  router.get('/applications/:applicationId/interviews/new/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/interviews/new/check', {
      application
    })
  })

  router.post('/applications/:applicationId/interviews/new/check', (req, res) => {

    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.interviews.items = application.interviews.items || [];

    var id = uuidv4();

    var time = getTimeObject(req.session.data.interview.time);

    var date = DateTime.local(parseInt(req.session.data.interview.date.year, 10), parseInt(req.session.data.interview.date.month, 10), parseInt(req.session.data.interview.date.day, 10), parseInt(time.hours, 10), parseInt(time.mins, 10));

    application.interviews.items.push({
      id,
      date: date.toISO(),
      details: req.session.data.interview.details,
      location: req.session.data.interview.location,
      organisation: req.session.data.interview.organisation
    })

    application.events.items.push({
      title: "Interview set up",
      user: "Angela Mode",
      date: new Date().toISOString(),
      meta: {
        interviewId: id
      }
    })

    delete req.session.data.interview

    req.flash('success', 'Interview set up')
    res.redirect(`/applications/${applicationId}/interviews`)

  })

  router.get('/applications/:applicationId/interviews/:interviewId/edit', (req, res) => {
    const applicationId = req.params.applicationId
    const interviewId = req.params.interviewId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/interviews/edit/index', {
      application,
      interview: application.interviews.items.find(interview => interview.id === interviewId)
    })
  })

  router.post('/applications/:applicationId/interviews/:interviewId/edit', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/interviews/${req.params.interviewId}/edit/check`)
  })

  router.get('/applications/:applicationId/interviews/:interviewId/edit/check', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const interviewId = req.params.interviewId

    res.render('applications/interviews/edit/check', {
      application,
      interview: application.interviews.items.find(interview => interview.id === interviewId)
    })
  })

  router.post('/applications/:applicationId/interviews/:interviewId/edit/check', (req, res) => {

    const applicationId = req.params.applicationId
    const interviewId = req.params.interviewId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const interview = application.interviews.items.find(interview => interview.id === interviewId)

    var time = getTimeObject(req.session.data.interview.time);

    var date = DateTime.local(parseInt(req.session.data.interview.date.year, 10), parseInt(req.session.data.interview.date.month, 10), parseInt(req.session.data.interview.date.day, 10), parseInt(time.hours, 10), parseInt(time.mins, 10));

    interview.date = date.toISO()
    interview.details = req.session.data.interview.details
    interview.location = req.session.data.interview.location
    interview.organisation = req.session.data.interview.organisation

    application.events.items.push({
      title: "Interview changed",
      user: "Angela Mode",
      date: new Date().toISOString(),
      meta: {
        interviewId: interview.id
      }
    })

    delete req.session.data.interview

    req.flash('success', 'Interview changed')
    res.redirect(`/applications/${applicationId}/interviews`)

  })

  router.get('/applications/:applicationId/interviews/:interviewId/delete', (req, res) => {
    const applicationId = req.params.applicationId
    const interviewId = req.params.interviewId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/interviews/delete/index', {
      application,
      interview: application.interviews.items.find(interview => interview.id === interviewId)
    })
  })

  router.post('/applications/:applicationId/interviews/:interviewId/delete', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/interviews/${req.params.interviewId}/delete/check`)
  })

  router.get('/applications/:applicationId/interviews/:interviewId/delete/check', (req, res) => {
    const applicationId = req.params.applicationId
    const interviewId = req.params.interviewId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    res.render('applications/interviews/delete/check', {
      application,
      interview: application.interviews.items.find(interview => interview.id === interviewId)
    })
  })

  router.post('/applications/:applicationId/interviews/:interviewId/delete/check', (req, res) => {
    const applicationId = req.params.applicationId
    const interviewId = req.params.interviewId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    application.interviews.items = application.interviews.items.filter(item => item.id !== interviewId)

    application.events.items.push({
      title: "Interview cancelled",
      user: "Angela Mode",
      date: new Date().toISOString()
    })

    req.flash('success', 'Interview cancelled')

    if(application.interviews.items.length) {
      res.redirect(`/applications/${req.params.applicationId}/interviews/`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}`)
    }

  })


}
