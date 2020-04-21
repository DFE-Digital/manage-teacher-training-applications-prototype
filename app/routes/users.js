const utils = require( '../data/application-utils')

module.exports = router => {

  router.get('/users', (req, res) => {

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'user-invited': 'User successfully invited',
        'user-account-deleted': 'User’s account successfully deleted'
      }
    })

    res.render('users/index', {
      flashMessage: flashMessage
    })
  })

  router.get('/users/show', (req, res) => {

    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'user-name-updated': 'User’s name successfully updated',
        'user-email-address-updated': 'User’s email address successfully updated',
        'user-permissions-updated': 'User’s permissions successfully updated'
      }
    })

    res.render('users/show', {
      flashMessage: flashMessage
    })
  })

  router.post('/users/new', (req, res) => {
    res.redirect(`/users/new/providers`);
  })

  router.post('/users/new/check', (req, res) => {
    req.flash('success', 'user-invited');
    res.redirect(`/users/`);
  })

  router.post('/users/new-check', (req, res) => {
    req.flash('success', 'user-invited');
    res.redirect(`/users/`);
  })

  router.post('/users/change-name', (req, res) => {
    req.flash('success', 'user-name-updated');
    res.redirect(`/users/show`);
  })

  router.post('/users/change-email-address', (req, res) => {
    req.flash('success', 'user-email-address-updated');
    res.redirect(`/users/show`);
  })

  router.post('/users/change-permissions', (req, res) => {
    req.flash('success', 'user-permissions-updated');
    res.redirect(`/users/show`);
  })

  router.post('/users/delete', (req, res) => {
    req.flash('success', 'user-account-deleted');
    res.redirect(`/users`);
  })

}
