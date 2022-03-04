const CycleHelper = require('../data/helpers/cycles')
const SystemHelper = require('../data/helpers/system')
const PaginationHelper = require('../data/helpers/pagination')
const _ = require("lodash")
const { DateTime } = require('luxon')

function getActivity(applications, userOrganisationId) {
  let activity = []

  applications.forEach(application => {
    const events = application.events.items
      .map(item => {
      let interview = null
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
      if(item.title == 'Note added') {
        let note = application.notes.items.find(note => note.id === item.meta.note.id)
        if(note) {
          item.meta.note.exists = true
        }
      }

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
      return app.cycle === CycleHelper.CURRENT_CYCLE.code
    })

    // Get the activity
    let activity = getActivity(apps, req.session.data.user.organisation.id)

    activity = activity.filter(item => {
      const itemDate = DateTime.fromISO(item.event.date)
      return itemDate <= DateTime.now()
    })

    // Get the pagination data
    let pagination = PaginationHelper.getPagination(activity, req.query.page, req.query.limit)

    activity = PaginationHelper.getDataByPage(activity, req.query.page, req.query.limit)

    activity = groupByDate(activity)

    res.render('activity/index', {
      activity: activity,
      pagination: pagination,
      now: SystemHelper.now()
    })
  })
}
