module.exports = (faker) => {
  const item = (faker) => ({
    role: faker.name.jobTitle(),
    org: faker.company.companyName(),
    'worked-with-children': faker.helpers.randomize(['Yes', 'No']),
    'start-date': faker.date.past(),
    'end-date': faker.date.past(),
    'time-commitment': faker.lorem.sentences(1)
  })

  const count = faker.random.number({ min: 1, max: 4 })
  const items = []
  for (var i = 0; i < count; i++) {
    items.push(item(faker))
  }

  return items
}
