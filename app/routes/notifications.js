
module.exports = router => {
  router.post('/account/notifications', (req, res) => {
    req.flash('success', 'Email settings saved')
    res.redirect("/account/notifications")
  })
}
