const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {
  const answer = faker.helpers.randomize(['yes', 'no-work-history', 'no--in-full-time-education'])
  const reason = (answer === 'no-work-history') ? 'I was unemployed': null;
  const items = []
  const count = faker.datatype.number({ min: 0, max: 8 })

  if(answer === 'yes') {
    for (var i = 0; i < count; i++) {
      const jobType = faker.helpers.randomize(['job', 'break'])
      if (jobType === 'job') {
        items.push({
          role: faker.name.jobTitle(),
          org: faker.company.companyName(),
          type: faker.helpers.randomize(['Full time', 'Part time']),
          relevantToTeaching: faker.helpers.randomize(['Yes', 'No']),
          category: 'job',
          startDate: faker.date.past(),
          isStartDateApproximate: faker.helpers.randomize([true, false, false, false]),
          endDate: false,
          isEndDateApproximate: false
        })
      } else {
        items.push({
          description: 'I volunteered with a marine conservation charity in the Seychelles as part of a career break.',
          category: 'break',
          duration: `${faker.datatype.number({ min: 1, max: 12 })} months`,
          startDate: faker.date.past(),
          endDate: faker.date.past()
        })
      }
    }
  }

  return { answer, reason, items }

}
