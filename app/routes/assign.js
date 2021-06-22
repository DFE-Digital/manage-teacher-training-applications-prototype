
const parseUsers = (users, assignees = [], you = {}) => {
  if (!(users)) {
    return null
  }

  let options = []

  // sort the users alphabetically
  users.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))

  // parse all users into options
  users.forEach((user, i) => {
    const option = {}
    option.value = user.id

    option.text = user.firstName + ' ' + user.lastName
    if (you && you.id === user.id) {
      option.text += ' (you)'
    }

    option.hint = {}
    option.hint.text = user.emailAddress

    option.checked = false
    if (assignees && assignees.find(assignee => assignee.id === user.id) !== undefined) {
      option.checked = true
    }

    options.push(option)
  })

  // get 'me' out of the options
  const me = options.find(option => option.value === you.id)

  // remove 'me' from the options
  options = options.filter(option => option.value !== you.id)

  // put 'me' as the first person in the list of options
  options.splice(0,0,me)

  return options
}

module.exports = router => {

  router.get('/applications/:applicationId/assign', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)

    // get all the users for our organisation
    let users = req.session.data.users.filter(user => {
      return user.organisation.id == req.session.data.user.organisation.id
    })

    // parse users to an array we can use in the checkbox component
    users = parseUsers(users, application.assignees, req.session.data.user)

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

    // boolean used to check if application has been previously assigned
    const hasPreviousAssignees = (application.assignees && application.assignees.length) ? true : false

    const assigneeIds = req.session.data.assignees

    // get all the users for our organisation
    const users = req.session.data.users.filter(user => {
      return user.organisation.id == req.session.data.user.organisation.id
    })

    const assignees = []

    if (assigneeIds) {
      assigneeIds.forEach((assignee, i) => {
        let user = {}
        user = users.find(u => u.id === assignee)

        // remove permissions as not needed
        delete user.permissions
        // remove organisations as not needed
        delete user.organisations

        assignees.push(user)
      })
    }

    // add the assignees to the application
    application.assignees = assignees

    if ((assignees && assignees.length) || hasPreviousAssignees) {
      req.flash('success', 'Assigned users updated')
    }

    // get the referrer for routing
    const referrer = req.session.data.referrer

    // clean up the session data before moving on
    delete req.session.data.assignees
    delete req.session.data.referrer

    res.redirect(`${referrer}`);
  })

}
