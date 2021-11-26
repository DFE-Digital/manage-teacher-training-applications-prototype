const path = require('path')
const directoryPath = path.join(__dirname, '../views/feedback/_content/')

const MarkdownHelper = require('../data/helpers/markdown')

module.exports = router => {
  router.get('/complaints', (req, res) => {
    const markdown = MarkdownHelper.getMarkdownContent(directoryPath, 'complaints')

    res.render('feedback/index', {
      title: markdown.data.title,
      content: markdown.content
    })

  })
}
