const { fakerEN_GB: faker } = require('@faker-js/faker')

const path = require('path')
const directoryPath = path.join(__dirname, '../views/feedback/_content/')

const MarkdownHelper = require('../data/helpers/markdown')

module.exports = router => {
  // router.get('/complaints', (req, res) => {
  //
  //   // TODO: dynamically parse chat content on page
  //   const chatStatus = faker.helpers.arrayElement(['online', 'offline', 'unavailable'])
  //   const markdown = MarkdownHelper.getMarkdownContent(directoryPath, 'complaints-' + chatStatus)
  //
  //   res.render('feedback/index', {
  //     title: markdown.data.title,
  //     content: markdown.content,
  //     chatStatus
  //   })
  //
  // })
}
