module.exports = router => {

  router.get('/onboard', (req, res) => {

    var items = [];

    req.session.data.user.organisations.forEach(org => {

      var item = { org: org, partners: [] };

      let relationships = req.session.data.relationships.filter(relationship => {
        return relationship.org.id == org.id
      }).forEach(relationship => {
        item.partners.push(relationship.partner)
      })

      items.push(item);

    })

    res.render('onboard/index', {
      items
    })
  })

}
