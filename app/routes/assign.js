const _ = require('lodash')
const EventHelper = require('../data/helpers/events')

const parseUsers = (users, assignedUsers = [], you = {}) => {
  if (!(users)) {
    return null
  }

  let options = []

  // sort the users alphabetically
  users.sort((a, b) => a.firstName.localeCompare(b.firstName)
                        || a.lastName.localeCompare(b.lastName)
                        || a.emailAddress.localeCompare(b.emailAddress))

  // parse all users into options
  users.forEach((user, i) => {
    const option = {}
    option.value = user.id

    option.text = user.firstName + ' ' + user.lastName
    if (you && you.id === user.id) {
      option.text += ' (you)'
    }

    const hasDuplicateName = users.filter(u => u.firstName === user.firstName && u.lastName === user.lastName).length > 1 ? true : false

    if(hasDuplicateName) {
      option.hint = {}
      option.hint.text = user.emailAddress
    }

    option.checked = false
    if (assignedUsers && assignedUsers.find(assignedUser => assignedUser.id === user.id) !== undefined) {
      option.checked = true
    }

    options.push(option)
  })

  if (you && you.id) {
    // get 'you' out of the options
    const youOption = options.find(option => option.value === you.id)

    // remove 'you' from the options
    options = options.filter(option => option.value !== you.id)

    // put 'you' as the first person in the list of options
    options.splice(0, 0, youOption)
  }

  return options
}

module.exports = router => {

  router.get('/applications/:applicationId/assign', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const user = req.session.data.user

    // get all the users for our organisation
    let users = req.session.data.users.filter(u => {
      return u.organisation.id == user.organisation.id
    })

    // parse users to an array we can use in the checkbox component
    users = parseUsers(users, application.assignedUsers, req.session.data.user)

    // save the referrer for future routing
    req.session.data.referrer = req.headers.referer
    const back = req.session.data.referrer

    res.render('applications/assign/index', {
      application,
      users,
      back
    })
  })

  router.post('/applications/:applicationId/assign', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const user = req.session.data.user

    let currentAssignedUsers = []

    // get assigned users in user's organisations
    if (application.assignedUsers && application.assignedUsers.length) {
      currentAssignedUsers = application.assignedUsers.filter(u => u.organisation.id === user.organisation.id)
    }

    // boolean used to check if application has been previously assigned
    // to someone in current user's organisation
    const hasPreviousAssignedUsers = (currentAssignedUsers && currentAssignedUsers.length > 0) ? true : false

    // get all the assigned user IDs that have been submitted
    const assignedUserIds = req.session.data.assignedUsers

    // get all the users for the current user's organisation
    let users = req.session.data.users.filter(u => {
      return u.organisation.id == user.organisation.id
    })

    // clone the users so we can clean the data and only use what we need
    users = _.cloneDeep(users)

    let assignedUsers = []

    // get assigned users not in the user's current organisation and populate the array
    if (application.assignedUsers && application.assignedUsers.length) {
      assignedUsers = application.assignedUsers.filter(u => u.organisation.id !== user.organisation.id)
    }

    // populate the changes to the assigned users in user's organisation
    if (assignedUserIds) {
      assignedUserIds.forEach((assignedUserId, i) => {
        let assignedUser = {}
        // get the user's details
        assignedUser = users.find(u => u.id === assignedUserId)

        // remove data that's not needed for the assignment
        delete assignedUser.organisations
        delete assignedUser.permissions

        // put the user details into the assigned users array
        assignedUsers.push(assignedUser)
      })
    }

    // add the assignedUsers to the application
    application.assignedUsers = assignedUsers

    const hasApplicationAssignmentEvents = EventHelper.hasApplicationAssignmentEvents(application)

    let eventTitle = 'User assigned'
    if (assignedUsers.length > 1) {
      eventTitle = 'Users assigned'
    }
    if (hasApplicationAssignmentEvents) {
      eventTitle = 'Assigned users updated'
    }

    EventHelper.saveEvent(
      application,
      {
        title: eventTitle,
        user: user.firstName + ' ' + user.lastName,
        assignedUsers
      }
    )


    // get the referrer for routing
    const referrer = req.session.data.referrer

    // clean up the session data before moving on
    delete req.session.data.assignedUsers
    delete req.session.data.referrer

    res.redirect(`${referrer}`);
  })

}
