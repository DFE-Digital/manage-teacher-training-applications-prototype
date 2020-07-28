module.exports = (faker) => {
  const item = (faker) => ({
    role: faker.name.jobTitle(),
    org: faker.company.companyName(),
    workedWithChildren: faker.helpers.randomize(['Yes', 'No']),
    startDate: faker.date.past(),
    endDate: faker.date.past(),
    timeCommitment: faker.lorem.sentences(1)
  })

  const count = faker.random.number({ min: 1, max: 4 })
  const items = []
  for (var i = 0; i < count; i++) {
    items.push(item(faker))
  }

  return items
}
