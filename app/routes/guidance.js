const GuidanceHelper = require('../data/helpers/guidance');

module.exports = router => {
  router.get('/how-to-use-this-service', (req, res) => {
    const links = GuidanceHelper.getListOfFiles()

    res.render('guidance/index', {
      links
    })
  })

  router.get('/how-to-use-this-service/:section', (req, res) => {
    const markdown = GuidanceHelper.getMarkdownContent(req.params.section)

    res.render('guidance/show', {
      title: markdown.data.title,
      content: markdown.content
    })
  })

}
