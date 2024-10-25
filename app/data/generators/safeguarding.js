const { fakerEN_GB: faker } = require('@faker-js/faker')


module.exports = () => {
  let response = faker.helpers.randomize([true])

  let details;

  if(response) {
    details = "I have an offence from a job I held in 2002."
  }

  return { response, details }
}
