module.exports = (faker) => ({
  tel: faker.phone.phoneNumber(),
  email: faker.internet.email().toLowerCase(),
  address: {
    line1: faker.address.streetAddress(),
    line2: '',
    level2: faker.address.city(),
    level1: faker.address.county(),
    'postal-code': faker.address.zipCode()
  }
})
