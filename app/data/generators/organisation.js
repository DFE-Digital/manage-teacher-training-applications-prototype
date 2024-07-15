const faker = require('@faker-js/faker').faker

module.exports = (params = {}) => {
  return {
    id: faker.datatype.uuid(),
    name: params.name,
    permissions: params.permissions,
    isAccreditedBody: params.isAccreditedBody,
    partners: params.partners,
    domain: params.domain
  }
}
