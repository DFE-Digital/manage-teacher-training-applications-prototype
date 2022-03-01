const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/overview', (req, res) => {
    let applications = req.session.data.applications.map(app => app).reverse()

    let aboutToBeAutomaticallyRejectedCount = applications.filter((app) => {
      return app.daysToRespond < 5 && (app.status == 'Received' || app.status == 'Interviewing')
    }).length

    let needsFeedbackCount = applications.filter((app)=> {
      return app.status == 'Rejected' && !app.rejectedReasons
    }).length

    var partners = req.session.data.user.relationships.map((relationship) => {

      // org 2 is always the partner
      var org = relationship.org2.name

      let apps = applications
        .filter(app => (app.provider == org || app.accreditedBody == org))
        .filter(app => (app.status == 'Received' || app.status == 'Interviewing'))

      return {
        org,
        apps
      }

    })

    partners = partners.sort((a, b) => {
      var textA = a.org.toUpperCase();
      var textB = b.org.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })

    res.render('overview', {
      aboutToBeAutomaticallyRejectedCount,
      needsFeedbackCount,
      partners
    })
  })

}
