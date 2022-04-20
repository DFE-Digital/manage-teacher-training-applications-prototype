const { DateTime } = require('luxon')

const path = require('path')
const fs = require('fs')

const dataDirectoryPath = path.join(__dirname, '../')

exports.getCheckboxValues = (name, data) => {
  return name && (Array.isArray(name) ? name : [name].filter((name) => {
    return name !== '_unchecked'
  })) || data
}

exports.now = () => {
  return DateTime.now().set({
    hour: 0,
    minute: 0,
    second: 0
  })
}
