const path = require('path')
const fs = require('fs')

const dataDirectoryPath = path.join(__dirname, '../statistics')

const getStatusData = () => {
  const filePath = dataDirectoryPath + '/status.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  // .sort((a, b) => a.title.localeCompare(b.title))
  return data
}

exports.statusData = getStatusData()

const getProgressData = () => {
  const filePath = dataDirectoryPath + '/progress.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  return data
}

exports.progressData = getProgressData()

const getConversionData = () => {
  const filePath = dataDirectoryPath + '/conversion.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  return data
}

exports.conversionData = getConversionData()
