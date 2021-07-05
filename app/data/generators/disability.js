const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {
  let response = faker.helpers.randomize([true])

  let details;

  if(response) {
    details = "I need wheelchair access."
  }

  return { response, details }
}
