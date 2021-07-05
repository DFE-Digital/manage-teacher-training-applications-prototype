const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => ({
  items: [{
    id: faker.datatype.uuid(),
    message: faker.lorem.paragraph(),
    sender: faker.name.findName(),
    date: faker.date.past()
  }]
})
