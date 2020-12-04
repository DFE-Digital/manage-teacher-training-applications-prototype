const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {
  let response = faker.helpers.randomize([true])

  let details;

  if(response) {
    details = "I have an offence from a job I held in 2002."
  }

  return { response, details }
}
