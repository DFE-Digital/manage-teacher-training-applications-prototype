const subjects = require('../subjects.json')

module.exports = (faker) => {
  const subject = faker.helpers.randomize(subjects)
  return subject
}
