const utils = require( '../data/application-utils')

module.exports = router => {

  router.get('/users', (req, res) => {

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'user-invited': 'User successfully invited',
        'user-name-updated': 'User’s name successfully updated'
      }
    })

    res.render('users/index', {
      flashMessage: flashMessage
    })
  })

  router.post('/users/new', (req, res) => {
    req.flash('success', 'user-invited');
    res.redirect(`/users`);
  })

  router.post('/users/change-name', (req, res) => {
    req.flash('success', 'user-name-updated');
    res.redirect(`/users`);
  })

}
