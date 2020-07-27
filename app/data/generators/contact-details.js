module.exports = (faker, personalDetails) => {
  if (personalDetails.isInternationalCandidate) {
    faker.locale = 'fr'
  } else {
    faker.locale = 'en_GB'
  }

  return {
    tel: faker.phone.phoneNumber(),
    email: faker.internet.email(personalDetails['given-name'], personalDetails['family-name']).toLowerCase(),
    address: {
      line1: faker.address.streetAddress(),
      line2: '',
      level2: faker.address.city(),
      level1: personalDetails.isInternationalCandidate ? faker.address.state() : faker.address.county(),
      'postal-code': faker.address.zipCode(),
      ...(personalDetails.isInternationalCandidate && { country: 'France' })
    }
  }
}
