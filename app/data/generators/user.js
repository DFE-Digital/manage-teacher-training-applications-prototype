module.exports = (faker, params = {}) => {
  return {
    id: faker.string.uuid(),
    firstName: params.firstName || faker.person.firstName(),
    lastName: params.lastName || faker.person.lastName(),
    emailAddress: params.emailAddress || faker.person.emailAddress(),
    organisation: params.organisation,
    permissions: params.permissions
  }
}
