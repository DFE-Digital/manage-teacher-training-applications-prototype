

const faker = require('faker')
faker.locale = 'en_GB'

exports.firstName = (sex) => {
  if(sex === 'male') {
    return faker.helpers.randomize([
      'Tony',
      'Thor',
      'Henry',
      'Robert',
      'Steve',
      'Clinton',
      'Pietro',
      'Jacques',
      'Harry',
      'Luke',
      'Victor',
      'Samuel'
    ])
  } else {
    return faker.helpers.randomize([
      'Janet',
      'Wanda',
      'Natasha',
      'Heather',
      'Patricia',
      'Carol',
      'Jennifer',
      'Monica',
      'Barbara',
      'Bonita',
      'Susan',
      'Julia'
    ])
  }
}

exports.lastName = (sex) => {
  if(sex === 'Male') {
    return faker.helpers.randomize([
      'Stark',
      'Odinson',
      'Pym',
      'Banner',
      'Rogers',
      'Barton',
      'Pietro',
      'Maximoff',
      'Cleese',
      'Charles',
      'Shade',
      'Wilson'
    ])
  } else {
    return faker.helpers.randomize([
      'van Dyne',
      'Maximoff',
      'Romanoff',
      'Douglas',
      'Walker',
      'Danvers',
      'Walters',
      'Rambeau',
      'Morse',
      'Juárez',
      'Richards',
      'Carpenter'
    ])
  }
}
