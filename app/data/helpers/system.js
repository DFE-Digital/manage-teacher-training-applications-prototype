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
    minute: 0
  })
}

exports.sex = [
  'Female',
  'Male'
]

exports.ethnicity = [
  "Asian or Asian British",
  "Black, African, Black British or Caribbean",
  "Mixed or multiple ethnic groups",
  "White",
  "Another ethnic group",
  "Prefer not to say"
]

exports.nationality = [
  'British',
  'British (Dual)',
  'Irish',
  'Europe',
  'Rest of world'
]

exports.cycles = [
  '2019 to 2020',
  '2020 to 2021'
]

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

exports.subjectLevels = [
  'Primary',
  'Secondary',
  'Further education'
]

exports.fundingTypes = [
  'Fee paying',
  'Salary',
  'Apprenticeship'
]

exports.trainingLocations = [
  'Main site',
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

const getTrainingProviders = () => {
  const filePath = dataDirectoryPath + '/organisations.json'
  const rawData = fs.readFileSync(filePath)
  const organisations = JSON.parse(rawData).filter(data => data.isAccreditedBody === false).map((organisation) => {
    return organisation.name
  })
  return organisations
}

exports.trainingProviders = getTrainingProviders()

const getAccreditedBodies = () => {
  const filePath = dataDirectoryPath + '/organisations.json'
  const rawData = fs.readFileSync(filePath)
  const organisations = JSON.parse(rawData).filter(data => data.isAccreditedBody === true).map((organisation) => {
    return organisation.name
  })
  return organisations
}

exports.accreditedBodies = getAccreditedBodies()

const getCountries = () => {
  const filePath = dataDirectoryPath + '/countries.json'
  const rawData = fs.readFileSync(filePath)
  const countries = JSON.parse(rawData).map((country) => {
    return country
  })
  return countries
}

exports.countries = getCountries()
