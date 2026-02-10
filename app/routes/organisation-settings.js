const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/organisation-settings', (req, res) => {
    var user = req.session.data.users[0]

    // seems like proto can support multi-org users, but not currently functioning like that, so adding support for single/multi user orgs
    var orgs = []
    if ( user.organisations[0] != null ) {
      orgs = user.organisations
    } else {
      orgs[0] = user.organisation
    }

    res.render('organisation-settings/index', {
      orgs: orgs
    })
  })

  
  router.get('/organisation-settings/:orgId/interview-preferences', (req, res) => {
    let org = req.session.data.organisations.find(org => org.id == req.params.orgId)
    let users = req.session.data.users.filter(user => {
      return user.organisation.id == req.params.orgId
    })

    users.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))

    res.render('organisation-settings/interview-preferences/index', {
      org,
      users
    })
  })

  
  router.get('/organisation-settings/:orgId/interview-preferences/edit', (req, res) => {
    let org = req.session.data.organisations.find(org => org.id == req.params.orgId)
    let users = req.session.data.users.filter(user => {
      return user.organisation.id == req.params.orgId
    })

    users.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))

    res.render('organisation-settings/interview-preferences/edit', {
      org,
      users
    })
  })

  router.post('/organisation-settings/:orgId/interview-preferences', (req, res) => {
    let showBanner = true
    let org = req.session.data.organisations.find(org => org.id == req.params.orgId)
    let users = req.session.data.users.filter(user => {
      return user.organisation.id == req.params.orgId
    })

    users.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))


    req.session.data.user.organisation['interviewPref'] = req.session.data['interviewPref']
    res.render('organisation-settings/interview-preferences/index', {
      org,
      users,
      showBanner
    })
    delete req.session.data['interviewPref']
  })


}
