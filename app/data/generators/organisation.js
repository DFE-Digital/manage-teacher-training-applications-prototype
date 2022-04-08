const faker = require('faker')
faker.locale = 'en_GB'

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
