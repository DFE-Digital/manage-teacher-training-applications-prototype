const { DateTime } = require('luxon')

const path = require('path')
const fs = require('fs')

const dataDirectoryPath = path.join(__dirname, '../')

const getSubjects = () => {
  const filePath = dataDirectoryPath + '/subjects.json'
  const rawData = fs.readFileSync(filePath)
  const subjects = JSON.parse(rawData).map((subject) => {
    return subject.name
  })
  return subjects
}

const getOrganisations = () => {
  const filePath = dataDirectoryPath + '/organisations.json'
  const rawData = fs.readFileSync(filePath)
  const organisations = JSON.parse(rawData).map((organisation) => {
    return organisation.name
  })
  return organisations
}

exports.getCheckboxValues = (name, data) => {
  return name && (Array.isArray(name) ? name : [name].filter((name) => {
    return name !== '_unchecked'
  })) || data
}

exports.now = () => {
  return DateTime.now()
}

exports.statuses = [
  'Received',
  'Interviewing',
  'Offered',
  'Awaiting conditions',
  'Ready to enroll',
  'Conditions not met',
  'Deferred',
  'Declined',
  'Rejected',
  'Application withdrawn',
  'Offer withdrawn'
]

exports.studyModes = [
  'Full time',
  'Part time'
]

exports.studyLevel = [
  'Primary',
  'Secondary'
]

exports.fundingType = [
  'Fee paying',
  'Salary',
  'Apprenticeship'
]

exports.trainingLocations = [
  'Main Site',
  'Epsom Grinstead - training location',
  'Camberley - training location',
  'Lingfield - training location'
]

exports.subjects = getSubjects()

exports.organisations = getOrganisations()
