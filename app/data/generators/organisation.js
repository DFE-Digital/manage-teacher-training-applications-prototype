module.exports = (faker) => {
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
    name: providerName,
    enabled: true,
    isaccreditedbody: faker.random.boolean(),
    ratifiedby: 'Teaching Excellence SCITT',
    locations: {
      address: 'An address'
    }
  }
}
