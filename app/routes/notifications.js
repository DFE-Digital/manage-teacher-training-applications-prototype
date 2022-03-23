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

const getTypeCheckboxItems = (selectedItems) => {
  const items = []

  const types = ['Application received', 'Application received from another organisation', 'Reminder to make a decision 20 working days before automatic rejection', 'Application automatically rejected', 'Application withdrawn by candidate', 'Application transferred to another organisation', 'Offer accepted', 'Offer declined'
  ]

  types.forEach((type, i) => {
    const item = {}
    item.text = type
    item.value = type
    item.checked = (selectedItems && selectedItems.includes(type)) ? 'checked' : ''

    items.push(item)
  })
  return items
}

const getCheckboxValues = (name, data) => {
  return name && (Array.isArray(name) ? name : [name].filter((name) => {
    return name !== '_unchecked'
  })) || data && (Array.isArray(data) ? data : [data])
}

const removeFilter = (value, data) => {
  // do this check because if coming from overview page for example,
  // the query/param will be a string value, not an array containing a string
  if(Array.isArray(data)) {
    return data.filter(item => item !== value)
  } else {
    return null
  }
}

module.exports = router => {
  router.get('/notifications', (req, res) => {

    var filters = [
      'type'
    ]

    if(req.query.referrer === 'overview') {
      filters.forEach(filter => {
        if(req.query[filter]) {
          req.session.data[filter] = req.query[filter]
        } else {
          req.session.data[filter] = null
        }
        req.query[filter] = null
      })
    }

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

    let { type } = req.query

    const types = getCheckboxValues(type, req.session.data.type)

    // Get the pagination data
    let pagination = PaginationHelper.getPagination(activity, req.query.page, req.query.limit)

    activity = PaginationHelper.getDataByPage(activity, req.query.page, req.query.limit)

    activity = groupByDate(activity)

    const hasFilters = !!((types && types.length > 0))

    let selectedFilters = null
    if (hasFilters) {
      selectedFilters = {
        categories: []
      }

      if (types && types.length) {
        selectedFilters.categories.push({
          heading: { text: 'Types' },
          items: types.map((type) => {
            return {
              text: type,
              href: `/notifications/remove-type-filter/${type}`
            }
          })
        })
      }


    }


    let typeItems = getTypeCheckboxItems(req.session.data.type)

    // activity: activity,
    // now: SystemHelper.now(),
    // pagination: pagination,
    res.render('notifications/index', {
      typeItems,
      hasFilters,
      selectedFilters
    })
  })

  router.get('/notifications/remove-type-filter/:type', (req, res) => {
    req.session.data.type = removeFilter(req.params.type, req.session.data.type)
    res.redirect('/notifications')
  })

  router.get('/notifications/remove-all-filters', (req, res) => {
    req.session.data.type = null
    res.redirect('/notifications')
  })

}
