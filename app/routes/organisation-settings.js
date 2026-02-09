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

}
