const path = require('path')
const fs = require('fs')

const dataDirectoryPath = path.join(__dirname, '../statistics')

exports.getStatusData = (fileName) => {
  if (!fileName) {
    return null
  }
  const filePath = dataDirectoryPath + '/status-' + fileName + '.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  return data
}

exports.getConversionData = (fileName) => {
  if (!fileName) {
    return null
  }
  const filePath = dataDirectoryPath + '/conversion-' + fileName + '.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  return data
}
