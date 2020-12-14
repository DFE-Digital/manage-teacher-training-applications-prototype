
module.exports = router => {
  router.post('/account/notifications', (req, res) => {

    req.session.data.emailsettings = req.body.emailsettings

    req.flash('success', 'Email notification settings saved')
    res.redirect("/account/notifications")
  })
}
