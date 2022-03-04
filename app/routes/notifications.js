const CycleHelper = require('../data/helpers/cycles')
const SystemHelper = require('../data/helpers/system')
const PaginationHelper = require('../data/helpers/pagination')
const _ = require("lodash")
const { DateTime } = require('luxon')

function getNotifications(applications, userOrganisationId) {
  let activity = []



  applications.forEach(application => {
    const events = application.events.items

      // filter out certain events
      .map(item => {

      // get assigned users for the user's organisation
      if (item.title === 'User assigned' || item.title === 'Users assigned' || item.title === 'Assigned users updated') {
        item.assignedUsers = item.assignedUsers.filter(user => user.organisation.id === userOrganisationId)
      }

      return item;
    }).map(event => {
      return {
        application,
        event
      }
    })
    .filter(event => event.event.title != 'Note added')
    .filter(event => event.event.title != 'Users assigned')
    .filter(event => event.event.title != 'User assigned')
    .filter(event => event.event.title != 'Interview set up')
    .filter(event => event.event.title != 'Interview updated')
    .filter(event => event.event.title != 'Interview cancelled')
    .filter(event => event.event.title != 'Offer made')
    .filter(event => event.event.title != 'Offer updated')
    .filter(event => event.event.title != 'Offer declined')
    .filter(event => event.event.title != 'Offer accepted')
    .filter(event => event.event.title != 'Offer withdrawn')
    // .filter(event => event.event.title != 'Application received')
    .filter(event => event.event.title != 'Conditions marked as not met')
    .filter(event => event.event.title != 'Conditions marked as met')
    .filter(event => event.event.title != 'Offer automatically declined')
    // .filter(event => {
    //   var returnValue = false

    //   // filter out items that are rejected manually with feedback
    //   if(event.event.title == 'Application rejected' && event.application.rejectedReasons) {
    //     returnValue = true
    //   }
    //   return returnValue
    // })


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
  router.get('/notifications', (req, res) => {

    // Clone and turn into an array
    const apps = req.session.data.applications.filter(app => {
      return app.cycle === CycleHelper.CURRENT_CYCLE.code
    })

    // Get the activity
    let activity = getNotifications(apps, req.session.data.user.organisation.id)

    activity = activity.filter(item => {
      const itemDate = DateTime.fromISO(item.event.date)
      return itemDate <= DateTime.now()
    })



    // Get the pagination data
    let pagination = PaginationHelper.getPagination(activity, req.query.page, req.query.limit)

    activity = PaginationHelper.getDataByPage(activity, req.query.page, req.query.limit)

    activity = groupByDate(activity)

    res.render('notifications/index', {
      activity: activity,
      pagination: pagination,
      now: SystemHelper.now()
    })
  })
}
