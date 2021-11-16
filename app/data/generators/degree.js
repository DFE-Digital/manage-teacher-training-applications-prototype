const faker = require('faker')
faker.locale = 'en_GB'

const { DateTime } = require('luxon')
const weighted = require('weighted')
const degreeData = require('../degree')

module.exports = (isInternationCandidate, dateOfBirth) => {

  // Start year - 18 years after date of birth
  let year = DateTime.fromISO(dateOfBirth).toObject().year
  year += 18

  const nowYear = DateTime.now().year

  // 80% of candidates have 1 degree
  const count = weighted.select({
    1: 0.8,
    2: 0.2
  })

  const degrees = []

  // TODO: start year for second degree must be after first
  for (let i = 0; i < count; i++) {
    let degree = {}

    degree.subject = faker.helpers.randomize(degreeData().subjects)

    if (i > 0) {
      degree.startYear = degrees[i-1].startYear + faker.datatype.number({ 'min': 1, 'max': 10 })
    } else {
      degree.startYear = year
    }

    degree.graduationYear = degree.startYear + faker.datatype.number({ 'min': 3, 'max': 4 })

    // If graduationYear after this year, set predicted true
    degree.predicted = (degree.graduationYear > nowYear) ? true : false

    if (isInternationCandidate) {

      degree.type = 'Diplôme'
      degree.institution = 'University of Paris'
      degree.country = 'France'
      degree.grade = 'Pass'

      degree.naric = {}
      degree.naric.reference = '4000228363'
      degree.naric.comparable = 'Bachelor (Honours) degree'

    } else {

      const type = faker.helpers.randomize(degreeData().types.all)
      const level = type.level
      const grade = faker.helpers.randomize([
        'First-class honours',
        'Upper second-class honours (2:1)',
        'Lower second-class honours (2:2)',
        'Third-class honours',
        'Pass',
        ...(level !== 6) ? ['Merit'] : [],
        ...(level !== 6) ? ['Distinction'] : [],
        ...(level !== 6) ? ['Not applicable'] : [],
        ...(level !== 6) ? ['Unknown'] : []
      ])

      degree.type = type.value + (grade.includes('honours') ? ' (Hons)' : '')
      degree.institution = faker.helpers.randomize(degreeData().orgs)
      degree.country = 'United Kingdom'
    }

    degrees.push(degree)
  }

  return degrees
}
