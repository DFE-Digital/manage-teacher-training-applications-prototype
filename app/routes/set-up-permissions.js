module.exports = router => {

  router.get('/onboard', (req, res) => {

      var orgs = req.session.data.user.organisations;

      var trainingProviders = orgs.filter(org => !org.isAccreditedBody).map(org => {

        var item = { org: org, partners: [] };

        req.session.data.relationships.filter(relationship => {
          return relationship.org1.id == org.id
        }).forEach(relationship => {
          item.partners.push(relationship.org2)
        })

        return item

      })


    res.render('onboard/index', {
      orgs,
      trainingProviders
    })
  })

}
