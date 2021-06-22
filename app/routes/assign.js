
const parseUsers = (data, assignees, you) => {
  if (!data) {
    return null
  }

  const users = []

  // get all users that aren't 'you'
  data.forEach((item, i) => {
    if (item.id !== you.id) {
      const user = {}
      user.value = item.id
      user.text = item.firstName + ' ' + item.lastName

      user.hint = {}
      user.hint.text = item.emailAddress

      user.checked = false
      if (assignees && assignees.find(assignee => assignee.id === item.id) !== undefined) {
        user.checked = true
      }

      users.push(user)
    }
  })

  // sort the users alphabetically
  users.sort((a, b) => a.text.localeCompare(b.text))

  // put 'you' as the first person in the list of users
  data.forEach((item, i) => {
    if (item.id === you.id) {
      const user = {}
      user.value = item.id
      user.text = item.firstName + ' ' + item.lastName + ' (you)'

      user.hint = {}
      user.hint.text = item.emailAddress

      user.checked = false
      if (assignees && assignees.find(assignee => assignee.id === item.id) !== undefined) {
        user.checked = true
      }

      users.splice(0,0,user)
    }
  })

  return users
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
