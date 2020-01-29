module.exports = router => {

  router.get('/users', (req, res) => {

    let flash;

    // real flash
    flash = (req.flash('success')[0] == 'user-invited') ? "User successfully invited" : null

    // fake flash in query string for taking screenshots
    flash = req.query.flash == 'user-invited' ? "User successfully invited" : null

    res.render('users/index', {
      flash: flash
    })
  })

  router.post('/users/new', (req, res) => {
    req.flash('success', 'user-invited');
    res.redirect(`/users`);
  })

}
