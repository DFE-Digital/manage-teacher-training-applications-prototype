const _ = require("lodash")
const { DateTime } = require('luxon')
const utils = require('../data/application-utils')

function getActivity(applications) {
  let activity = []

  applications.forEach(app => {
    const events = app.events.items.map(item => {
      return {
        app: app,
        event: item
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
    // Clone and turn into an array
    const apps = req.session.data.applications.filter(app => {
      return app.cycle === "2020 to 2021"
    })

    // Get the activity
    let activity = getActivity(apps)

    // Get the pagination data
    let pagination = utils.getPagination(data = activity, pageNumber = req.query.page, pageSize = req.query.limit)

    activity = utils.getDataByPage(activity, pagination.pageNumber)

    activity = groupByDate(activity)

    res.render('activity/index', {
      activity: activity,
      pagination: pagination
    })
  })
}
