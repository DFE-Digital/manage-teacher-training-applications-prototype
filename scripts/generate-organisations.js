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

  let org1 = generateFakeOrganisation({
    name: "Springbank SCITT",
    isAccreditedBody: true,
  })

  let org2 = generateFakeOrganisation({
    name: "Kingston University",
    isAccreditedBody: true
  })

  let org3 = generateFakeOrganisation({
    name: "Wren Academy",
    isAccreditedBody: false
  })

  let org4 = generateFakeOrganisation({
    name: "The Royal Borough Teaching School Alliance",
    isAccreditedBody: false
  })

  organisations.push(org1)
  organisations.push(org2)
  organisations.push(org3)
  organisations.push(org4)

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
