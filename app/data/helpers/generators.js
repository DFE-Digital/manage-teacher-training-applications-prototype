const { fakerEN_GB: faker } = require('@faker-js/faker')

const fs = require('fs')
const path = require('path')

exports.firstName = (sex) => {
  if (sex === 'male') {
    return faker.helpers.randomize([
      'Bruce',
      'Clinton',
      'Harold',
      'Harry',
      'Henry',
      'Herman',
      'Jacques',
      'James',
      'Luke',
      'Peter',
      'Pietro',
      'Robert',
      'Samuel',
      'Steve',
      'Taneleer',
      'Thor',
      'Tony',
      'Victor',
      'Wade'
    ])
  } else {
    return faker.helpers.randomize([
      'Barbara',
      'Bonita',
      'Carol',
      'Heather',
      'Hela',
      'Jane',
      'Janet',
      'Jennifer',
      'Julia',
      'Kara Lynn',
      'Monica',
      'Natasha',
      'Patricia',
      'Susan',
      'Virgina',
      'Wanda'
    ])
  }
}

exports.lastName = () => {
  return faker.helpers.randomize([
    'Banner',
    'Barton',
    'Carpenter',
    'Charles',
    'Cleese',
    'Danvers',
    'Douglas',
    'Foster',
    'Hogan',
    'Juárez',
    'Maximoff',
    'Morse',
    'Octavius',
    'Odinson',
    'Pym',
    'Quill',
    'Rambeau',
    'Richards',
    'Rogers',
    'Romanoff',
    'Schultz',
    'Shade',
    'Stark',
    'Tivan',
    'van Dyne',
    'Walker',
    'Walters',
    'Wilson'
  ])
}

exports.getCourseData = (provider) => {
  const filePath = path.join(__dirname, '../courses.json')
  const rawData = fs.readFileSync(filePath)
  let courses = JSON.parse(rawData)
  courses = courses.filter(course => (course.trainingProvider.name === provider.name) || (course.accreditedBody.name === provider.name))
  return courses
}
