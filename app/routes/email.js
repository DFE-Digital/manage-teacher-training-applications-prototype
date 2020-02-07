module.exports = router => {
  router.all('/email/:applicationId/:view', (req, res) => {
    res.render(`email/${req.params.view}`, {
      applicationId: req.params.applicationId
    })
  })
}
