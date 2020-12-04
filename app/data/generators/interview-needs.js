const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {
  let response = faker.helpers.randomize([true])

  let details;

  if(response) {
    details = faker.helpers.randomize([
      'I have employment commitments',
      'I’ll be travelling a long way to get to the interview',
      'I use a wheelchair'
    ])
  }

  return { response, details }
}
