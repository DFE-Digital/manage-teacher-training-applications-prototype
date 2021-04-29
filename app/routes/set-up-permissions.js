const _ = require('lodash');

module.exports = router => {

  function getUserRelationships(params) {
    return params.userOrgs.filter(org => !org.isAccreditedBody).map(org => {

      var item = { org: org, partners: [] };

      params.orgRelationships.filter(relationship => {
        return relationship.org1.id == org.id
      }).forEach(relationship => {
        item.partners.push({
          org: relationship.org2,
          id: relationship.id
        })
      })

      return item

    })
  }

  router.get('/onboard', (req, res) => {

    let userOrgs = req.session.data.user.organisations
    let relationships = _.groupBy(req.session.data.relationships, function(relationship){
      return relationship.org1.id
    })

    res.render('onboard/index', {
      userOrgs,
      relationships
    })
  })

  router.get('/onboard/check', (req, res) => {
    let userOrgs = req.session.data.user.organisations
    let orgRelationships = req.session.data.relationships
    let lastRelationshipId = req.session.data.relationships[req.session.data.relationships.length - 1].id

    let relationships = getUserRelationships({
      userOrgs,
      orgRelationships
    })

    res.render('onboard/check', {
      lastRelationshipId,
      relationships
    })
  })

  router.get('/onboard/confirmation', (req, res) => {
    res.render('onboard/confirmation')
  })


  router.get('/onboard/:relationshipId', (req, res) => {

    let relationship = req.session.data.relationships.filter(relationship => {
      return relationship.id == req.params.relationshipId
    })[0]

    res.render('onboard/relationship', {
      relationship,
      previousRelationshipId: parseInt(req.params.relationshipId, 10) - 1
    })
  })

  router.post('/onboard/:relationshipId', (req, res) => {

    let nextRelationshipId = parseInt(req.params.relationshipId, 10) + 1;

    let relationship = req.session.data.relationships.filter(relationship => {
      return relationship.id == nextRelationshipId
    })[0]

    // there's another relationship
    if(relationship) {
      res.redirect(`/onboard/${nextRelationshipId}`)
    } else {
      res.redirect('/onboard/check')
    }

  })

}
