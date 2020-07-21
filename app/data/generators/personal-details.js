const weighted = require('weighted')

module.exports = (faker) => {
  const nationalities = {
    british: ['British'],
    irish: ['Irish'],
    french: ['French'],
    dual: ['French', 'Swiss'],
    multiple: ['British', 'French', 'Swiss']
  }
  const selectedNationality = weighted.select({
    british: 0.6,
    irish: 0.1,
    french: 0.1,
    dual: 0.1,
    multiple: 0.1
  })
  const nationality = nationalities[selectedNationality]

  // Flag international candidate (does not have British/Irish nationality)
  let isInternationalCandidate = true
  if (nationality.includes('British') || nationality.includes('Irish')) {
    isInternationalCandidate = false
  }

  return {
    'given-name': faker.name.firstName(),
    'family-name': faker.name.lastName(),
    'date-of-birth': faker.date.between('1958-01-01', '1998-01-01'),
    nationality,
    isInternationalCandidate
  }
}
