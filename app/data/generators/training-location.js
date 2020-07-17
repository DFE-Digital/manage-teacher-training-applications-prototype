module.exports = (faker) => {
  return faker.helpers.randomize([
    'Main Site',
    'Epsom Grinstead - training location',
    'Camberley - training location',
    'Lingfield - training location'
  ])
}
