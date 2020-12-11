const ApplicationHelper = require('../data/helpers/application')

module.exports = router => {

  router.get('/account/organisational-permissions/:organisationId', (req, res) => {

    let org = req.session.data.user.organisations.find(org => org.id == req.params.organisationId)

    let relationships = req.session.data.relationships
      .filter(relationship => {
        return relationship.org1.id == org.id || relationship.org2.id == org.id
      })
      .map(relationship => {
        if(relationship.org1.id == org.id) {
          return {
            org: relationship.org1,
            orgPermissions: relationship.org1Permissions,
            partner: relationship.org2,
            partnerPermissions: relationship.org2Permissions
          }
        } else {
          // swap it about
          return {
            org: relationship.org2,
            orgPermissions: relationship.org2Permissions,
            partner: relationship.org1,
            partnerPermissions: relationship.org1Permissions
          }
        }
      })

    res.render('account/organisational-permissions/show', {
      org,
      relationships
    })
  })

  router.get('/account/organisational-permissions/:organisationId/edit', (req, res) => {
    res.render('account/organisational-permissions/edit', {
      organisationId: req.params.organisationId
    })
  })

  router.post('/account/organisational-permissions/:organisationId/edit', (req, res) => {
    req.flash('success', 'Permissions successfully changed')
    res.redirect(`/account/organisational-permissions/${req.params.organisationId}`)
  })
}
