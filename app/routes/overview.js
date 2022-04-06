const CycleHelper = require('../data/helpers/cycles')
const OrgHelper = require('../data/helpers/organisation')

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
      return app.status == 'Conditions pending'
    }).length

    let activeApplicationsSections = []
    let userOrganisations = req.session.data.user.organisations
    userOrganisations.forEach(userOrganisation => {

      let activeApplicationsSection = {
        organisation: userOrganisation,
        items: []
      }

      // populate the user org if it's an accredited body

      if(userOrganisation.isAccreditedBody) {
        activeApplicationsSection.items.push({
          organisation: userOrganisation,
          received: applications.filter(app => app.provider == userOrganisation.name).filter(app => app.status == 'Received'),
          interviewing: applications.filter(app => app.provider == userOrganisation.name).filter(app => app.status == 'Interviewing'),
          offered: applications.filter(app => app.provider == userOrganisation.name).filter(app => app.status == 'Offered'),
          conditionsPending: applications.filter(app => app.provider == userOrganisation.name).filter(app => app.status == 'Conditions pending'),
          recruited: applications.filter(app => app.provider == userOrganisation.name).filter(app => app.status == 'Recruited')
        })

        // get partner data from relationships
        req.session.data.user.relationships.forEach(relationship => {
          // org 2 is always the partner
          var partnerOrganisation = relationship.org2

          activeApplicationsSection.items.push({
            organisation: partnerOrganisation,
            received: applications.filter(app => app.provider == partnerOrganisation.name).filter(app => app.status == 'Received'),
            interviewing: applications.filter(app => app.provider == partnerOrganisation.name).filter(app => app.status == 'Interviewing'),
            offered: applications.filter(app => app.provider == partnerOrganisation.name).filter(app => app.status == 'Offered'),
            conditionsPending: applications.filter(app => app.provider == partnerOrganisation.name).filter(app => app.status == 'Conditions pending'),
            recruited: applications.filter(app => app.provider == partnerOrganisation.name).filter(app => app.status == 'Recruited')
          })
        })

        activeApplicationsSections.push(activeApplicationsSection)
      }



    })


    res.render('overview', {
      boxes: {
        aboutToBeAutomaticallyRejectedCount,
        needsFeedbackCount,
        deferredOffersReadyToConfirm,
        conditionsPending
      },
      activeApplicationsSections
    })
  })

}
