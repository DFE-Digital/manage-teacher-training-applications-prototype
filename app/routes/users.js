module.exports = router => {

  router.get('/users', (req, res) => {
    // var successFlash = req.flash('success')

    // if (successFlash[0] === 'application-withdrawn') {
    //   var flash = "Offer successfully withdrawn";
    // }


    res.render('users/index', {
      flash: (req.flash('success')[0] == 'user-invited') ? "User successfully invited" : null
    })
  })

  router.post('/users/new', (req, res) => {
    req.flash('success', 'user-invited');
    res.redirect(`/users`);
  })

}
