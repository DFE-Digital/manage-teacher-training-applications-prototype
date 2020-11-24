const _ = require("lodash")
const { DateTime } = require('luxon')

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

function slice(array, pageSize, pageNumber) {
  --pageNumber // because pages logically start with 1, but technically with 0
  return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
}

module.exports = router => {
  router.get('/activity', (req, res) => {
    // Clone and turn into an array
    const apps = req.session.data.applications.filter(app => {
      return app.cycle === "2020 to 2021"
    })

    // Get the activity
    let activity = getActivity(apps)

    // Total number of activity events
    let count = activity.length;

    // Prevent users putting in a limit not in the pre-defined set: 10, 25, 50, 100
    let limit = 50;
    if ([10,25,50,100].indexOf(parseInt(req.query.limit)) !== -1) {
      limit = (req.query.limit) ? parseInt(req.query.limit) : 50
    }

    // Current page
    let page = (req.query.page) ? parseInt(req.query.page) : 1

    // Total number of pages
    let pageCount = Math.ceil(count / limit)

    // Calculate the previous and next pages
    let prevPage = (page - 1) ? (page - 1) : 1
    let nextPage = ((page + 1) > pageCount) ? pageCount : (page + 1)

    let startItem = (page == 1) ? page : ((page * limit) - limit) + 1;
    let endItem = (page == 1) ? (page * limit) : ((startItem + limit) - 1);

    activity = slice(activity, limit, page)

    activity = groupByDate(activity)

    res.render('activity/index', {
      activity: activity,
      totalCount: count,
      pageSize: limit,
      pageCount: pageCount,
      pageNumber: page,
      startItem: startItem,
      endItem: endItem
    })
  })
}
