const faker = require('faker')
faker.locale = 'en_GB'
const subjects = require('../subjects.json')

module.exports = (faker) => {
  const subject = faker.helpers.randomize(subjects)
  return subject
}
