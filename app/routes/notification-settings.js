
module.exports = router => {
  router.post('/account/notifications', (req, res) => {

    req.session.data.emailsettings = req.body.emailsettings

    res.redirect("/account/notifications")
  })
}
