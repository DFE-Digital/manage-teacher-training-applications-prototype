module.exports = (faker, params = {}) => {
  return {
    id: faker.random.uuid(),
    name: params.name,
    permissions: params.permissions,
    isAccreditedBody: params.isAccreditedBody,
    partners: params.partners
  }
}
