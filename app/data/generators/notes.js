module.exports = (faker) => ({
  items: [{
    id: faker.random.uuid(),
    subject: 'Talk to candidate on 15 June',
    body: faker.lorem.paragraph(),
    sender: faker.name.findName(),
    date: faker.date.past()
  }]
})
