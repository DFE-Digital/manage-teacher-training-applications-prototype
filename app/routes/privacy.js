const PrivacyHelper = require('../data/helpers/privacy');

module.exports = router => {
  router.get('/privacy', (req, res) => {
    const links = PrivacyHelper.getListOfFiles()

    res.render('privacy/index', {
      links
    })
  })

  router.get('/privacy/:section', (req, res) => {
    const markdown = PrivacyHelper.getMarkdownContent(req.params.section)

    res.render('privacy/show', {
      title: markdown.data.title,
      content: markdown.content
    })
  })

}
