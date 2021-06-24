module.exports = (faker, params = {}) => {
  return {
    id: faker.datatype.uuid(),
    firstName: params.firstName || faker.name.firstName(),
    lastName: params.lastName || faker.name.lastName(),
    emailAddress: params.emailAddress || faker.name.emailAddress(),
    organisation: params.organisation,
    permissions: params.permissions
  }
}
