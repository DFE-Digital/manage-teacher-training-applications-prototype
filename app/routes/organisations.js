const utils = require( '../data/application-utils')

module.exports = router => {

  router.get('/organisations/show3', (req, res) => {

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'permissions-changed': 'Permissions successfully changed'
      }
    })

    res.render('organisations/show3', {
      flashMessage: flashMessage
    })
  })

  router.post('/organisations/edit', (req, res) => {
    req.flash('success', 'permissions-changed');
    res.redirect(`/organisations/show3`);
  })

}
