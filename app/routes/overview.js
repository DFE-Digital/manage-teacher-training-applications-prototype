const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/overview', (req, res) => {
    let applications = req.session.data.applications.map(app => app).reverse()

    let aboutToBeAutomaticallyRejectedCount = applications.filter((app)=> {
      return app.daysToRespond < 5 && (app.status == 'Received' || app.status == 'Interviewing')
    }).length

    let needsFeedbackCount = applications.filter((app)=> {
      return app.status == 'Rejected' && !app.rejectedReasons
    }).length


    res.render('overview', {
      aboutToBeAutomaticallyRejectedCount,
      needsFeedbackCount
    })
  })

}
