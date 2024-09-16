const { fakerEN_GB: faker } = require('@faker-js/faker')
const fs = require('fs')
const path = require('path')

const OrgHelper = require('../app/data/helpers/organisation')

const generateFakeLocations = (count) => {

  let locations = []

  const organisation = OrgHelper.findOrg('Birmingham SCITT')

  // remove unnecessary data
  delete organisation.isAccreditedBody
  delete organisation.domain

  // TODO: generate locations per organisation
  locations.push({
    id: faker.string.uuid(),
    name: 'Main site',
    address: {
      address1: '123 Main Street',
      // address2: '',
      // address3: '',
      town: 'Some town',
      postcode: 'AB1 2CD'
    },
    organisation: organisation
  })

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
