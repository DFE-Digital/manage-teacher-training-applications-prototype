const faker = require('faker')
faker.locale = 'en_GB'

const { DateTime } = require('luxon')
const weighted = require('weighted')
const degreeData = require('../degree')

module.exports = (isInternationCandidate, dateOfBirth) => {

  let year = DateTime.fromISO(dateOfBirth).toObject().year
  year += 18

  const item = () => {
    const subject = faker.helpers.randomize(degreeData().subjects)
    const predicted = faker.datatype.boolean()
    const startYear = year
    const graduationYear = startYear + faker.datatype.number({ 'min': 3, 'max': 4 })

    if (isInternationCandidate) {
      return {
        type: 'Diplôme',
        subject,
        org: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        predicted,
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        },
        startYear,
        graduationYear
      }
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

      return {
        type: type.value + (grade.includes('honours') ? ' (Hons)' : ''),
        subject,
        institution: faker.helpers.randomize(degreeData().orgs),
        country: 'United Kingdom',
        grade,
        predicted,
        startYear,
        graduationYear
      }
    }
  }

  const count = weighted.select({
    1: 0.8,
    2: 0.2
  })
  const items = []
  for (var i = 0; i < count; i++) {
    items.push(item(faker))
  }

  return items
}
