const fs = require('fs')
const matter = require('gray-matter')

exports.getMarkdownContent = (directoryPath, fileName) => {
  let doc = fs.readFileSync(directoryPath + fileName + '.md', 'utf8')
  const content = matter(doc)
  return content
}

exports.getListOfFiles = (directoryPath) => {
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
    file.position = content.data.position
    files.push(file)
  })

  files.sort((a, b) => a.position - b.position)

  return files
}
