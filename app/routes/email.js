module.exports = router => {
  router.all('/email/:applicationId/:view', (req, res) => {
    res.render(`email/${req.params.view}`, {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })
}
