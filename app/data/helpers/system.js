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
  return DateTime.now()
}

exports.cycles = [
  '2019 to 2020',
  '2020 to 2021'
]

exports.statuses = [
  'Received',
  'Awaiting decision',
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

const getReasonsForRejection = () => {
  const filePath = dataDirectoryPath + '/reasons-for-rejection.json'
  const rawData = fs.readFileSync(filePath)
  const reasons = JSON.parse(rawData).map((reason) => {
    return reason
  })
  return reasons
}

exports.reasonsForRejection = getReasonsForRejection()

const getSubjects = () => {
  const filePath = dataDirectoryPath + '/subjects.json'
  const rawData = fs.readFileSync(filePath)
  const subjects = JSON.parse(rawData).map((subject) => {
    return subject
  })
  return subjects
}

exports.subjects = getSubjects()

const getOrganisations = () => {
  const filePath = dataDirectoryPath + '/organisations.json'
  const rawData = fs.readFileSync(filePath)
  const organisations = JSON.parse(rawData).map((organisation) => {
    return organisation.name
  })
  return organisations
}

exports.organisations = getOrganisations()

const getCountries = () => {
  const filePath = dataDirectoryPath + '/countries.json'
  const rawData = fs.readFileSync(filePath)
  const countries = JSON.parse(rawData).map((country) => {
    return country
  })
  return countries
}

exports.countries = getCountries()
