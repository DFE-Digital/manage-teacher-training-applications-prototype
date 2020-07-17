module.exports = (faker) => {
  const item = (faker) => {
    const jobType = faker.helpers.randomize(['job', 'break'])
    if (jobType === 'job') {
      return {
        role: faker.name.jobTitle(),
        org: faker.company.companyName(),
        type: faker.helpers.randomize(['Full time', 'Part time']),
        description: faker.lorem.paragraphs(2),
        'worked-with-children': faker.helpers.randomize(['Yes', 'No']),
        category: 'job',
        'start-date': faker.date.past(),
        'end-date': false
      }
    } else {
      return {
        description: 'I attended a semester exchange programme, allowing me to study abroad at the University of Strasbourg.',
        category: 'break',
        duration: `${faker.random.number({ min: 1, max: 12 })} months`,
        'start-date': faker.date.past(),
        'end-date': faker.date.past()
      }
    }
  }

  const count = faker.random.number({ min: 1, max: 8 })
  const items = []
  for (var i = 0; i < count; i++) {
    items.push(item(faker))
  }

  return items
}
