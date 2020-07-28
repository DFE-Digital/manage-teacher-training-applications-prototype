const weighted = require('weighted')

module.exports = (faker, params = {}) => {
  const nationalities = {
    british: ['British'],
    irish: ['Irish'],
    french: ['French'],
    dual: ['French', 'Swiss'],
    multiple: ['British', 'French', 'Swiss']
  }
  const selectedNationality = weighted.select({
    british: 0.65,
    irish: 0.05,
    french: 0.1,
    dual: 0.1,
    multiple: 0.1
  })
  const nationality = nationalities[selectedNationality]

  // Flag international candidate (does not have British/Irish nationality)
  const isInternationalCandidate = !(nationality.includes('British') || nationality.includes('Irish'))
  const rightToWorkStudy = faker.helpers.randomize([
    'Yes',
    'Not yet',
    'Do not know'
  ])

  const residency = isInternationalCandidate ? {
    rightToWorkStudy,
    details: (rightToWorkStudy === 'Yes') ? 'I have EU settled status' : false
  } : false

  return {
    givenName: params.givenName || faker.name.firstName(),
    familyName: params.familyName || faker.name.lastName(),
    dateOfBirth: faker.date.between('1958-01-01', '1998-01-01'),
    nationality,
    residency,
    isInternationalCandidate
  }
}
