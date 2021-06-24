module.exports = (faker) => ({
  items: [{
    id: faker.datatype.uuid(),
    message: faker.lorem.paragraph(),
    sender: faker.name.findName(),
    date: faker.date.past()
  }]
})
