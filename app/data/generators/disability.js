module.exports = (faker) => {
  let response = faker.helpers.randomize([false, true])

  let details;

  if(response) {
    details = "I need wheelchair access."
  }

  return { response, details }
}
