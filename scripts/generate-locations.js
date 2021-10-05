const faker = require('faker')
faker.locale = 'en_GB'
const fs = require('fs')
const path = require('path')

// const generateLocation = require('../app/data/generators/location')

// const generateFakeLocation = (params = {}) => {
//   return generateLocation(params)
// }

const generateFakeLocations = (count) => {
  const locations = [{
    id: faker.datatype.uuid(),
    name: 'Main site',
    address: {
      address1: '123 Main Street',
      address2: '',
      address3: '',
      town: 'Some town',
      postcode: 'AB1 2CD'
    }
  }, {
    id: faker.datatype.uuid(),
    name: 'Queen’s campus',
    address: {
      address1: 'Amory Building',
      address2: 'Rennes Drive',
      address3: '',
      town: 'Big City',
      postcode: 'SW1A 4AA'
    }
  }, {
    id: faker.datatype.uuid(),
    name: 'Malet Place',
    address: {
      address1: 'Gordon Square',
      address2: '',
      address3: '',
      town: 'Small City',
      postcode: 'BA2 3DC'
    }
  }]

  return locations
}

const generateLocationsFile = (filePath, count) => {
  const locations = generateFakeLocations(count)
  const fileData = JSON.stringify(locations, null, 2)
  fs.writeFile(
    filePath,
    fileData,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Location data generated: ${filePath}`)
    }
  )
}

generateLocationsFile(path.join(__dirname, '../app/data/locations.json'), 3)
