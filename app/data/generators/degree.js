const weighted = require('weighted')
const degreeData = require('../degree')

module.exports = (faker) => {
  const item = (faker) => {
    const provenance = faker.helpers.randomize(['domestic', 'international'])
    const subject = faker.helpers.randomize(degreeData().subjects)
    const predicted = faker.random.boolean()
    const startDate = '2017'
    const endDate = '2020'

    if (provenance === 'domestic') {
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
        provenance,
        type: type.value + (grade.includes('honours') ? ' (Hons)' : ''),
        subject,
        org: faker.helpers.randomize(degreeData().orgs),
        country: 'United Kingdom',
        grade,
        predicted,
        startDate,
        endDate
      }
    } else {
      return {
        provenance,
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
        startDate,
        endDate
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
