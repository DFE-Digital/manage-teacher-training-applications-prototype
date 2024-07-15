module.exports = (personalDetails) => {
  let faker = require('@faker-js/faker').fakerUK
  if (personalDetails.isInternationalCandidate) {
    faker = require('@faker-js/faker').fakerFR
  }

  return {
    tel: faker.phone.number(),
    email: faker.internet.email({
      firstName: personalDetails.givenName,
      lastName: personalDetails.familyName
    }
    ).toLowerCase(),
    address: {
      line1: faker.location.streetAddress(),
      line2: '',
      level2: faker.location.city(),
      level1: personalDetails.isInternationalCandidate ? faker.location.state() : faker.location.county(),
      postcode: faker.location.zipCode(),
      ...(personalDetails.isInternationalCandidate && { country: 'France' })
    },
    addressType: personalDetails.isInternationalCandidate ? 'international' : 'uk'
  }
}
