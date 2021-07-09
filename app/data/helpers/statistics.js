const path = require('path')
const fs = require('fs')

const dataDirectoryPath = path.join(__dirname, '../statistics')

const getStatusData = () => {
  const filePath = dataDirectoryPath + '/status-chiltern-training.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  // .sort((a, b) => a.title.localeCompare(b.title))
  return data
}

exports.statusData = getStatusData()

const getConversionData = () => {
  const filePath = dataDirectoryPath + '/conversion-chiltern-training.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  return data
}

exports.conversionData = getConversionData()
