const ApplicationHelper = require('../data/helpers/application')
const CycleHelper = require('../data/helpers/cycles')

module.exports = router => {

  router.get('/overview', (req, res) => {
    let applications = req.session.data.applications.map(app => app).reverse()

    let aboutToBeAutomaticallyRejectedCount = applications.filter((app) => {
      return app.daysToRespond < 5 && (app.status == 'Received' || app.status == 'Interviewing')
    }).length

    let needsFeedbackCount = applications.filter((app)=> {
      return app.status == 'Rejected' && !app.rejectedReasons
    }).length

    let deferredOffersReadyToConfirm = applications.filter((app)=> {
      return app.status == 'Deferred' && app.cycle == CycleHelper.PREVIOUS_CYCLE.code
    }).length

    let conditionsPending = applications.filter((app)=> {
      return app.status == 'Conditions pending' && app.cycle == CycleHelper.PREVIOUS_CYCLE.code
    }).length

    var partners = req.session.data.user.relationships.map((relationship) => {

      // org 2 is always the partner
      var orgName = relationship.org2.name

      let apps = applications
        .filter(app => (app.provider == orgName || app.accreditedBody == orgName))
        .filter(app => (app.status == 'Received' || app.status == 'Interviewing'))

      return {
        orgName,
        apps
      }

    })

    partners = partners.sort((a, b) => {
      var textA = a.orgName.toUpperCase();
      var textB = b.orgName.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })

    var org
    if(req.session.data.user.organisation.isAccreditedBody) {
      org = {}
      org.name = req.session.data.user.organisation.name
      org.apps = applications
        .filter(app => app.accreditedBody == org.name)
        .filter(app => (app.status == 'Received' || app.status == 'Interviewing'))
    }

    res.render('overview', {
      boxes: {
        aboutToBeAutomaticallyRejectedCount,
        needsFeedbackCount,
        deferredOffersReadyToConfirm,
        conditionsPending
      },
      partners,
      org
    })
  })

}
