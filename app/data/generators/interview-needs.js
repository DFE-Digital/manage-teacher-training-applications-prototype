const { fakerEN_GB: faker } = require('@faker-js/faker')

module.exports = () => {
  let response = faker.helpers.arrayElement([true, false])

  let details;

  if(response) {
    details = faker.helpers.arrayElement([
      'I have employment commitments',
      'I’ll be travelling a long way to get to the interview',
      'I use a wheelchair'
    ])
  }

  return { response, details }
}
