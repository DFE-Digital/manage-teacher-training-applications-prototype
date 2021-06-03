const _ = require('lodash');

module.exports = router => {

  /*
    Returns a structure that looks like this:

    [{
      org: {id, name},
      partners: [{id, name}, ...]
    }, ...]
  */
  function getUserRelationships(params) {
    return params.userOrgs.map(org => {

      let item = { org: org, partners: [] };

      let orgRelationships = params.orgRelationships.filter(relationship => {
        return relationship.org1.id == org.id
      })

      // for each relationship found put it in partners array
      orgRelationships.forEach(relationship => {
        item.partners.push({
          org: relationship.org2,
          id: relationship.id
        })
      })

      return item

    })
    // At the moment I am not depuping relationships.
    // meaning, if the user belongs to, for example, the SCITT and SD
    // then the relationship should be included in the relationships data twice
    // As I do not dedupe, it means this function goes a bit funny
    // because the the SCITT and SD org is in the user object which this entire
    // function references, but there's no relationship for it.
    // So instead, I will just filter() out any items that don't have any partners
    // if we ever dedupe properly, we can kill this filter.
    .filter(item => item.partners.length > 0)
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

  router.post('/onboard/check', (req, res) => {
    // save relationship permissions

    Object.entries(req.session.data.orgpermissions).forEach(item => {
      const [key, value] = item;
      const relationshipId = parseInt(key.split('a')[1], 10)
      const relationship = req.session.data.relationships.find(relationship => relationship.id == relationshipId)

      relationship.org1Permissions = {
        makeDecisions: value.makeDecisions && value.makeDecisions.includes(relationship.org1.name),
        viewSafeguardingInformation: value.viewSafeguardingInformation && value.viewSafeguardingInformation.includes(relationship.org1.name),
        viewDiversityInformation: value.viewDiversityInformation && value.viewDiversityInformation.includes(relationship.org1.name)
      }
      relationship.org2Permissions = {
        makeDecisions: value.makeDecisions && value.makeDecisions.includes(relationship.org2.name),
        viewSafeguardingInformation: value.viewSafeguardingInformation && value.viewSafeguardingInformation.includes(relationship.org2.name),
        viewDiversityInformation: value.viewDiversityInformation && value.viewDiversityInformation.includes(relationship.org2.name)
      }
    })


    res.redirect('/onboard/confirmation')
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
