const ApplicationHelper = require('../data/helpers/application')

function getUserRelationships(params) {
  return params.userOrgs.filter(org => !org.isAccreditedBody).map(org => {

    var item = { org: org, relationships: [] };
    params.orgRelationships
      .filter(relationship => {
        return relationship.org1.id == org.id || relationship.org2.id == org.id
      })
      .forEach(relationship => {
        if(relationship.org1.id == org.id) {
          item.relationships.push({
            id: relationship.id,
            org: relationship.org1,
            orgPermissions: relationship.org1Permissions,
            partner: relationship.org2,
            partnerPermissions: relationship.org2Permissions
          })
        } else {
          // swap it about
          item.relationships.push({
            id: relationship.id,
            org: relationship.org2,
            orgPermissions: relationship.org2Permissions,
            partner: relationship.org1,
            partnerPermissions: relationship.org1Permissions
          })
        }
      })

    return item

  })
}

module.exports = router => {

  router.get('/account/organisational-permissions', (req, res) => {
    let userOrgs = req.session.data.user.organisations
    let orgRelationships = req.session.data.relationships
    let relationships = getUserRelationships({
      userOrgs,
      orgRelationships
    })

    res.render('account/organisational-permissions/index', {
      relationships
    })
  })

  router.get('/account/organisational-permissions/:relationshipId/edit', (req, res) => {
    let relationship = req.session.data.relationships.find(relationship => relationship.id == req.params.relationshipId)

    res.render('account/organisational-permissions/edit', {
      relationship
    })
  })

  router.post('/account/organisational-permissions/:relationshipId/edit', (req, res) => {
    req.flash('success', 'Organisational permissions changed')
    res.redirect(`/account/organisational-permissions`)
  })
}
