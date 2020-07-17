module.exports = (faker) => ({
  'given-name': faker.name.firstName(),
  'family-name': faker.name.lastName(),
  'date-of-birth': faker.date.between('1958-01-01', '1998-01-01'),
  nationality: 'British',
  'second-nationality': false
})
