const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {
  const hasExperience = faker.helpers.randomize([true, false])
  if(hasExperience) {
    const count = faker.datatype.number({ min: 1, max: 4 })
    const items = []
    for (var i = 0; i < count; i++) {
      items.push({
        role: faker.name.jobTitle(),
        org: faker.company.companyName(),
        workedWithChildren: faker.helpers.randomize(['Yes', 'No']),
        startDate: faker.date.past(),
        endDate: faker.date.past(),
        timeCommitment: faker.lorem.sentences(1)
      })
    }
    return items
  }

}
