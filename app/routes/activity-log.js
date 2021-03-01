const PaginationHelper = require('../data/helpers/pagination')
const _ = require("lodash")
const { DateTime } = require('luxon')

function getActivity(applications) {
  let activity = []

  applications.forEach(application => {
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
    }).map(event => {
      return {
        application,
        event
      }
    })
    activity = activity.concat(events)
  })

  activity.sort((a, b) => {
    return new Date(b.event.date) - new Date(a.event.date)
  })

  return activity
}

function groupByDate(data) {
  return _.groupBy(data, (item) => {
    const itemDate = DateTime.fromISO(item.event.date)
    const groupDate = DateTime.fromObject({
      day: itemDate.day,
      month: itemDate.month,
      year: itemDate.year,
    })
    return groupDate.toString()
  })
}

module.exports = router => {
  router.get('/activity', (req, res) => {
    // remove the search keywords if present to reset the search
    delete req.session.data.keywords

    // Clone and turn into an array
    const apps = req.session.data.applications.filter(app => {
      return app.cycle === "2020 to 2021"
    })

    // Get the activity
    let activity = getActivity(apps)

    // Get the pagination data
    let pagination = PaginationHelper.getPagination(activity, req.query.page, req.query.limit)

    activity = PaginationHelper.getDataByPage(activity, req.query.page, req.query.limit)

    activity = groupByDate(activity)

    res.render('activity/index', {
      activity: activity,
      pagination: pagination
    })
  })
}
