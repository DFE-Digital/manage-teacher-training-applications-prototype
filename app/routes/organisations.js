const utils = require('../data/application-utils')

module.exports = router => {

  router.get('/organisations/:organisationId', (req, res) => {

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

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'permissions-changed': 'Permissions successfully changed'
      }
    })

    res.render('organisations/show', {
      flashMessage,
      org,
      relationships
    })
  })

  router.get('/organisations/:organisationId/edit', (req, res) => {
    res.render('organisations/edit')
  })

  router.post('/organisations/:organisationId/edit', (req, res) => {
    req.flash('success', 'permissions-changed')
    res.redirect(`/organisations/${req.params.organisationId}`)
  })
}
