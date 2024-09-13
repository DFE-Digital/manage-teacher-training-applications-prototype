const { fakerEN_GB: faker } = require('@faker-js/faker')

module.exports = (params = {}) => {
  return {
    id: faker.string.uuid(),
    name: params.name,
    permissions: params.permissions,
    isAccreditedBody: params.isAccreditedBody,
    partners: params.partners,
    domain: params.domain
  }
}
