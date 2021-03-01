module.exports = (faker) => ({
  items: [{
    id: faker.random.uuid(),
    message: faker.lorem.paragraph(),
    sender: faker.name.findName(),
    date: faker.date.past()
  }]
})
