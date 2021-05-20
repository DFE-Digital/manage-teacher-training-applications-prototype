function getRelationships(params) {
  let relationships = []

  params.relationships
    .filter(relationship => {
      return relationship.org1.id == params.org.id || relationship.org2.id == params.org.id
    })
    .forEach(relationship => {
      if(relationship.org1.id == params.org.id) {
        relationships.push({
          id: relationship.id,
          org: relationship.org1,
          orgPermissions: relationship.org1Permissions,
          partner: relationship.org2,
          partnerPermissions: relationship.org2Permissions
        })
      } else {
        // swap it about
        relationships.push({
          id: relationship.id,
          org: relationship.org2,
          orgPermissions: relationship.org2Permissions,
          partner: relationship.org1,
          partnerPermissions: relationship.org1Permissions
        })
      }
    })

  return relationships

}

module.exports = router => {

  router.get('/organisation-settings/:orgId/organisational-permissions', (req, res) => {
    let org = req.session.data.user.organisations.find(org => req.params.orgId == org.id)
    let relationships = getRelationships({ org, relationships: req.session.data.relationships })

    res.render('organisation-settings/organisational-permissions/index', {
      org: req.session.data.user.organisations.find(org => org.id == req.params.orgId),
      relationships
    })
  })

  router.get('/organisation-settings/:orgId/organisational-permissions/:relationshipId/edit', (req, res) => {
    let relationship = req.session.data.relationships.find(relationship => relationship.id == req.params.relationshipId)

    let orgpermissions = {
      makeDecisions: [],
      viewSafeguardingInformation: [],
      viewDiversityInformation: []
    }

    if(relationship.org1Permissions.makeDecisions) {
      orgpermissions.makeDecisions.push(relationship.org1.name)
    }
    if(relationship.org2Permissions.makeDecisions) {
      orgpermissions.makeDecisions.push(relationship.org2.name)
    }
    if(relationship.org1Permissions.viewSafeguardingInformation) {
      orgpermissions.viewSafeguardingInformation.push(relationship.org1.name)
    }
    if(relationship.org2Permissions.viewSafeguardingInformation) {
      orgpermissions.viewSafeguardingInformation.push(relationship.org2.name)
    }
    if(relationship.org1Permissions.viewDiversityInformation) {
      orgpermissions.viewDiversityInformation.push(relationship.org1.name)
    }
    if(relationship.org2Permissions.viewDiversityInformation) {
      orgpermissions.viewDiversityInformation.push(relationship.org2.name)
    }

    res.locals.data.orgpermissions = orgpermissions

    res.render('organisation-settings/organisational-permissions/edit', {
      relationship
    })
  })

  router.post('/organisation-settings/:orgId/organisational-permissions/:relationshipId/edit', (req, res) => {

    // update permissions
    let relationship = req.session.data.relationships.find(relationship => relationship.id == req.params.relationshipId)

    delete req.session.data.orgpermissions

    req.flash('success', 'Organisational permissions updated')
    res.redirect(`/organisation-settings/${req.params.orgId}/organisational-permissions`)
  })
}
