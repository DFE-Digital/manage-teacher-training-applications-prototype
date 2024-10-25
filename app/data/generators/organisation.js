const { fakerEN_GB: faker } = require('@faker-js/faker')


module.exports = (params = {}) => {
  return {
    id: faker.datatype.uuid(),
    name: params.name,
    permissions: params.permissions,
    isAccreditedBody: params.isAccreditedBody,
    partners: params.partner,
    domain: params.domain,
    locations: params.locations
  }
}
