

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
      'Samuel',
      'Bruce',
      'Wade',
      'Harold',
      'Peter',
      'James',
      'Taneleer',
      'Herman'
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
      'Julia',
      'Virgina',
      'Kara Lynn',
      'Hela'
    ])
  }
}

exports.lastName = () => {
  return faker.helpers.randomize([
    'Stark',
    'Odinson',
    'Pym',
    'Banner',
    'Rogers',
    'Barton',
    'Pietro',
    'Cleese',
    'Charles',
    'Shade',
    'Wilson',
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
    'Carpenter',
    'Hogan',
    'Octavius',
    'Quill',
    'Schultz',
    'Tivan'
  ])
}
