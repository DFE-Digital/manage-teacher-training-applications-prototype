const { fakerEN_GB: faker } = require('@faker-js/faker')

module.exports = () => {
  let response = faker.helpers.arrayElement([true])

  let details;

  if(response) {
    details = "I need wheelchair access."
  }

  return { response, details }
}
