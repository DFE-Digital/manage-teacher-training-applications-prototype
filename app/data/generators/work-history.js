module.exports = (faker) => {
  const item = (faker) => {
    const jobType = faker.helpers.randomize(['job', 'break'])
    if (jobType === 'job') {
      return {
        role: faker.name.jobTitle(),
        org: faker.company.companyName(),
        type: faker.helpers.randomize(['Full time', 'Part time']),
        description: faker.lorem.paragraphs(2),
        workedWithChildren: faker.helpers.randomize(['Yes', 'No']),
        category: 'job',
        startDate: faker.date.past(),
        endDate: false
      }
    } else {
      return {
        description: 'I volunteered with a marine conservation charity in the Seychelles as part of a career break.',
        category: 'break',
        duration: `${faker.random.number({ min: 1, max: 12 })} months`,
        startDate: faker.date.past(),
        endDate: faker.date.past()
      }
    }
  }

  const count = faker.random.number({ min: 0, max: 8 })
  const items = []
  for (var i = 0; i < count; i++) {
    items.push(item(faker))
  }

  return items
}
