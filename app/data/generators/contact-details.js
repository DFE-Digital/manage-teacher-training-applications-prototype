module.exports = (personalDetails) => {
  let faker = require('@faker-js/faker').fakerEN_GB
  if (personalDetails.isInternationalCandidate) {
    faker = require('@faker-js/faker').fakerFR
  }

  return {
    tel: faker.phone.phoneNumber(),
    email: faker.internet.email(personalDetails.givenName, personalDetails.familyName).toLowerCase(),
    address: {
      line1: faker.address.streetAddress(),
      line2: '',
      level2: faker.address.city(),
      level1: personalDetails.isInternationalCandidate ? faker.address.state() : faker.address.county(),
      postcode: faker.address.zipCode(),
      ...(personalDetails.isInternationalCandidate && { country: 'France' })
    },
    addressType: personalDetails.isInternationalCandidate ? 'international' : 'uk'
  }
}
