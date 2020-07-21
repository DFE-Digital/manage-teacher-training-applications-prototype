module.exports = (faker, personalDetails) => ({
  tel: faker.phone.phoneNumber(),
  email: faker.internet.email(personalDetails['given-name'], personalDetails['family-name']).toLowerCase(),
  address: {
    line1: faker.address.streetAddress(),
    line2: '',
    level2: faker.address.city(),
    level1: faker.address.county(),
    'postal-code': faker.address.zipCode()
  }
})
