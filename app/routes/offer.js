const ApplicationHelper = require('../data/helpers/application')
const CourseHelper = require('../data/helpers/courses')

module.exports = router => {

  router.get('/applications/:applicationId/offer', (req, res) => {
    const applicationId = req.params.applicationId
    const application = req.session.data.applications.find(app => app.id === applicationId)
    const assignedUsers = ApplicationHelper.getAssignedUsers(application, req.session.data.user.id, req.session.data.user.organisation.id)
    const course = CourseHelper.getCourse(application.offer.courseCode)
    const conditions = ApplicationHelper.getConditions(application.offer)

    res.render('applications/offer/show', {
      application,
      course,
      conditions,
      assignedUsers
    })
  })

}
