module.exports = (faker, params = {}) => {
  const providerSuffix = faker.helpers.randomize([
    'Academy Alliance',
    'School',
    'SCITT',
    'TSA',
    'University'
  ])

  const isAccreditedBody = typeof params.isAccreditedBody === "boolean" ? params.isAccreditedBody : faker.random.boolean();

  const name = params.name || `${faker.address.city()} ${providerSuffix}`;

  return {
    id: faker.random.uuid(),
    name,
    isAccreditedBody
  }
}
