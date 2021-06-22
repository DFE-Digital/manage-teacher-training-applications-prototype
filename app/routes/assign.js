
const parseUsers = (users, assignees, you) => {
  if (!users) {
    return null
  }

  const options = []

  // sort the users alphabetically
  users.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))

  // get all users that aren't 'you'
  users.forEach((user, i) => {
    if (user.id !== you.id) {
      const option = {}
      option.value = user.id
      option.text = user.firstName + ' ' + user.lastName

      option.hint = {}
      option.hint.text = user.emailAddress

      option.checked = false
      if (assignees && assignees.find(assignee => assignee.id === user.id) !== undefined) {
        option.checked = true
      }

      options.push(option)
    }
  })

  // put 'you' as the first person in the list of options
  users.forEach((user, i) => {
    if (user.id === you.id) {
      const option = {}
      option.value = user.id
      option.text = user.firstName + ' ' + user.lastName + ' (you)'

      option.hint = {}
      option.hint.text = user.emailAddress

      option.checked = false
      if (assignees && assignees.find(assignee => assignee.id === user.id) !== undefined) {
        option.checked = true
      }

      options.splice(0,0,option)
    }
  })

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

    res.render('applications/assign/index', {
      application,
      users
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
        assignees.push(user)
      })
    }

    // add the assignees to the application
    application.assignees = assignees

    // clean up the session data before moving on
    delete req.session.data.assignees

    if ((assignees && assignees.length) || hasPreviousAssignees) {
      req.flash('success', 'Assigned users updated')
    }

    res.redirect(`/applications/${req.params.applicationId}/`);
  })

}
