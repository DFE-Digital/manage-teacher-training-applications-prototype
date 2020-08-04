const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'

const generateOrganisation = require('../app/data/generators/organisation')

const generateFakeOrganisation = (params = {}) => {
  return generateOrganisation(faker, params)
}

const generateFakeOrganisations = (count) => {
  const organisations = []

  organisations.push(generateFakeOrganisation())
  organisations.push(generateFakeOrganisation())

  organisations.push(generateFakeOrganisation({
    providerName: "AIM Alliance Schools",
    isaccreditedbody: false,
    ratifiedby: "Middlesex University"
  }))

  return organisations
}

const generateOrganisationsFile = (filePath, count) => {
  const organisations = generateFakeOrganisations(count)
  const filedata = JSON.stringify(organisations, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Organisation data generated: ${filePath}`)
    }
  )
}

generateOrganisationsFile(path.join(__dirname, '../app/data/organisations.json'), 5)
