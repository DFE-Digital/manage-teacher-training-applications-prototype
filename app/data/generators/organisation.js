module.exports = (faker, params = {}) => {
  const providerSuffix = faker.helpers.randomize([
    'Academy Alliance',
    'School',
    'SCITT',
    'TSA',
    'University'
  ])

  const providerName = `${faker.address.city()} ${providerSuffix}`

  return {
    id: faker.random.uuid(),
    name: params.providerName || providerName,
    enabled: true,
    isaccreditedbody: typeof params.isaccreditedbody !== "undefined" ? params.isaccreditedbody : faker.random.boolean(),
    ratifiedby: params.ratifiedby || 'Teaching Excellence SCITT',
    locations: {
      address: 'An address'
    }
  }
}
