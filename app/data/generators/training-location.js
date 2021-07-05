const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {
  return faker.helpers.randomize([
    'Main Site',
    'Epsom Grinstead - training location',
    'Camberley - training location',
    'Lingfield - training location'
  ])
}
