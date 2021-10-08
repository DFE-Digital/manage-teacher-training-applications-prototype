const path = require('path')
const fs = require('fs')
const matter = require('gray-matter')

const directoryPath = path.join(__dirname, '../../views/guidance/_content/')

exports.getMarkdownContent = (fileName) => {
  let doc = fs.readFileSync(directoryPath + fileName + '.md', 'utf8')
  const content = matter(doc)
  return content
}

exports.getListOfFiles = () => {
  let documents = fs.readdirSync(directoryPath,'utf8')

  // Only get markdown documents
  documents = documents.filter(doc => doc.match(/.*\.(md)/ig))

  let files = []

  documents.forEach((filename, i) => {
    const doc = fs.readFileSync(directoryPath + '/' + filename)
    const content = matter(doc)
    const file = {}
    file.slug = filename.replace(/.(md)/,'')
    file.title = content.data.title
    files.push(file)
  })

  // sort files alphabetically by title
  // files = files.sort((a, b) => {
  //   return a.title.localeCompare(b.title)
  // })

  return files
}
