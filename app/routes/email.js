/**
 * Email routes
 */
module.exports = router => {
  // Render email pages
  router.all('/email/:applicationId/:view', (req, res) => {
    res.render(`email/${req.params.view}`, {
      applicationId: req.params.applicationId
    })
  })
}
