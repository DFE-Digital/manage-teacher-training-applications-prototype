const utils = require('../data/application-utils')

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

  router.get('/users/:userId', (req, res) => {
    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'user-name-updated': 'User’s name successfully updated',
        'user-email-address-updated': 'User’s email address successfully updated',
        'user-providers-updated': 'User’s access successfully updated',
        'user-permissions-updated': 'User’s permissions successfully updated'
      }
    })

    res.render(`users/${req.params.userId}/index`, {
      flashMessage: flashMessage
    })
  })

  router.post('/users/new', (req, res) => {
    // res.redirect('/users/new/providers')
    res.redirect('/users/new/permissions')
  })

  router.post('/users/providers', (req, res) => {
    res.redirect('/users/new/permissions')
  })

  router.post('/users/new/check', (req, res) => {
    req.flash('success', 'user-invited')
    res.redirect('/users/')
  })

  router.post('/users/new-check', (req, res) => {
    req.flash('success', 'user-invited')
    res.redirect('/users/')
  })

  router.post('/users/:userId/change-name', (req, res) => {
    req.flash('success', 'user-name-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/:userId/change-email-address', (req, res) => {
    req.flash('success', 'user-email-address-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/change-providers', (req, res) => {
    req.flash('success', 'user-providers-updated')
    res.redirect('/users/show')
  })

  router.post('/users/:userId/change-permissions', (req, res) => {
    req.flash('success', 'user-permissions-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/:userId/change-permissions2', (req, res) => {
    req.flash('success', 'user-permissions-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/:userId/change-organisations/check', (req, res) => {
    req.flash('success', 'user-permissions-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/:userId/delete', (req, res) => {
    req.flash('success', 'user-account-deleted')
    res.redirect('/users')
  })

}
